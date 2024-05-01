import { getNow, serveStatus, Status } from "src/lib/time";
import { PostRepository } from "src/repository/post/postRepository";
import { createLogger } from "config/logger";
const logger = createLogger("MailService");

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
  async sendMail(postId: number): Promise<SendResponse> {
    const post = await this.postRepository.findById(postId);
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
        if (!postComplete.serverOn) return SendResponse.error;

        if (postComplete.complete) {
          await updatePost(postId);
          return SendResponse.success;
        } else {
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
          const msg = await this._repostMail(top.postId, top.userId);

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

  async _repostMail(postId: number, userId: number) {

    // 편지를 보내고 결과값을 받는다.
    const status = await this.sendMail(postId);

    switch (status) {
      // 편지쓰기 이전, 성공, 수료 후에 편지를 쓰면 그냥 둔다.
      // 편지쓰기 이전에 보낸 편지들은 나중에 소대번호가 발견되면 다시 한번 보내질 것이고
      // 성공하거나 이후에 보낸 편지는 posted = true로 업데이트가 될 것이다.
      case SendResponse.before:
      case SendResponse.success:
        break;
      case SendResponse.error:
      case SendResponse.fail:
        await this.postQueueRepository.insert({ postId, userId });
        break;
    }

    // 받은 상태에 때른 문자열 메시지 치환
    return sendStatusToStr(status);
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