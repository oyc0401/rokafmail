import { repost, RepostStatus, statusToStr } from "./repostMailOnce";
import { makeLogger } from "config/winston";
const logger = makeLogger("sendPostQueues");

export async function sendPostQueues(
  unposted: {
    userId: number;
    postId: number;
    user: {
      username: string;
      generation: number;
      memberSeq: string | null;
      sodae: string | null;
    };
    post: {
      id: number;
      userId: number;
      name: string;
      relationship: string;
      title: string;
      contents: string;
      password: string;
      createdAt: Date;
      posted: boolean;
      postAt: Date | null;
    };
  }[],
  maxCount = 10,
) {
  const userPostCounts = {}; // userId별로 편지를 보낸 횟수를 추적할 객체

  logger.info(`count: ${unposted.length}`);

  let success = 0;
  let skippedDueToLimit = 0; // 10번 초과하여 스킵된 편지 수

  function statusMessage() {
    return `${success + skippedDueToLimit + 1}/${unposted.length}`;
  }

  try {
    for (const unpost of unposted) {
      // 현재 userId에 대한 편지 수 추적
      const userId = unpost.userId;

      // userId별로 편지보낸 횟수가 10 미만인 경우에만 post 호출
      if ((userPostCounts[userId] || 0) < maxCount) {
        const postId = unpost.postId;
        const { name, relationship, title, contents, password, createdAt } =
          unpost.post;
        const { memberSeq, sodae, generation, username } = unpost.user;

        if (!memberSeq || !sodae) {
          throw Error("유저 인증이 된 편지인데 소대번호가 없다?");
        }

        const result = await repost({
          postId,
          post: { name, relationship, title, contents, password, createdAt },
          user: { memberSeq, sodae, generation },
        });
        const postLogForm = `(${postId}) | ${username} (${userId})`;

        switch (result) {
          case RepostStatus.after:
            break;
          case RepostStatus.skip:
            // 편지쓰기 기간이 아닌데 큐에있으면 오류
            logger.error(
              `${statusMessage()}: ${postLogForm} | ${statusToStr(result)}`,
            );
            break;
          case RepostStatus.success:
          case RepostStatus.fail:
            logger.info(
              `${statusMessage()}: ${postLogForm} | ${statusToStr(result)}`,
            );
            break;
          case RepostStatus.error:
            throw Error(`국방부 인편 서버 오류 | ${postLogForm}`);
        }

        userPostCounts[userId] = (userPostCounts[userId] || 0) + 1;
        success++; // 보내졌으면 횟수 올리기
      } else {
        // 10번 초과 시 로그만 남김
        logger.info(`${statusMessage()}: Limit Exceeded - ${userId}`);
        skippedDueToLimit++;
      }
    }
  } catch (error) {
    logger.info(`${statusMessage()}: ${error}`);
    const msg = `Success: ${success}, Limit Exceeded: ${skippedDueToLimit}, Failed: ${
      unposted.length - success - skippedDueToLimit
    }`;
    logger.info(msg);
    return `${statusMessage()}: ${error}, ${msg}`;
  }

  const msg = `Success: ${success}, LimitExceeded: ${skippedDueToLimit}, Failed: ${
    unposted.length - success - skippedDueToLimit
  }`;

  logger.info(msg);
  return msg;
}
