import dayjs, { Dayjs } from "dayjs";
import { Period } from "./period";

export function listToChartData(list: { id: number, createdAt: Date }[], period: Period) {
  const userObj = dbSelectionToObj(list);
  const chartData = objToList(userObj, period);
  return chartData;
}

export function dbSelectionToObj(data: { id: number, createdAt: Date }[]) {
  const counts = {};

  data.forEach(item => {
    // ISO 날짜에서 YYYY-MM-DD 형식만 추출
    const date = dayjs(item.createdAt).format('MM.DD')
    // 해당 날짜의 카운트를 증가시키거나 초기화
    if (counts[date]) {
      counts[date]++;
    } else {
      counts[date] = 1;
    }
  });

  return counts;
}

export function objToList(object: { [key: string]: number; }, period: Period) {
  const startDate = dayjs(period.startDate);
  const finalDate = dayjs(period.endDate);

  let currentDate = startDate;

  const list: { date: string, count: number }[] = [];

  while (currentDate <= finalDate) {
    const date = currentDate.format('MM.DD');
    list.push({ date: date, count: object[date] ?? 0 });
    currentDate = currentDate.add(1, 'day');  // 날짜 증가
  }

  return list;
}

