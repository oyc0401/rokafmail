import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";

const logDir = "logs"; // logs 디렉토리 하위에 로그 파일 저장
const { combine, timestamp, label, printf } = winston.format;

// Define log format
const logFormat = printf((info) => {
  return `${info.timestamp} ${info.level}: [${info.label}] ${info.message}`;
});

const appendTimestamp = winston.format((info, opts) => {
  if (opts.tz)
    info.timestamp = moment().tz(opts.tz).format(" YYYY-MM-DD HH:mm:ss ||");
  return info;
});

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */

const makeLogger = (lab) => {
  const lo = winston.createLogger({
    format: combine(
      appendTimestamp({ tz: "Asia/Seoul" }),
      timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      label({ label: lab }),
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

  if (process.env.NODE_ENV !== "production") {
    lo.add(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(), // 색깔 넣어서 출력
          notalignColorsAndTime,
          // winston.format.simple(),  // `${info.level}: ${info.message} JSON.stringify({ ...rest })` 포맷으로 출력
        ),
      }),
    );
  }

  return lo;
};

const logger = winston.createLogger({
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
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
    (info) => `${info.level}: [${info.label}] ${info.message}`,
  ),
);

// Production 환경이 아닌 경우(dev 등)
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // 색깔 넣어서 출력
        notalignColorsAndTime,
        // winston.format.simple(),  // `${info.level}: ${info.message} JSON.stringify({ ...rest })` 포맷으로 출력
      ),
    }),
  );
}

export { logger, makeLogger };
