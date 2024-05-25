import { getNow, serveStatus, Status } from "src/lib/time";
import { InputPost, Post, PostRepository } from "src/repository/post/postRepository";
import { createLogger } from "config/logger";
import { PostQueue } from "src/repository/postQueue/postQueue";
import { RokafClientInterface } from "../rokafClient/RokafClientInterface";
import { Trainee } from "../user/Trainee";
const logger = createLogger("MailService");

const MAX_COUNT = 10;

export enum SendResponse { before, notfound, success, fail, error }

export class MailService {
  private rokafClient: RokafClientInterface;
  private postRepository: PostRepository;
  private postQueue: PostQueue;
  constructor({ postRepository, postQueue, rokafClient }) {
    this.postRepository = postRepository;
    this.postQueue = postQueue;
    this.rokafClient = rokafClient;
  }

  /**
   * 편지를 보낼 때 편지큐는 '프로필이 있는' 훈련병이 편지만 존재한다.
   */
  async sendLetter(trainee: Trainee, letter: InputPost) {
    const { userId, name, relationship, title, contents, password, isPublic } = letter;
    // 편지 저장
    const newPost = await this.postRepository.insert({
      userId, name, relationship,
      title, contents, password, isPublic
    });

    const { id: postId } = newPost;

    // 연결되었으면 편지를 보낸다.
    // 편지를 보내다 오류가 나면 큐에 저장합니다.
    if (trainee.getConnect()) {
      const logStatus = (status: SendResponse) =>
        logger.info(`(${postId}) | ${sendStatusToStr(status)}`);

      this.sendMailFalseEnqueueTrainee(postId, newPost, trainee).then(logStatus);

    } else {
      logger.info(`(${postId}) | BeforeMailTime`)
    }
    return postId;
  }

  async sendMailFalseEnqueueTrainee(postId: number, letter: Post, trainee: Trainee) {
    return await this.sendMailTrainee(postId, letter, trainee, {
      onFalse: async (queue) => {
        // 오류가 나거나 실패하면 큐에 넣는다.
        await queue.insert(postId);
      }
    });
  }

  async sendMailTrainee(postId: number, letter: Post, trainee: Trainee,
    event: { onFalse?: (postQueue) => Promise<any> } = {}): Promise<SendResponse> {

    const { name, relationship, title, contents, password, createdAt } = letter;
    const { memberSeq, sodae } = trainee;

    const status = trainee.currentStatus();

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



  /**
   * 해당 id의 편지를 보내고 보내졌다고 업데이트하고, 결과 enum 리턴하기
   * 주의사항:
   * 해당 id를 가진 Post가 DB에 있어야합니다.
   * 편지가능 기간 이전에 해당 함수를 호출하면 안됩니다.
   * 에러 다수 던짐
  **/
  async sendMail(postId: number,
    event: { onFalse?: (postQueue) => Promise<any> } = {}): Promise<SendResponse> {
    const post = await this.postRepository.findByIdWithUser(postId);
    if (!post) throw Error(`id가 ${postId}인 편지를 찾을 수 없습니다.`);

    const { name, relationship, title, contents, password, createdAt } = post;
    const { memberSeq, sodae, generation } = post.user;

    const status = serveStatus(generation);

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
    const posts = await this.postRepository.findNotPostedByUserId(userId);

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];

      if (i < MAX_COUNT) {
        const response = await this.sendMail(post.id, {
          onFalse: async (queue) =>
            await queue.insert({ postId: post.id, userId: post.userId })
        })
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