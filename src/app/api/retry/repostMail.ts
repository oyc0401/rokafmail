import { PostQueue } from "src/db";
import { repost, RepostStatus } from "./repostMailOnce";
import { makeLogger } from "config/winston";
const logger = makeLogger("repostMail");

export async function repostMail() {
  const unposted = await PostQueue.findAll();
  const userPostCounts = {}; // userId별로 편지를 보낸 횟수를 추적할 객체

  logger.info(`count: ${unposted.length}`);

  let success = 0;
  let skippedDueToLimit = 0; // 10번 초과하여 스킵된 편지 수

  function statusMessage() {
    return `${success + skippedDueToLimit + 1}/${unposted.length}`;
  }
  
  for (const unpost of unposted) {
    try {
      // 현재 userId에 대한 편지 수 추적
      const userId = unpost.userId;

      // userId별로 편지가 10번 이하인 경우에만 post 호출
      if (userPostCounts[userId] <= 10) {
        const postId = unpost.postId;
        const { name, relationship, title, contents, password } = unpost.post;
        const { memberSeq, sodae, generation } = unpost.user;

        if (!memberSeq || !sodae) {
          throw Error("유저 인증이 된 편지인데 소대번호가 없다?");
        }

        const result = await repost({
          postId,
          post: { name, relationship, title, contents, password },
          user: { memberSeq, sodae, generation },
        });
        switch (result) {
          case RepostStatus.success:
            userPostCounts[userId] = (userPostCounts[userId] || 0) + 1;
            logger.info(`${statusMessage()}: success`);

            break;
          case RepostStatus.skip:
            logger.info(`${statusMessage()}: skip`);
          case RepostStatus.after:
            logger.info(`${statusMessage()}: after`);
          case RepostStatus.error:
            throw Error("국방부 인편 서버 오류");
        }
        success++; // 보내졌으면 횟수 올리기
      } else {
        // 10번 초과 시 로그만 남김
        logger.info(`${statusMessage()}: Limit exceeded - ${userId}`);
        skippedDueToLimit++;
      }
    } catch (error) {
      logger.info(`${statusMessage()}: ${error}`);
    }
  }

  logger.info(
    `success: ${success}, skipped: ${skippedDueToLimit}, failed: ${
      unposted.length - success - skippedDueToLimit
    }`,
  );
}
