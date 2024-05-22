import MockRokafClient from './rokafClient/MockRokafClient';
import { MemoryUserRepository } from 'src/repository/user/memoryUserRepository';
import { UserService } from './user/UserService';
import { MemoryUserQueue } from 'src/repository/userQueue/memoryUserQueue';
import { MemoryLogger } from 'config/memoryLogger';
import { MemoryPostRepository } from 'src/repository/post/memoryPostRepository';
import { MemoryPostQueue } from 'src/repository/postQueue/memoryPostQueue';
import { MailService } from './mail/MailService';
import { RetryService } from './retry/retryService';
import { LogConfig } from 'config/logger';

export function testBean() {
  let postRepository = new MemoryPostRepository();
  let postQueue = new MemoryPostQueue(postRepository);

  let rokafClient = new MockRokafClient();
  let mailService = new MailService({ postRepository, postQueue, rokafClient });
  let userRepository = new MemoryUserRepository();
  let userQueue = new MemoryUserQueue(userRepository);
  postRepository.join(userRepository);

  let userService = new UserService({ userRepository, userQueue, rokafClient, mailService });
  let retryService = new RetryService({ mailService, userService, postQueue, userQueue });
  let logger = new MemoryLogger();
  LogConfig.setLogger(logger);

  return {
    postRepository, userRepository, postQueue, userQueue,
    rokafClient, mailService, userService, retryService,
    logger,
  }
}