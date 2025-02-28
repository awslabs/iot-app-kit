// Based on echarts implementation: https://github.com/apache/echarts/blob/master/src/util/time.ts#L223C3-L223C31
// Based on https://github.com/apache/echarts/blob/master/src/util/time.ts#L33 default values
export const getPatternForXAxisLabelForAnomalyChart = (
  time: number
): string => {
  const { isSecond, isMinute, isHour, isDay, isMonth, isYear } =
    getAxisDateInfo(time);

  let pattern;
  if (isYear) {
    pattern = 'yyyy';
  } else if (isMonth) {
    pattern = 'MMM';
  } else if (isDay) {
    pattern = 'MMM d';
  } else if (isHour) {
    pattern = "MMM d'\n'HH:mm";
  } else if (isMinute) {
    pattern = "MMM d'\n'HH:mm";
  } else if (isSecond) {
    pattern = "MMM d'\n'HH:mm:ss";
  } else {
    pattern = "MMM d'\n'HH:mm:ss SSS";
  }

  return pattern;
};

export const getPatternForXAxisLabelForLineChart = (time: number): string => {
  const { isSecond, isMinute, isHour, isDay, isMonth, isYear } =
    getAxisDateInfo(time);

  let pattern;
  if (isYear) {
    pattern = 'yyyy';
  } else if (isMonth) {
    pattern = 'MMM';
  } else if (isDay) {
    pattern = 'd';
  } else if (isHour) {
    pattern = 'HH:mm';
  } else if (isMinute) {
    pattern = 'HH:mm';
  } else if (isSecond) {
    pattern = 'HH:mm:ss';
  } else {
    pattern = 'HH:mm:ss SSS';
  }

  return pattern;
};

const getAxisDateInfo = (time: number) => {
  const date: Date = new Date(Math.round(time));

  const M: number = date.getMonth() + 1;
  const d: number = date.getDate();
  const h: number = date.getHours();
  const m: number = date.getMinutes();
  const s: number = date.getSeconds();
  const S: number = date.getMilliseconds();

  const isSecond: boolean = S === 0;
  const isMinute: boolean = isSecond && s === 0;
  const isHour: boolean = isMinute && m === 0;
  const isDay: boolean = isHour && h === 0;
  const isMonth: boolean = isDay && d === 1;
  const isYear: boolean = isMonth && M === 1;

  return { isSecond, isMinute, isHour, isDay, isMonth, isYear };
};
