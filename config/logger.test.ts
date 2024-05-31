import { describe, expect, test, beforeEach, jest, afterEach } from '@jest/globals';
import { LogConfig } from './logger';
import { MemoryLogger } from './memoryLogger';

describe('로깅 테스트', () => {
  let loging = new MemoryLogger();

  beforeEach(() => {
    loging = new MemoryLogger();
    LogConfig.setLogger(loging);
  })

  describe('로그는 이렇게 만들어요', () => {
    test('로그는 이렇게 만들어요', async () => {
      const logger = labelLogger('라벨'); // 로그라벨 설정
      
      logger.info('하이'); // 전역 로거에 전달.
    });
  })

});