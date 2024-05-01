import { PostQueue } from "src/db";
import { makeLogger } from "config/winston";
const logger = makeLogger("Mail Queue");
import { sendMail, SendResponse, sendStatusToStr } from "src/app/api/service/sendMail";

/**
 * 큐에 있는 모든 편지 보내기
 */
export async function traversePostQueue() {
  const unposted = await PostQueue.findAll();

  const userCountMap = {};

  // 큐에 있는 모든 편지들을 한번씩 보내기
  for (let i = 0; i < unposted.length; i++) {
    const MAX_POSTCOUNT = 10;
    const top = unposted[i];

    try {
      if (top.post.posted) {
        logger.info(`${i + 1}/${unposted.length} (${top.postId}) | 이미 보내졌습니다`);

      } else if (userCountMap[top.userId] ?? 0 < MAX_POSTCOUNT) {
        const msg = await _repostMail(top.postId, top.userId);

        logger.info(`${i + 1}/${unposted.length} (${top.id}) | ${msg}`);
        userCountMap[top.userId] = userCountMap[top.userId] ?? 0 + 1;

      }
      else {
        // 나중에 다시 검사하게 insert
        logger.info(`${i + 1}/${unposted.length} (${top.postId}) | 한도 초과`);
        await PostQueue.insert({ postId: top.postId, userId: top.userId });
      }

      // queue.pop()
      await PostQueue.deleteById(top.id);

    } catch (error) {
      logger.error(`${i + 1}/${unposted.length} (${top.id}) | ${error}`)
    }
  }

}

/**
 * 해당 id의 편지를 보내기
 * 
 */
