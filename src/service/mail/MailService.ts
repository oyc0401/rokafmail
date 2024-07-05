import { getNow, Status } from "src/lib/time";
import { Letter, PostRepository } from "src/repository/post/postRepository";
import { PostQueue } from "src/repository/postQueue/postQueue";
import { RokafClientInterface } from "../rokafClient/RokafClientInterface";
import { labelLogger } from "config/logger/labelLogger";
import { RokafTime } from "src/lib/time/rokafTime";
import { UserRepository } from "src/repository/user/userRepository";

const MAX_COUNT = 10;

export enum SendResponse { before, notfound, success, fail, error }

export class MailService {
  private rokafClient: RokafClientInterface;
  private postRepository: PostRepository;
  private userRepository: UserRepository;
  private postQueue: PostQueue;

  constructor({ postRepository, userRepository, postQueue, rokafClient }) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
    this.postQueue = postQueue;
    this.rokafClient = rokafClient;
  }

  /**
   * 편지를 보낼 때 편지큐는 '프로필이 있는' 훈련병이 편지만 존재한다.
   */
  async sendLetter(userId: number, letter: Letter) {
    const logger = labelLogger("SendLetter");

    const { name, relationship, title, contents, password, isPublic } = letter;
    // 편지 저장
    const newPost = await this.postRepository.insert({
      userId, name, relationship,
      title, contents, password, isPublic
    });

    const { id: postId } = newPost;

    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('유저가 없습니다.')

    // 연결되었으면 편지를 보낸다.
    // 편지를 보내다 오류가 나면 큐에 저장합니다.
    if (user.connect) {
      const logStatus = (status: SendResponse) =>
        logger.info(`(${postId}) | ${sendStatusToStr(status)}`);

      this.sendMailFalseEnqueue(postId).then(logStatus);

    } else {
      logger.info(`(${postId}) | BeforeMailTime`)
    }
    return postId;
  }

  async awaitSendLetter(userId: number, letter: Letter) {
    const logger = labelLogger("AwaitSendLetter");

    const { name, relationship, title, contents, password, isPublic } = letter;
    // 편지 저장
    const newPost = await this.postRepository.insert({
      userId, name, relationship,
      title, contents, password, isPublic
    });

    const { id: postId } = newPost;

    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('유저가 없습니다.')

    // 연결되었으면 편지를 보낸다.
    // 편지를 보내다 오류가 나면 큐에 저장합니다.
    if (user.connect) {
      const logStatus = (status: SendResponse) =>
        logger.info(`(${postId}) | ${sendStatusToStr(status)}`);

      await this.sendMailFalseEnqueue(postId).then(logStatus);

    } else {
      logger.info(`(${postId}) | BeforeMailTime`)
    }
    return postId;
  }

  /**
   * 해당 id의 편지를 보내고 보내졌다고 업데이트하고, 결과 enum 리턴하기
  **/
  async sendMail(postId: number,
    event: { onFalse?: (postQueue: PostQueue) => Promise<any> } = {}): Promise<SendResponse> {
    const post = await this.postRepository.findByIdWithUser(postId);
    if (!post) throw Error(`id가 ${postId}인 편지를 찾을 수 없습니다.`);

    const { name, relationship, title, contents, password, createdAt } = post;
    const { memberSeq, sodae, generation } = post.user;

    const status = RokafTime.getStatus(generation);

    const updatePost = async (postId: number) =>
      this.postRepository.update(postId, { posted: true, postAt: getNow() });


    switch (status) {
      case Status.before:
      case Status.beginning:
        return SendResponse.before;
      case Status.training:
        if (!memberSeq || !sodae) {
          return SendResponse.notfound;
        }

        const postComplete = await this.rokafClient.postMail(
          {
            name,
            relationship,
            title,
            contents,
            password,
            memberSeq,
            sodae,
          },
          createdAt,
        );

        // 국방서버에 보내는 요청
        if (!postComplete.serverOn) {
          await event.onFalse?.(this.postQueue);
          return SendResponse.error;
        }

        if (postComplete.complete) {
          await updatePost(postId);
          return SendResponse.success;
        } else {
          await event.onFalse?.(this.postQueue);
          return SendResponse.fail;
        }

      case Status.ending:
      case Status.working:
      case Status.discharged:
        // if (!memberSeq || !sodae) {
        //   return SendResponse.notfound;
        // }
        // 특학인편 하지말자 ~
        // 편지쓰기 기간 이후에 전송하면 보내졌다고 치기
        await updatePost(postId);
        return SendResponse.success;
    }
  }

  async sendMailFalseEnqueue(postId: number) {
    return await this.sendMail(postId, {
      onFalse: async (queue) => {
        // 오류가 나거나 실패하면 큐에 넣는다.
        await queue.insert(postId);
      }
    });
  }


  // 해당 유저의 모든 미발송 편지들을 다시 보내기
  async sendUnpostedMails(userId: number) {
    const logger = labelLogger("SendUnpostedMails");
    const posts = await this.postRepository.findNotPostedByUserId(userId);

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];

      if (i < MAX_COUNT) {

        const response = await this.sendMailFalseEnqueue(post.id);
        logger.info(`(${post.id}) | ${sendStatusToStr(response)}`)

      } else {
        // 한번에 많이 보내지 않게 나머지는 큐에 넣음
        await this.postQueue.insert(post.id);
        logger.info(`(${post.id}) | Limit`)
      }
    }

  }


}

export function sendStatusToStr(status: SendResponse) {
  switch (status) {
    case SendResponse.before:
      return `QueueAdded - BeforeMailTime`;
    case SendResponse.notfound:
      return `QueueAdded - ProfileNotFound`;
    case SendResponse.success:
      return `Complete`;
    case SendResponse.error:
      return `QueueAdded - ServerError`;
    case SendResponse.fail:
      return `QueueAdded - Fail`;
  }
}


export interface Letter {
  name: string;
  relationship: string;
  title: string;
  contents: string;
  password: string;
  isPublic: boolean;
}