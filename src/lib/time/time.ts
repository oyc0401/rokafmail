import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isBetween from "dayjs/plugin/isBetween";
import { timeDB, isEmpty, startGeneration } from "./DB";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

/** 포맷하고 싶으면 .format("YY.MM.DD") 붙이기 */

// 입대
export function getEnter(generation: number): dayjs.Dayjs {
  let [start] = timeDB(generation);
  return dayjs(start);
}

// 편지 시작
export function getMailStart(generation: number): dayjs.Dayjs {
  return getEnter(generation).add(14, "day").add(9, "hour");
}

// 편지 마감
export function getMailEnd(generation: number): dayjs.Dayjs {
  return getEnter(generation).add(30, "day").add(17, "hour");
}

// 수료
export function getCompletion(generation: number): dayjs.Dayjs {
  return getEnter(generation).add(32, "day");
}

// 전역
export function getDischarge(generation: number): dayjs.Dayjs {
  let [, end] = timeDB(generation);
  return dayjs(end);
}

// 기수의 입영일을 아는지
export function isContain(generation: number) {
  return !isEmpty(generation);
}

// 편지 보내는 기간인지
export function canPost(generation: number): boolean {
  const now = dayjs().tz("Asia/Seoul");
  return now.isBetween(getMailStart(generation), getMailEnd(generation));
}

// 전역했는지
export function isDischarged(generation: number): boolean {
  if (generation < startGeneration) return true;
  if (!isContain(generation)) return false;

  const now = dayjs().tz("Asia/Seoul");
  return getDischarge(generation).isBefore(now);
}

// 현재와 차이나는 날짜
export function diffDay(date: dayjs.Dayjs) {
  const now = dayjs().tz("Asia/Seoul");
  return now.diff(date, "day");
}
