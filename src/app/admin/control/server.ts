"use server";
import { bean } from "src/bean/bean";
import { RetryService } from "src/service/retry/retryService";

export async function repost() {
  const retryService = new RetryService(bean);
  await retryService.retryDelayedMail();
}

export async function verify() {
  const retryService = new RetryService(bean);
  await retryService.retryGetProfile();
}

export async function findNotQueueNotpost() {

  //console.log(notPosted);
}

