import { PostRepository } from "src/server/repository/post/postRepository";
import { PostQueue } from "src/server/repository/postQueue/postQueue";
import { UserRepository } from "src/server/repository/user/userRepository";
import { UserQueue } from "src/server/repository/userQueue/userQueue";
import { MailService } from "src/server/service/mail/MailService";
import { RetryService } from "src/server/service/retry/retryService";
import { RokafClientInterface } from "src/server/service/rokafClient/RokafClientInterface";
import { UserService } from "src/server/service/user/UserService";

export interface BeanInterface {
  postRepository: PostRepository;
  userRepository: UserRepository;
  postQueue: PostQueue;
  userQueue: UserQueue;
  rokafClient: RokafClientInterface;
  mailService: MailService;
  userService: UserService;
  retryService: RetryService;
}