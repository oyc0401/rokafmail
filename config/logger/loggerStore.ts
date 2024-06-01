import { Logger } from "./logger"
import { WinstonLogger } from "./winstonLogger";
export class LoggerStore {
  static logger: Logger = new WinstonLogger();

  static setLogger(logger: Logger) {
    LoggerStore.logger = logger;
  }
}