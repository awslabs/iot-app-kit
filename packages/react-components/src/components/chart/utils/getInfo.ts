import { DurationViewport, Viewport } from '@iot-app-kit/core/src';
import { DEFAULT_MARGIN, Y_AXIS_INTERPOLATED_VALUE_PRECISION } from '../eChartsConstants';
import { getInstanceByDom, LineSeriesOption, SeriesOption } from 'echarts';
import { InternalGraphicComponentGroupOption, SizeConfig, ViewportInMs } from '../types';
import { parseDuration } from '../../../utils/time';
import React from 'react';

export const isDurationViewport = (viewport: Viewport): viewport is DurationViewport =>
  (viewport as DurationViewport).duration !== undefined;

// TODO: test this once echarts live mode is supported
// the width here represents the width of the view port in milli seconds
// and initial is the start timestamp of the viewport
export const convertViewportToMs = (viewport?: Viewport) => {
  const isDuration = !!viewport && isDurationViewport(viewport);
  if (isDuration) {
    const duration = parseDuration(viewport.duration);
    return { widthInMs: duration, initial: Date.now() - duration, end: Date.now(), isDurationViewport: isDuration };
  } else {
    const start = new Date(viewport?.start ?? 0).getTime();
    const end = new Date(viewport?.end ?? 0).getTime();
    return {
      widthInMs: end - start,
      initial: start,
      end,
      isDurationViewport: isDuration,
    };
  }
};

// this function calculated the timestamp of the location of the user click.
// the timestamp is calculated based on the viewport and X value of the click point[x, y]
// this is a simple linear interpolation
export const calculateTimeStamp = (xInPixel: number, widthInPixel: number, viewportInMs: ViewportInMs) => {
  const { widthInMs, initial } = viewportInMs;
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

export const getTrendCursorHeaderTimestampText = (timestampInMs: number) => {
  return [
    `{timestamp|${new Date(timestampInMs).toLocaleDateString()} ${new Date(timestampInMs).toLocaleTimeString()}}`,
    '{title|}',
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

// using https://echarts.apache.org/en/api.html#echartsInstance.convertToPixel
// the series will have the yAxisIndex which is enough to read the Y pixel value automatically
const convertValueIntoPixels = (
  value: number,
  ref: React.RefObject<HTMLDivElement>,
  seriesIndex: LineSeriesOption['yAxisIndex']
): number => {
  let chart;
  if (ref.current) {
    chart = getInstanceByDom(ref.current);
  }
  return chart?.convertToPixel({ yAxisIndex: seriesIndex }, value) ?? 0;
};

// TODO: update this for bar and step graphs, right now this only works for line graphs
export const calculateTrendCursorsSeriesMakers = (
  series: SeriesOption[],
  timestampInMs: number,
  ref: React.RefObject<HTMLDivElement>
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

    trendCursorsSeriesMakersInPixels[seriesIndex] = convertValueIntoPixels(
      value,
      ref,
      (s as LineSeriesOption)?.yAxisIndex ?? 0
    );
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

// this calculated the new X in pixels when the chart is resized.
export const calculateXFromTimestamp = (timestampInMs: number, size: SizeConfig, viewportInMs: ViewportInMs) => {
  const { widthInMs, initial } = viewportInMs;

  // TODO: precision should be updated here
  const x = ((size.width - 100) * (timestampInMs - initial)) / widthInMs;
  return x + DEFAULT_MARGIN;
};

// for a given user's right click co-ordinate's timestamp, find the nearest trend cursor
// all trend cursors is associated with a timestamp,
// we use that to see which TC is the closest to user's right click
export const calculateNearestTcIndex = (graphic: InternalGraphicComponentGroupOption[], clickTimestamp: number) => {
  const tcTimestamps = graphic.map((g) => g.timestampInMs);
  let closest = -1;
  let min = Number.MAX_VALUE;
  tcTimestamps.forEach((tcTimestamp, index) => {
    const diff = Math.abs(tcTimestamp - clickTimestamp);
    if (diff < min) {
      min = diff;
      closest = index;
    }
  });
  return closest;
};

// formatting the copy data so that it paste-able in an Excel sheet
// \t adds a tab and \n add a new line
// this is in the format of
// TC timestamp
// Cop timestamp
// Series name : value
export const formatCopyData = (graphic: InternalGraphicComponentGroupOption, series: SeriesOption[]) => {
  let output = `Trend cursor timestamp \t ${new Date(graphic.timestampInMs).toLocaleDateString()}${new Date(
    graphic.timestampInMs
  ).toLocaleTimeString()} \n`;

  const currDate = new Date();
  output = output + `Copy timestamp \t ${currDate.toLocaleDateString()} ${currDate.toLocaleTimeString()} \n`;
  series.forEach((s, index) => {
    output = output + `${s.name} \t ${graphic.yAxisMarkerValue[index]} \n`;
  });
  return output;
};
