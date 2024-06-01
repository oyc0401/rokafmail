export function format(info: { timestamp, level, message }) {
  // const width = 5;
  // const length = info.level.length;
  // let level = `${info.level}`;

  // if (length < width) {
  //   // Add spaces to make the length 5
  //   while (level.length < width) {
  //     level += " ";
  //   }
  // } else if (length > width) {
  //   // Trim the string to make the length 5
  //   level = level.substring(0, width);
  // }
  return `${info.timestamp} ${info.level}: ${info.message}`;
};