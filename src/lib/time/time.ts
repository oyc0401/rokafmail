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

// 입대
export function getEnter(generation: number): dayjs.Dayjs {
  let [start] = timeDB(generation);
  return dayjs(start).add(-9, "hour").tz("Asia/Seoul"); // 시차 9시간 뺌
}

// 편지 시작
export function getMailStart(generation: number): dayjs.Dayjs {
  let date = getEnter(generation); // "입장" 날짜를 기준으로 시작
  let dayOfWeek = date.day(); // 현재 요일을 가져옴 (일요일 = 0, 월요일 = 1, ..., 토요일 = 6)

  console.log(dayOfWeek);

  // 요일별로 다음 월요일까지의 날짜를 계산
  if (dayOfWeek === 0) { // 일요일
    date = date.add(15, 'day'); // 다음주 월요일은 15일 후
  } else if (dayOfWeek === 6) { // 토요일
    date = date.add(16, 'day'); // 다음주 월요일은 16일 후
  } else { // 월요일부터 금요일
    date = date.add(14 - (dayOfWeek - 1), 'day'); // 다음 월요일까지의 날짜 계산
  }

  // 해당 날짜에 9시간을 추가
  return date.add(9, 'hour');
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

// export enum Status {
//   beforeEnter,
//   beforeMail,
//   canMail,
//   beforeCompletion,
//   afterCompletion,
//   afterDischarge,
// }

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
  //console.log(now, date)
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
