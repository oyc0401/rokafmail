import { describe, expect, test, beforeEach, jest, afterEach } from '@jest/globals';
import { labelLogger } from './labelLogger';
import { MemoryLogger } from './memoryLogger';
import { LoggerStore } from './loggerStore';

describe('로깅 테스트', () => {
  let loging = new MemoryLogger();

  beforeEach(() => {
    loging = new MemoryLogger();
    LoggerStore.setLogger(loging);

    // 가짜 타이머 사용 설정
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T09:00:00.000Z'));
  })

  afterEach(() => {
    // 가짜 타이머 사용 해제
    jest.useRealTimers();
  });

  describe('로그는 이렇게 만들어요', () => {
    test('로그는 이렇게 만들어요', async () => {
      const logger = labelLogger('라벨'); // 로그라벨 설정

      logger.info('하이');

      expect(loging.cat()).toBe('2024-01-01 09:00:00 - info: [라벨] 하이\n');
    });

    test('로그 두번', async () => {
      const logger = labelLogger('라벨'); // 로그라벨 설정

      logger.info('하이');
      logger.info('하이');

      expect(loging.cat()).toBe('2024-01-01 09:00:00 - info: [라벨] 하이\n2024-01-01 09:00:00 - info: [라벨] 하이\n');
    });

  });



});