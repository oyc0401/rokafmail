import { getNow, serveStatus, Status } from "src/lib/time";
import { PostRepository } from "src/repository/post/postRepository";
import { createLogger } from "config/logger";
const logger = createLogger("MailService");

const MAX_COUNT = 10;

export enum SendResponse { before, notfound, success, fail, error }

export class MailService {
  private rokafClient;
  private postRepository: PostRepository;
  private postQueueRepository;
  constructor({ postRepository, postQueueRepository, rokafClient }) {
    this.postRepository = postRepository;
    this.postQueueRepository = postQueueRepository;
    this.rokafClient = rokafClient;
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
      // 테스트 편하게 풀어놓기
      case Status.ending:
      case Status.working:
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
          await event.onFalse?.(this.postQueueRepository);
          return SendResponse.error;
        }

        if (postComplete.complete) {
          await updatePost(postId);
          return SendResponse.success;
        } else {
          await event.onFalse?.(this.postQueueRepository);
          return SendResponse.fail;
        }

      // case Status.ending:
      // case Status.working:
      case Status.discharged:
        if (!memberSeq || !sodae) {
          return SendResponse.notfound;
        }
        // 특학인편 하지말자 ~
        // 편지쓰기 기간 이후에 전송하면 보내졌다고 치기
        await updatePost(postId);
        return SendResponse.success;
    }
  }

  async traversePostQueue() {
    const unposted = await this.postQueueRepository.findAll();

    const userCountMap = {};

    // 큐에 있는 모든 편지들을 한번씩 보내기
    for (let i = 0; i < unposted.length; i++) {
      const MAX_POSTCOUNT = 10;
      const top = unposted[i];

      try {
        if (top.post.posted) {
          logger.info(`${i + 1}/${unposted.length} (${top.postId}) | 이미 보내졌습니다`);

        } else if (userCountMap[top.userId] ?? 0 < MAX_POSTCOUNT) {
          const msg = await this.sendMail(
            top.postId,
            {
              onFalse: async (postQueue) => {
                await postQueue.insert({ postId: top.postId, userId: top.userId })
              }
            });

          logger.info(`${i + 1}/${unposted.length} (${top.id}) | ${msg}`);
          userCountMap[top.userId] = userCountMap[top.userId] ?? 0 + 1;

        }
        else {
          // 나중에 다시 검사하게 insert
          logger.info(`${i + 1}/${unposted.length} (${top.postId}) | 한도 초과`);
          await this.postQueueRepository.insert({ postId: top.postId, userId: top.userId });
        }

        // queue.pop()
        await this.postQueueRepository.deleteById(top.id);

      } catch (error) {
        logger.error(`${i + 1}/${unposted.length} (${top.id}) | ${error}`)
      }
    }

  }


  // 해당 유저의 모든 미발송 편지들을 다시 보내기
  async sendUnpostedMails(userId: number) {
    let posts = await this.postRepository.findNotPostedByUserId(userId);

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
        await this.postQueueRepository.insert({ postId: post.id, userId: post.userId });
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