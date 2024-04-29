import { getNow, serveStatus, Status } from "src/lib/time";

export enum SendResponse { before, notfound, success, fail, error }

export class MailService {
  private rokafClient;
  private postRepository;
  constructor({ postRepository, rokafClient }) {
    this.postRepository = postRepository;
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
          await this.updatePost(postId);
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
        await this.updatePost(postId);
        return SendResponse.success;
    }
  }

  private async updatePost(postId) {
    await this.postRepository.update(postId, { posted: true, postAt: getNow() });
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