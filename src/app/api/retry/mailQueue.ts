import { PostQueue } from "src/db";
import { makeLogger } from "config/winston";
const logger = makeLogger("Mail Queue");
import { sendMail, SendStatus, sendStatusToStr } from "src/app/api/service/sendMail";

/**
 * 큐에 있는 모든 편지 보내기
 */
export async function sendAllMails() {
  const unposted = await PostQueue.findAll();

  // 큐에 있는 모든 편지들을 한번씩 보내기
  for (let i = 0; i < unposted.length; i++) {
    const post = unposted[i];
    // 성공시 큐에서 제거하기
    await _repostQueue(post.id).then(msg => {
      logger.info(`${i+1}/${unposted.length} (${post.id}) ${msg}`);
    });
  }
}

/**
 *  해당 id의 편지를 보내고, 실패시 큐에 넣기
 */
async function _repostQueue(postId: number) {

  // 편지를 보내고 결과값을 받는다.
  const status = await sendMail(postId);

  switch (status) {
    // 편지쓰기 이전, 성공, 수료 후에 편지를 쓰면 그냥 둔다.
    // 편지쓰기 이전에 보낸 편지들은 나중에 소대번호가 발견되면 다시 한번 보내질 것이고
    // 성공하거나 이후에 보낸 편지는 posted = true로 업데이트가 될 것이다.
    case SendStatus.skip:
      // 편지 보내기 전에 큐에 들어오면 오류
      throw Error('편지 보내기 시간 전인데 큐에 들어있는 편지 보내기를 실행함');
    case SendStatus.success:
    case SendStatus.after:
      // 성공하면 큐에서 제거한다.
      await PostQueue.deleteByPostId(postId);
      break;
    case SendStatus.error:
    case SendStatus.fail:
      break;
  }

  // 받은 상태에 때른 문자열 메시지 치환
  return sendStatusToStr(status);
}