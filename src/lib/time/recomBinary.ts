
import dayjs from 'dayjs';
import { store } from './DB';

export function getRecommendGenerationBinary(date: Date): number {
  const targetDate = dayjs(date);
  const generations = Object.keys(store).map(Number);

  let left = 0;
  let right = generations.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const startDateStr = store[generations[mid]][0];
    const startDate = dayjs(startDateStr);
    const enlistmentThreshold = startDate.subtract(7, 'day');

    if (enlistmentThreshold.isAfter(targetDate)) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  if (left === 0) {
    return 830; 
  }

  return generations[right];
}