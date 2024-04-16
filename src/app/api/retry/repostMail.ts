import { PostQueue } from "src/db";
import { repost, RepostStatus } from "./repostMailOnce";
import { makeLogger } from "config/winston";
const logger = makeLogger("repostMail");
import { sendPostQueues } from "./sendPostQueues";

export async function repostMail() {
  
  const unposted = await PostQueue.findAll();
     sendPostQueues(unposted,10);
}
