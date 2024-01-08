import { DEFAULT_MARGIN, DEFAULT_X_AXIS_ID } from '../../eChartsConstants';
import { ECharts, SeriesOption } from 'echarts';
import { SizeConfig } from '../../types';
import { MutableRefObject } from 'react';
import { InternalGraphicComponentGroupOption } from '../types';

// this function is limiting the horizontal x-axis movement of the TC
// this is not limiting the line's movement but only the TC header movement
export const setXWithBounds = (size: SizeConfig, x: number) => {
  const upperLimit = size.width - DEFAULT_MARGIN;
  const lowerLimit = DEFAULT_MARGIN;
  return x > upperLimit ? upperLimit : x < lowerLimit ? lowerLimit : x;
};

// this calculated the new X in pixels when the chart is resized.
export const calculateXFromTimestamp = (
  timestampInMs: number,
  chartRef: MutableRefObject<ECharts | null>
) =>
  chartRef.current?.convertToPixel(
    { xAxisId: DEFAULT_X_AXIS_ID },
    timestampInMs
  ) ?? 0;

// for a given user's right click co-ordinate's timestamp, find the nearest trend cursor
// all trend cursors is associated with a timestamp,
// we use that to see which TC is the closest to user's right click
export const calculateNearestTcIndex = (
  graphic: InternalGraphicComponentGroupOption[],
  clickTimestamp: number
) => {
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
export const formatCopyData = (
  graphic: InternalGraphicComponentGroupOption,
  series: SeriesOption[]
) => {
  let output = `Trend cursor timestamp \t ${new Date(
    graphic.timestampInMs
  ).toLocaleDateString()}${new Date(
    graphic.timestampInMs
  ).toLocaleTimeString()} \n`;

  const currDate = new Date();
  output =
    output +
    `Copy timestamp \t ${currDate.toLocaleDateString()} ${currDate.toLocaleTimeString()} \n`;
  series.forEach((s, index) => {
    output = output + `${s.name} \t ${graphic.yAxisMarkerValue[index]} \n`;
  });
  return output;
};
