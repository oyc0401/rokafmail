export function format(info: { timestamp, level, message }) {
  return `${info.timestamp} - ${info.level}: ${info.message}`;
};
