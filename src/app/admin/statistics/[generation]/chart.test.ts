
import { describe, expect, test } from '@jest/globals';
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isBetween from "dayjs/plugin/isBetween";
import { objToList } from './chart';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);
dayjs.tz.setDefault("Asia/Seoul")

describe('chart', () => {

  test('obj to list', () => {
    const dataObject = {
      '06.04': 6,
      '06.05': 4,
      '06.07': 2,
      '06.08': 21,
      '06.10': 3,
    };

    const period = {
      startDate: '2024-06-03',
      endDate: '2024-06-10',
    }
    const list = objToList(dataObject, period);

    expect(list.length).toBe(8)
    // console.log(list)
  });
})

