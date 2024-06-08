import dayjs, { Dayjs } from "dayjs";
import { getCompletion, getEnter } from "src/lib/time";
import { timeDB } from "src/lib/time/DB";

export interface Period {
  startDate: string | Date | Dayjs,
  endDate: string | Date | Dayjs;
}

export function week() {
  return {
    startDate: dayjs().add(-7, 'day'),
    endDate: dayjs()
  }
}

export function fromGeneration(generation: number, past: number = 0) {
  return {
    startDate: getEnter(generation).add(-past, 'day'),
    endDate: getCompletion(generation)
  }
}
