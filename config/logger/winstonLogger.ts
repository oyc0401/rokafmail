import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";
import moment from "moment-timezone";
import { Logger } from "./logger";

const logDir = "logs"; // logs 디렉토리 하위에 로그 파일 저장
const { combine, timestamp, label, printf } = winston.format;


export class WinstonLogger implements Logger {
  logger;
  constructor() {
    
    // Define log format
    const logFormat = printf((info) => {
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
    });

    const appendTimestamp = winston.format((info, opts) => {
      if (opts.tz)
        info.timestamp = moment().tz(opts.tz).format("YYYY-MM-DD HH:mm:ss -");
      return info;
    });

    /*
     * Log Level
     * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
     */

    this.logger = winston.createLogger({
      format: combine(
        appendTimestamp({ tz: "Asia/Seoul" }),
        logFormat,
      ),
      transports: [
        // info 레벨 로그를 저장할 파일 설정
        new winstonDaily({
          level: "debug",
          datePattern: "YYYY-MM-DD",
          dirname: logDir,
          filename: `%DATE%.debug.log`,
          maxFiles: 30, // 30일치 로그 파일 저장
          zippedArchive: true,
        }),

        new winstonDaily({
          level: "info",
          datePattern: "YYYY-MM-DD",
          dirname: logDir,
          filename: `%DATE%.log`,
          maxFiles: 30, // 30일치 로그 파일 저장
          zippedArchive: true,
        }),
        // error 레벨 로그를 저장할 파일 설정
        new winstonDaily({
          level: "error",
          datePattern: "YYYY-MM-DD",
          dirname: logDir + "/error", // error.log 파일은 /logs/error 하위에 저장
          filename: `%DATE%.error.log`,
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    let notalignColorsAndTime = winston.format.combine(
      winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`,
      ),
    );

    if (process.env.NODE_ENV !== "production") {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(), // 색깔 넣어서 출력
            notalignColorsAndTime,
          ),
        }),
      );
    }


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
