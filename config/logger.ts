
import { makeLogger } from "./winston";

export class LogConfig {
  static createLogger = makeLogger;

  static setLogger(logger) {
    LogConfig.createLogger = (label) => logger.make(label);
  }

  static changeDefault() {
    LogConfig.createLogger = makeLogger;
  }
}


export function createLogger(label) {
  return new logObj(label);
}

class logObj {
  constructor(label) {
    this.label = label;
  }
  label;
  logger;

  getLogger() {
    if (this.logger == null) {
      this.logger = LogConfig.createLogger(this.label);
    }
    return this.logger;
  }

  info(text) {
    this.getLogger().info(text)
  }

  warn(text) {
    this.getLogger().warn(text)
  }

  error(text) {
    this.getLogger().error(text)
  }
}