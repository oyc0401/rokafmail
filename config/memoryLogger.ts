import dayjs from "dayjs";

export class MemoryLogger {
  log = '';
  label = '';

  make(label) {
    this.label = label;
    return this;
  }

  info(message) {
    const log = this.format({
      timestamp: dayjs().format('YYYY.MM.DD hh:mm:ss'),
      level: 'info',
      label: this.label,
      message: message,
    })
    this.log = `${this.log}\n${log}`;
  }
  warn(message) {
    const log = this.format({
      timestamp: dayjs().format('YYYY.MM.DD hh:mm:ss'),
      level: 'warn',
      label: this.label,
      message: message,
    })
    this.log = `${this.log}\n${log}`;
  }
  error(message) {
    const log = this.format({
      timestamp: dayjs().format('YYYY.MM.DD hh:mm:ss'),
      level: 'error',
      label: this.label,
      message: message,
    })
    this.log = `${this.log}\n${log}`;
  }

  format(info: { timestamp, level, label, message }) {
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
  };


  cat() {
    return this.log;
  }
}

