import { Post, PostQueue } from "src/db";
import { makeLogger } from "config/winston";
const logger = makeLogger("Async Post");
import { sendMail, SendStatus, sendStatusToStr } from "./sendMail";

/**
 *  해당 id의 편지를 보내고, 실패시 큐에 넣기
 */
export async function asyncPost(postId: number) {

  // 편지를 보내고 결과값을 받는다.
  const status = await sendMail(postId);

  // 받은 상태에 때른 문자열 메시지 치환
  const logMessage = sendStatusToStr(status);


  // 이후에 db 수정하면 꼭 삭제할 것!!!!! (PostQueue.insert 때문에 억지로 추가함)
  const post = await Post.findById(postId);

  switch (status) {
    // 편지쓰기 이전, 성공, 수료 후에 편지를 쓰면 그냥 둔다.
    // 편지쓰기 이전에 보낸 편지들은 나중에 소대번호가 발견되면 다시 한번 보내질 것이고
    // 성공하거나 이후에 보낸 편지는 posted = true로 업데이트가 될 것이다.
    case SendStatus.success:
    case SendStatus.skip:
    case SendStatus.after:
      break;
    case SendStatus.error:
    case SendStatus.fail:
      // 오류가 나거나 실패하면 큐에 넣는다.
      await PostQueue.insert({ postId, userId: post!.userId });
  }

  logger.info(`(${postId}) | ${logMessage}`);
}