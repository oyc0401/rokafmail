import dayjs from "dayjs";
import { Logger } from "./logger";
import { format } from "./format";

export class UseMemoryLogger implements Logger {
  log: string[] = [];

  info(message: string) {
    const log = format({
      timestamp: dayjs().format('YYYY.MM.DD hh:mm:ss'),
      level: 'info',
      message: message,
    })
    this.log.push(log);
  }
  warn(message: string) {
    const log = format({
      timestamp: dayjs().format('YYYY.MM.DD hh:mm:ss'),
      level: 'warn',
      message: message,
    })
    this.log.push(log);
  }
  error(message: string) {
    const log = format({
      timestamp: dayjs().format('YYYY.MM.DD hh:mm:ss'),
      level: 'error',
      message: message,
    })
    this.log.push(log);
  }


  cat() {
    let msg = ''
    for (const log of this.log) {
      msg += `${log}\n`;
    }
    return msg;
  }
}
