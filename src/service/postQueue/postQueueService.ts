import { getNow, serveStatus, Status } from "src/lib/time";
import { PostRepository } from "src/repository/post/postRepository";
import { MailService, SendResponse,sendStatusToStr } from "../mail/MailService";


export class PostQueueService {
  private postQueueRepository;
  private mailService: MailService;
  constructor({ postQueueRepository, mailService }) {
    this.postQueueRepository = postQueueRepository;
    this.mailService = mailService;
  }






}
