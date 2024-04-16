import { PostQueue } from "src/db";

import { makeLogger } from "config/winston";
const logger = makeLogger("repostMail");
import { asyncPost } from "../service/asyncPost";

export async function repostMail() {

  const unposted = await PostQueue.findAll();
  for (const post of unposted) {
    await asyncPost(post.id);

  }
}
