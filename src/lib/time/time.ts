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

// 시간

// 입대예정 ---- 입대 -- 편지시작 --- 편지 끝 - 훈련소 수료 -------- 전역자 --- 민간인
// 입대예정 / 편지 시작전 / 편지가능 / 편지끝 / 수료전 / 수료후 / 전역

/**
 * 주어진 날짜가 속한 주의 월요일을 반환하는 함수
 * @param {dayjs.Dayjs} date - 주어진 날짜
 * @returns {dayjs.Dayjs} 해당 주의 월요일
 */
function getProgramStart(generation: number): dayjs.Dayjs {
  const enter = getEnter(generation);

  let dayOfWeek = enter.day();
  return enter.subtract(dayOfWeek - 1, "day");
}

// 입대
export function getEnter(generation: number): dayjs.Dayjs {
  let [start] = timeDB(generation);
  return dayjs(start).add(-9, "hour").tz("Asia/Seoul"); // 시차 9시간 뺌
}
// 편지 시작
export function getMailStart(generation: number): dayjs.Dayjs {
  return getProgramStart(generation).add(14, "day").add(9, "hour"); // 잠시만 시차 9ㅅ
}

// 편지 마감
export function getMailEnd(generation: number): dayjs.Dayjs {
  return getProgramStart(generation).add(30, "day").add(17, "hour");
}

// 수료
export function getCompletion(generation: number): dayjs.Dayjs {
  return getProgramStart(generation).add(32, "day");
}

// 전역
export function getDischarge(generation: number): dayjs.Dayjs {
  let [, end] = timeDB(generation);
  return dayjs(end).tz("Asia/Seoul");
}

export enum Status {
  before, // 입대 전
  beginning, // 훈련 1, 2주차
  training, // 훈련 3, 4, 5주차
  ending, // 편지쓰기 기간 끝나고, 수료 전
  working, // 군 복무 중
  discharged, // 전역 후
}

/**  
 * 복무상태
 *
 switch (status) {
  case Status.before:
  case Status.beginning:
  case Status.training:
  case Status.ending:
  case Status.working:
  case Status.discharged:
}
 */

export function serveStatus(generation: number) {
  if (isFuture(getEnter(generation))) {
    return Status.before;
  } else if (isFuture(getMailStart(generation))) {
    return Status.beginning;
  } else if (isFuture(getMailEnd(generation))) {
    // 편지쓰기 가능
    return Status.training;
  } else if (isFuture(getCompletion(generation))) {
    return Status.ending;
  } else if (isFuture(getDischarge(generation))) {
    return Status.working;
  } else {
    return Status.discharged;
  }
}

export function canSearch(generation: number) {
  return isPast(getMailStart(generation).add(3, "day"));
}

// 기수의 입영일을 아는지
export function knowTime(generation: number) {
  return !isEmpty(generation);
}

/**
 * @deprecated use serveStatus()
 */
// 편지 보내는 기간인지

// 전역했는지
export function isDischarged(generation: number): boolean {
  if (generation < startGeneration) return true;
  if (!knowTime(generation)) return false;

  const now = dayjs().tz("Asia/Seoul");
  return getDischarge(generation).isBefore(now);
}

// 현재와 차이나는 날짜
export function diffDay(date: dayjs.Dayjs): number {
  const now = dayjs().tz("Asia/Seoul");
  return date.diff(now, "day");
}

// 해당 날짜가 과거인지
export function isPast(date: dayjs.Dayjs): boolean {
  const now = dayjs().tz("Asia/Seoul");
  return date.isBefore(now);
}

// 해당 날짜가 미래인지
export function isFuture(date: dayjs.Dayjs): boolean {
  const now = dayjs().tz("Asia/Seoul");
  return now.isBefore(date);
}

// 현재시각
export function getNow(): Date {
  return dayjs().tz("Asia/Seoul").toDate();
}

// 아직 메일쓰기 기간이 오지 않았을 때
export function mailStartIsFuture(generation: number): boolean {
  return isFuture(getMailStart(generation));
}

// 아직 메일쓰기 기간이 끝났을 때
export function mailEnded(generation: number): boolean {
  return isPast(getMailStart(generation));
}

// Date to Datejs
export function parseKorea(date: Date) {
  return dayjs(date).tz("Asia/Seoul");
}
