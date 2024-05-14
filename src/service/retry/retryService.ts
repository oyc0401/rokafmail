import { getNow, serveStatus, Status } from "src/lib/time";
import { PostRepository } from "src/repository/post/postRepository";
import { createLogger } from "config/logger";
import { PostQueue } from "src/repository/postQueue/postQueue";
import dayjs from "dayjs";
import { MailService, sendStatusToStr } from "../mail/MailService";
import { UserService } from "../user/UserService";
const logger = createLogger("MailService");

export class RetryService {

  private postQueue: PostQueue;
  private mailService: MailService;
  private userService: UserService;
  constructor({ postQueue, mailService, userService }) {
    this.postQueue = postQueue;
    this.mailService = mailService;
    this.userService = userService;
  }

  /**
   * 해당 id의 편지를 보내고 보내졌다고 업데이트하고, 결과 enum 리턴하기
   * 주의사항:
   * 해당 id를 가진 Post가 DB에 있어야합니다.
   * 편지가능 기간 이전에 해당 함수를 호출하면 안됩니다.
   * 에러 다수 던짐
  **/
  async retryDelayedMail() {

    const userCountMap = {};
    const MAX_POSTCOUNT = 10;
    const now = new Date();

    let i = 0;
    let queueSize = await this.postQueue.size();

    try {
      while (!(await this.postQueue.empty())) {
        i++;

        const front = await this.postQueue.frontWithPost();
        if (front.createdAt > now) break;


        if (front.post.posted) {
          logger.info(`${i}/${queueSize} (${front.postId}) | 이미 보내졌습니다`);
        } else if ((userCountMap[front.post.userId] ?? 0) < MAX_POSTCOUNT) {
          const response = await this.mailService.sendMailFalseEnqueue(front.postId);
          logger.info(`${i}/${queueSize} (${front.id}) | ${sendStatusToStr(response)}`);
        } else {
          logger.info(`${i}/${queueSize} (${front.postId}) | 한도 초과`);
          await this.postQueue.insert(front.postId);
        }

        userCountMap[front.post.userId] = (userCountMap[front.post.userId] ?? 0) + 1;

        await this.postQueue.pop();
      }

    } catch (error) {
      logger.error(`${i}/${queueSize} | ${error}`)
    }
  }

}

