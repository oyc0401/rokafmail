import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(timezone);
import { Logger } from "./logger";
import { format } from "./format";

const logDir = "logs"; // logs 디렉토리 하위에 로그 파일 저장
const { combine, timestamp, label, printf } = winston.format;


export class WinstonLogger implements Logger {
  logger;
  constructor() {

    // Define log format
    const logFormat = printf(format);

    const appendTimestamp = winston.format((info, opts) => {
      if (opts.tz)
        info.timestamp = dayjs().tz(opts.tz).format("YYYY-MM-DD HH:mm:ss");
      return info;
    });

    /*
     * Log Level
     * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
     */

    const transports = [];

    // Vercel 환경에서는 콘솔만 사용
    if (process.env.VERCEL) {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(format),
          ),
        })
      );
    } else {
      // 로컬 환경에서는 파일 + 콘솔 사용
      transports.push(
        new winstonDaily({
          level: "debug",
          datePattern: "YYYY-MM-DD",
          dirname: logDir,
          filename: `%DATE%.debug.log`,
          maxFiles: 30,
          zippedArchive: true,
        }),
        new winstonDaily({
          level: "info",
          datePattern: "YYYY-MM-DD",
          dirname: logDir,
          filename: `%DATE%.log`,
          maxFiles: 30,
          zippedArchive: true,
        }),
        new winstonDaily({
          level: "error",
          datePattern: "YYYY-MM-DD",
          dirname: logDir + "/error",
          filename: `%DATE%.error.log`,
          maxFiles: 30,
          zippedArchive: true,
        })
      );

      // 개발 모드면 색깔 넣어서 출력
      if (process.env.NODE_ENV !== "production") {
        transports.push(
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.colorize(),
              winston.format.printf(format),
            ),
          })
        );
      }
    }

    this.logger = winston.createLogger({
      format: combine(
        appendTimestamp({ tz: "Asia/Seoul" }),
        logFormat,
      ),
      transports,
    });
  }
  error(log: string) {
    this.logger.error(log);
  }
  warn(log: string) {
    this.logger.warn(log);
  }
  info(log: string) {
    this.logger.info(log);
  }

}
