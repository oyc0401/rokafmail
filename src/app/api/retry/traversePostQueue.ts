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
        
        const status = await sendMail(postId);
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
async function _repostMail(postId: number, userId: number) {

  // 편지를 보내고 결과값을 받는다.
  const status = await sendMail(postId);

  switch (status) {
    // 편지쓰기 이전, 성공, 수료 후에 편지를 쓰면 그냥 둔다.
    // 편지쓰기 이전에 보낸 편지들은 나중에 소대번호가 발견되면 다시 한번 보내질 것이고
    // 성공하거나 이후에 보낸 편지는 posted = true로 업데이트가 될 것이다.
    case SendResponse.before:
    case SendResponse.success:
      break;
    case SendResponse.error:
    case SendResponse.fail:
      await PostQueue.insert({ postId, userId });
      break;
  }

  // 받은 상태에 때른 문자열 메시지 치환
  return sendStatusToStr(status);
}