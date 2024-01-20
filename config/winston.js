import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";

const logDir = "logs"; // logs 디렉토리 하위에 로그 파일 저장
const { combine, timestamp, label, printf } = winston.format;

// Define log format
// const logFormat = printf((info) => {
//   return `${info.timestamp} ${info.level}: [${info.label}] ${info.message}`;
// });

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */

const logFormat = (info) => `${info.level}: [${info.label}] ${info.message}`;

const log = (info) => console.log(logFormat(info));

import chalk from "chalk";

export const makeLogger = (label) => {
  if (process.env.NODE_ENV !== "production") {
    return {
      error: (message) =>
        log({
          level: chalk.red("error"),
          label: label,
          message: message,
        }),
      warn: (message) =>
        log({
          level: chalk.yellow("warn"),
          label: label,
          message: message,
        }),
      info: (message) =>
        log({
          level: chalk.green("info"),
          label: label,
          message: message,
        }),
      http: (message) => {},
      verbose: (message) => {},
      debug: (message) => {},
      silly: (message) => {},
    };
  } else {
    return {
      error: (message) =>
        log({
          level: chalk.red("error"),
          label: label,
          message: message,
        }),
      warn: (message) =>
        log({
          level: chalk.yellow("warn"),
          label: label,
          message: message,
        }),
      info: (message) =>
        log({
          level: chalk.green("info"),
          label: label,
          message: message,
        }),
      http: (message) => {},
      verbose: (message) => {},
      debug: (message) => {},
      silly: (message) => {},
    };
    return {
      error: (message) => console.log(`error: [${level}] ${message}`),
      warn: (message) => console.log(`warn: [${level}] ${message}`),
      info: (message) => console.log(`info: [${level}] ${message}`),
      http: (message) => console.log(`http: [${level}] ${message}`),
      verbose: (message) => console.log(`verbose: [${level}] ${message}`),
      debug: (message) => console.log(`debug: [${level}] ${message}`),
      silly: (message) => console.log(`silly: [${level}] ${message}`),
    };
  }
};

// export const makeLogger = (lab) => {
//   const lo = winston.createLogger({
//     format: combine(
//       timestamp({
//         format: "YYYY-MM-DD HH:mm:ss",
//       }),
//       label({ label: lab }),
//       logFormat,
//     ),
//     transports: [
//       // info 레벨 로그를 저장할 파일 설정
//       new winstonDaily({
//         level: "debug",
//         datePattern: "YYYY-MM-DD",
//         dirname: logDir,
//         filename: `%DATE%.debug.log`,
//         maxFiles: 30, // 30일치 로그 파일 저장
//         zippedArchive: true,
//       }),

//       new winstonDaily({
//         level: "info",
//         datePattern: "YYYY-MM-DD",
//         dirname: logDir,
//         filename: `%DATE%.log`,
//         maxFiles: 30, // 30일치 로그 파일 저장
//         zippedArchive: true,
//       }),
//       // error 레벨 로그를 저장할 파일 설정
//       new winstonDaily({
//         level: "error",
//         datePattern: "YYYY-MM-DD",
//         dirname: logDir + "/error", // error.log 파일은 /logs/error 하위에 저장
//         filename: `%DATE%.error.log`,
//         maxFiles: 30,
//         zippedArchive: true,
//       }),
//     ],
//   });

//   if (process.env.NODE_ENV !== "production") {
//     lo.add(
//       new winston.transports.Console({
//         format: winston.format.combine(
//           winston.format.colorize(), // 색깔 넣어서 출력
//           notalignColorsAndTime,
//           // winston.format.simple(),  // `${info.level}: ${info.message} JSON.stringify({ ...rest })` 포맷으로 출력
//         ),
//       }),
//     );
//   }

//   return lo;
// };

// const logger = winston.createLogger({
//   format: combine(
//     timestamp({
//       format: "YYYY-MM-DD HH:mm:ss",
//     }),
//     logFormat,
//   ),
//   transports: [
//     // info 레벨 로그를 저장할 파일 설정
//     new winstonDaily({
//       level: "debug",
//       datePattern: "YYYY-MM-DD",
//       dirname: logDir,
//       filename: `%DATE%.debug.log`,
//       maxFiles: 30, // 30일치 로그 파일 저장
//       zippedArchive: true,
//     }),

//     new winstonDaily({
//       level: "info",
//       datePattern: "YYYY-MM-DD",
//       dirname: logDir,
//       filename: `%DATE%.log`,
//       maxFiles: 30, // 30일치 로그 파일 저장
//       zippedArchive: true,
//     }),
//     // error 레벨 로그를 저장할 파일 설정
//     new winstonDaily({
//       level: "error",
//       datePattern: "YYYY-MM-DD",
//       dirname: logDir + "/error", // error.log 파일은 /logs/error 하위에 저장
//       filename: `%DATE%.error.log`,
//       maxFiles: 30,
//       zippedArchive: true,
//     }),
//   ],
// });

// let notalignColorsAndTime = winston.format.combine(
//   winston.format.printf(
//     (info) => `${info.level}: [${info.label}] ${info.message}`,
//   ),
// );

// // Production 환경이 아닌 경우(dev 등)
// if (process.env.NODE_ENV !== "production") {
//   logger.add(
//     new winston.transports.Console({
//       format: winston.format.combine(
//         winston.format.colorize(), // 색깔 넣어서 출력
//         notalignColorsAndTime,
//         // winston.format.simple(),  // `${info.level}: ${info.message} JSON.stringify({ ...rest })` 포맷으로 출력
//       ),
//     }),
//   );
// }
