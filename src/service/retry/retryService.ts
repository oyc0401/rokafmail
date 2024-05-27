import { createLogger } from "config/logger";
import { PostQueue } from "src/repository/postQueue/postQueue";
import { MailService, sendStatusToStr } from "../mail/MailService";
import { UserService, syncResponse, syncResponseToStr } from "../user/UserService";
import { UserQueue } from "src/repository/userQueue/userQueue";
import { ProfileFactory } from "src/type/goodFactory";
import { Trainee } from "../user/Trainee";
const logger = createLogger("MailService");

export class RetryService {

  private postQueue: PostQueue;
  private userQueue: UserQueue;
  private mailService: MailService;
  private userService: UserService;
  constructor({ postQueue, userQueue, mailService, userService }) {
    this.postQueue = postQueue;
    this.userQueue = userQueue;
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
    const queueSize = await this.postQueue.size();

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


  async retryGetProfile() {
    const now = new Date();

    let i = 0;
    const queueSize = await this.userQueue.size();

    try {
      while (!(await this.userQueue.empty())) {
        i++;

        const front = await this.userQueue.frontWithUser();
        if (front.createdAt > now) break;

        const userId = front.userId;

        if (front.user.connect) {
          logger.info(`${i}/${queueSize}: (${userId}) | 이미 연결 됌`)
        } else {
          const trainee = await this.userService.getTrainee(userId);
          const status = await this.userService.searchProfileFailEnqueueTrainee(userId, trainee);
          if (status == syncResponse.complete) {
            await this.mailService.sendUnpostedMails(userId)
          }
          logger.info(`${i}/${queueSize}: (${userId}) | ${syncResponseToStr(status)}`)
        }

        await this.userQueue.pop();
      }

    } catch (error) {
      logger.error(`${i + 1}/${queueSize} | ${error}`)
    }
  }

}

