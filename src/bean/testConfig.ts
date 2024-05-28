import MockRokafClient from '../service/rokafClient/MockRokafClient';
import { MemoryUserRepository } from 'src/repository/user/memoryUserRepository';
import { UserService } from '../service/user/UserService';
import { MemoryUserQueue } from 'src/repository/userQueue/memoryUserQueue';
import { MemoryLogger } from 'config/memoryLogger';
import { MemoryPostRepository } from 'src/repository/post/memoryPostRepository';
import { MemoryPostQueue } from 'src/repository/postQueue/memoryPostQueue';
import { MailService } from '../service/mail/MailService';
import { RetryService } from '../service/retry/retryService';
import { LogConfig } from 'config/logger';
import { BeanInterface } from './beanInterface';

export function testBean(): BeanInterface & { logger: MemoryLogger, rokafClient: MockRokafClient } {
  const postRepository = new MemoryPostRepository();
  const postQueue = new MemoryPostQueue(postRepository);

  const rokafClient = new MockRokafClient();
  const mailService = new MailService({ postRepository, postQueue, rokafClient });
  const userRepository = new MemoryUserRepository();
  const userQueue = new MemoryUserQueue(userRepository);
  postRepository.join(userRepository);

  const userService = new UserService({ userRepository, userQueue, rokafClient, mailService });
  const retryService = new RetryService({ mailService, userService, postQueue, userQueue });
  const logger = new MemoryLogger();
  LogConfig.setLogger(logger);

  return {
    postRepository, userRepository, postQueue, userQueue,
    rokafClient, mailService, userService, retryService,
    logger,
  }
}