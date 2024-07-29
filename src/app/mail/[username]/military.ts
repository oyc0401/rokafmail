
import { getEnter, getCompletion, canSearch, Status, serveStatus, getDischarge } from "src/lib/time";
import dayjs, { Dayjs } from "dayjs";

export function getMilitaryRank(generation: number) {
  const status = serveStatus(generation);

  switch (status) {
    case Status.before:
    case Status.beginning:
    case Status.training:
    case Status.ending:
      return '훈련병';
  }

  const date = getEnter(generation);
  const now = dayjs();
  const diffMonths = now.diff(date, 'month');

  if (diffMonths < 2) {
    return '이병';
  } else if (diffMonths < 8) {
    return '일병';
  } else if (diffMonths < 14) {
    return '상병';
  } else if (diffMonths < 21) {
    return '병장';
  } else {
    return '민간인';
  }
}