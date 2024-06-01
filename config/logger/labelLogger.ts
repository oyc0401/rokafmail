import { LoggerStore } from "./loggerStore";

class LabelLogger {
  label: string;
  constructor(label: string) {
    this.label = label;
  }
  error(log: string) {
    LoggerStore.logger.error(`[${this.label}] ${log}`);
  }
  warn(log: string) {
    LoggerStore.logger.warn(`[${this.label}] ${log}`);
  }
  info(log: string) {
    LoggerStore.logger.info(`[${this.label}] ${log}`);
  }
}


export function labelLogger(label: string) {
  const logger = new LabelLogger(label);
  return logger
}