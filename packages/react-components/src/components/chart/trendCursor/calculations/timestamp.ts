import { MutableRefObject } from 'react';
import { ECharts } from 'echarts';
import { DEFAULT_X_AXIS_ID } from '../../eChartsConstants';

// this function calculated the timestamp of the location of the user click.
// the timestamp is calculated based on the viewport and X value of the click point[x, y]
// this is a simple linear interpolation
export const calculateTimeStamp = (
  xInPixel: number,
  chartRef: MutableRefObject<ECharts | null>
) =>
  chartRef.current?.convertFromPixel(
    { xAxisId: DEFAULT_X_AXIS_ID },
    xInPixel
  ) ?? 0;
export const getTrendCursorHeaderTimestampText = (timestampInMs: number) => {
  return [
    `{timestamp|${new Date(timestampInMs).toLocaleDateString()} ${new Date(
      timestampInMs
    ).toLocaleTimeString()}}`,
  ].join('\n');
};
