import { DurationViewport, Viewport } from '@iot-app-kit/core/src';
import { DEFAULT_MARGIN, Y_AXIS_INTERPOLATED_VALUE_PRECISION } from '../eChartsConstants';
import { SeriesOption } from 'echarts';
import { SizeConfig } from '../types';
import { parseDuration } from '../../../utils/time';

export const isDurationViewport = (viewport: Viewport): viewport is DurationViewport =>
  (viewport as DurationViewport).duration !== undefined;

// TODO: test this once echarts live mode is supported
// the width here represents the width of the view port in milli seconds
// and initial is the start timestamp of the viewport
export const viewportToMs = (viewport?: Viewport) => {
  if (viewport && isDurationViewport(viewport)) {
    return { widthInMs: parseDuration(viewport.duration), initial: Date.now() - parseDuration(viewport.duration) };
  } else {
    const start = new Date(viewport?.start ?? 0).getTime();
    const end = new Date(viewport?.end ?? 0).getTime();
    return {
      widthInMs: end - start,
      initial: start,
    };
  }
};

// this function calculated the timestamp of the location of the user click.
// the timestamp is calculated based on the viewport and X value of the click point[x, y]
// this is a simple linear interpolation
export const calculateTimeStamp = (xInPixel: number, widthInPixel: number, viewport?: Viewport) => {
  const { widthInMs, initial } = viewportToMs(viewport);
  // TODO: this results in a decimal , needs to decide precision
  const delta = (widthInMs * (xInPixel - DEFAULT_MARGIN)) / (widthInPixel - 2 * DEFAULT_MARGIN);
  return delta + initial;
};

// this function is limiting the horizontal x-axis movement of the TC
// this is not limiting the line's movement but only the TC header movement
export const setXWithBounds = (size: SizeConfig, x: number) => {
  const upperLimit = size.width - DEFAULT_MARGIN;
  const lowerLimit = DEFAULT_MARGIN;
  return x > upperLimit ? upperLimit : x < lowerLimit ? lowerLimit : x;
};

export const getTrendCursorHeaderTimestampText = (timestampInMs: number, previousText?: string) => {
  const title = previousText && previousText.split('\n')[0];
  return [
    title,
    `{timestamp|${new Date(timestampInMs).toLocaleDateString()} ${new Date(timestampInMs).toLocaleTimeString()}}`,
  ].join('\n');
};

// finding the left and right indexes for a given timestamp
// rightIndex === length imples the timestamp lies after the series
// leftIndex < 0 imples the timestamp lies before the series
const getLeftRightIndexes = (data: Array<number[]>, timestampInMs: number) => {
  let rightIndex = data.length;
  for (let i = 0; i < data.length; i++) {
    const [dataTimestamp] = data[i];
    if (timestampInMs < dataTimestamp) {
      rightIndex = i;
      break;
    }
  }
  return { leftIndex: rightIndex - 1, rightIndex };
};

const convertValueIntoPixels = (value: number, yMin: number, yMax: number, chartHeightInPixels: number): number => {
  const chartHeightInPixelsWoMargin = chartHeightInPixels - 2 * DEFAULT_MARGIN;
  const delta = (value * chartHeightInPixelsWoMargin) / (yMax - yMin);
  const yAxisInPixels = delta + yMin;
  // Need to inverse the Y axis given the 0,0 is the left top corner
  // TODO: precision to be decided
  return chartHeightInPixels - Number(yAxisInPixels.toFixed(Y_AXIS_INTERPOLATED_VALUE_PRECISION)) - DEFAULT_MARGIN;
};

// TODO: update this for bar and step graphs, right now this only works for line graphs
export const calculateTrendCursorsSeriesMakers = (
  series: SeriesOption[],
  yMin: number,
  yMax: number,
  timestampInMs: number,
  chartHeightInPixels: number
) => {
  const trendCursorsSeriesMakersInPixels: number[] = [];
  const trendCursorsSeriesMakersValue: number[] = [];
  series.forEach((s: SeriesOption, seriesIndex) => {
    const data = s.data as Array<number[]>;
    // find where the user has moved i.e. find the data indexes within which the TC is dragged / clicked
    const { leftIndex, rightIndex } = getLeftRightIndexes(data, timestampInMs);
    let value = 0;

    // There is no Left value , so we take the first available value
    if (leftIndex < 0) {
      value = data[0][1];
    } else if (rightIndex === data.length) {
      // There is no right value , so we take the last available value
      value = data[data.length - 1][1];
    } else {
      // Linear interpolating the value between left and right indexes
      const valueMin = data[leftIndex][1];
      const valueMax = data[rightIndex][1];
      const timeMin = data[leftIndex][0];
      const timeMax = data[rightIndex][0];
      const a = (timestampInMs - timeMin) / (timeMax - timeMin);
      const delta = valueMax - valueMin === 0 ? 0 : a * (valueMax - valueMin);
      value = delta + valueMin;
    }

    // TODO: precision to be decided
    trendCursorsSeriesMakersValue[seriesIndex] = Number(value.toFixed(Y_AXIS_INTERPOLATED_VALUE_PRECISION));
    // Converting the Y axis value to pixels
    trendCursorsSeriesMakersInPixels[seriesIndex] = convertValueIntoPixels(value, yMin, yMax, chartHeightInPixels);
  });

  return { trendCursorsSeriesMakersInPixels, trendCursorsSeriesMakersValue };
};

// adding a 10% to accommodate TC header and rounding it to upper 10
// TODO: make sure if this is the right way to round up
export const roundUpYAxisMax = (yMax: number) => {
  yMax += 0.1 * yMax;
  yMax = Math.ceil(yMax / 10) * 10;
  return yMax;
};

export const calculateYMaxMin = (series: SeriesOption[]) => {
  let yMax = Number.MIN_VALUE;
  let yMin = 0;

  series.forEach((s: SeriesOption) => {
    (s.data as Array<number[]>).forEach((value) => {
      if (value[1] && value[1] > yMax) {
        yMax = value[1];
      }
      if (value[1] && value[1] < yMin) {
        yMin = value[1];
      }
    });
  });

  // adding a 10% to accommodate TC header and rounding it to upper 10
  yMax = roundUpYAxisMax(yMax);
  return { yMin, yMax };
};
