import { PostQueue } from "src/db";
import { makeLogger } from "config/winston";
const logger = makeLogger("Mail Queue");
import { sendMail, SendResponse, sendStatusToStr } from "src/app/api/service/sendMail";

/**
 * 큐에 있는 모든 편지 보내기
 */
export async function sendAllMails() {
  const unposted = await PostQueue.findAll();

  const userCountMap = {};



  // 큐에 있는 모든 편지들을 한번씩 보내기
  for (let i = 0; i < unposted.length; i++) {
    const MAX_POSTCOUNT = 10;
    const post = unposted[i];
    try {
      if (userCountMap[post.userId] ?? 0 < MAX_POSTCOUNT) {
        // 성공시 큐에서 제거하기
        await _repostMail(post.id, post.userId).then(msg => {
          logger.info(`${i + 1}/${unposted.length} (${post.id}) | ${msg}`);
        });
        userCountMap[post.userId] = userCountMap[post.userId] ?? 0 + 1;
      } else {
        // pop하고, insert해서 맨 뒤로 가게 하기
        await PostQueue.deleteByPostId(post.id);
        await PostQueue.insert({ postId: post.id, userId: post.userId });
      }

    } catch (error) {
      logger.error(`${i + 1}/${unposted.length} (${post.id}) | ${error}`)
    }
  }


}

/**
 * 해당 id의 편지를 보내고, 성공시 큐에서 제거
 * ※ asyncPost와 구조가 비슷합니다.
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
      // 성공하면 큐에서 제거한다.
      await PostQueue.deleteByPostId(postId);
      break;
    case SendResponse.error:
    case SendResponse.fail:
      // pop하고, insert해서 맨 뒤로 가게 하기
      await PostQueue.deleteByPostId(postId);
      await PostQueue.insert({ postId, userId });
      break;
  }

  // 받은 상태에 때른 문자열 메시지 치환
  return sendStatusToStr(status);
}