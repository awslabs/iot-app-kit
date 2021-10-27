const numDigits = (x: number): number => Math.floor(Math.log10(x) + 1);

export const roundUp = (x: number): number => {
  if (x === 0) {
    // We cannot utilize log on zero, so we specifically handle this
    return 0;
  }
  const roundDigits = numDigits(x) - 1;
  const k = 10 ** roundDigits;
  return Math.ceil(x / k) * k;
};

const BUFFER_PERCENT = 0.5;

/**
 * Request Range
 *
 * Returns the range of dates to request data from.
 *
 * The request range will be a strictly larger range than the view port,
 * which allows the chart to pan and already have data present.
 *
 * DESIGN
 * We have several goals,
 * One should be able to get the same request range, for a wide range of start and end dates:
 * 1. with start/end dates slightly shifted in either direction
 * 2. The duration of time between start and end date becoming larger or smaller.
 *
 * This is important to prevent quick succession of requesting new date.
 */
export const requestRange = (
  { start, end, max }: { start: Date; end: Date; max: Date },
  buffer: number = BUFFER_PERCENT
): { start: Date; end: Date } => {
  const duration = end.getTime() - start.getTime();
  const bufferedDuration = roundUp(duration * (1 + buffer * 2));
  const durationStep = bufferedDuration / 4;
  const adjStart = new Date(Math.floor(start.getTime() / durationStep) * durationStep - durationStep / 2);
  const adjEnd = new Date(adjStart.getTime() + bufferedDuration);
  return {
    start: adjStart > max ? max : adjStart,
    end: adjEnd > max ? max : adjEnd,
  };
};
