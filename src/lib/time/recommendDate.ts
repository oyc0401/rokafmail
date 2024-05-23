import { store } from './DB'

import dayjs from 'dayjs';

// 날짜에 따른 추천하는 기수 보여주기
export function getRecommendGeneration(date: Date): number {
  const targetDate = dayjs(date);
  const generations = Object.keys(store).map(Number);

  for (let i = generations.length - 1; i >= 0; i--) {
    const generation = generations[i];
    const [startDateStr] = store[generation];
    const startDate = dayjs(startDateStr);
    const enlistmentThreshold = startDate.subtract(7, 'day');

    if (targetDate.isAfter(enlistmentThreshold) || targetDate.isSame(enlistmentThreshold)) {
      return generation;
    }
  }

  return generations[0]; // DB에 있는 첫 번째 기수보다 이전 날짜는 830을 반환
}