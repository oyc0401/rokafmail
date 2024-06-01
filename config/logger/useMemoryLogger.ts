import dayjs from "dayjs";
import { Logger } from "./logger";

export class UseMemoryLogger implements Logger {
  log: string[] = [];

  info(message: string) {
    const log = this.format({
      timestamp: dayjs().format('YYYY.MM.DD hh:mm:ss'),
      level: 'info',
      message: message,
    })
    this.log.push(log);
  }
  warn(message: string) {
    const log = this.format({
      timestamp: dayjs().format('YYYY.MM.DD hh:mm:ss'),
      level: 'warn',
      message: message,
    })
    this.log.push(log);
  }
  error(message: string) {
    const log = this.format({
      timestamp: dayjs().format('YYYY.MM.DD hh:mm:ss'),
      level: 'error',
      message: message,
    })
    this.log.push(log);
  }

  format(info: { timestamp, level, message }) {
    const width = 5;
    const length = info.level.length;
    let level = `${info.level}`;

    if (length < width) {
      // Add spaces to make the length 5
      while (level.length < width) {
        level += " ";
      }
    } else if (length > width) {
      // Trim the string to make the length 5
      level = level.substring(0, width);
    }
    return `${info.timestamp} ${level}: ${info.message}`;
  };


  cat() {
    let msg = ''
    for (const log of this.log) {
      msg += `${log}\n`;
    }
    return msg;
  }
}
