export function dateToStr(date: Date) {
  if (isToday(date)) {
    return toStringTime(date);
  } else {
    return toStringByFormatting(date, ".");
  }
}

function isToday(date: Date) {
  const today: Date = new Date();
  console.log(date);
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function leftPad(value: number) {
  if (value >= 10) {
    return value;
  }
  return `0${value}`;
}

function toStringTime(source: Date, delimiter = ":") {
  const hour = leftPad(source.getHours() + 1);
  const minute = leftPad(source.getMinutes() + 1);
  return [hour, minute].join(delimiter);
}

function toStringByFormatting(source: Date, delimiter = "-") {
  const year = source.getFullYear();
  const month = leftPad(source.getMonth() + 1);
  const day = leftPad(source.getDate());

  return [year, month, day].join(delimiter);
}
