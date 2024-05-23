import { getRecommendGenerationLinear } from './recomLinear'; // 선형 탐색 파일 경로
import { getRecommendGenerationBinary } from './recomBinary'; // 이분 탐색 파일 경로
import { describe, expect, test, it } from '@jest/globals';

describe('성능 비교 테스트', () => {
  const testDate = new Date("2024-05-30");
  const iterations = 100000;

  it('선형 탐색 성능 테스트', () => {
    console.time('Linear Search');
    for (let i = 0; i < iterations; i++) {
      getRecommendGenerationLinear(testDate);
    }
    console.timeEnd('Linear Search');
  });

  it('이분 탐색 성능 테스트', () => {
    console.time('Binary Search');
    for (let i = 0; i < iterations; i++) {
      getRecommendGenerationBinary(testDate);
    }
    console.timeEnd('Binary Search');
  });
});
