import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(timezone);
const logDir = "logs"; // logs 디렉토리 하위에 로그 파일 저장
const { combine, timestamp, label, printf } = winston.format;

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
  return `${info.timestamp} ${level}: [${info.label}] ${info.message}`;
});

const appendTimestamp = winston.format((info, opts) => {
  if (opts.tz)
    info.timestamp = dayjs().tz(opts.tz).format("YYYY-MM-DD HH:mm:ss -");
  return info;
});

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */

const makeLogger = (lab) => {
  const transports = [];

  // Vercel 환경에서는 콘솔만 사용
  if (process.env.VERCEL) {
    transports.push(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          notalignColorsAndTime,
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

    if (process.env.NODE_ENV !== "production") {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            notalignColorsAndTime,
          ),
        })
      );
    }
  }

  const lo = winston.createLogger({
    format: combine(
      appendTimestamp({ tz: "Asia/Seoul" }),
      label({ label: lab }),
      logFormat,
    ),
    transports,
  });

  return lo;
};

let notalignColorsAndTime = winston.format.combine(
  winston.format.printf(
    (info) => `${info.level}: [${info.label}] ${info.message}`,
  ),
);


export { makeLogger };
