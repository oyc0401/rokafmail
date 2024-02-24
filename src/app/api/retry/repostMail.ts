import { PostQueue } from "src/db";
import { repost, RepostStatus } from "./repostMailOnce";
import { makeLogger } from "config/winston";
const logger = makeLogger("repostMail");
import { postUnposteds } from "./postUnposteds";

export async function repostMail() {
  const unposted = await PostQueue.findAll();
  await postUnposteds(unposted);
}
