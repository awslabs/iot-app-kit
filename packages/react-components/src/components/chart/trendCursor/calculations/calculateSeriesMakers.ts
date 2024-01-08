// finding the left and right indexes for a given timestamp
// rightIndex === length imples the timestamp lies after the series
// leftIndex < 0 imples the timestamp lies before the series
import { ECharts, LineSeriesOption, SeriesOption } from 'echarts';
import { MutableRefObject } from 'react';
import { Visualization } from '../../types';
import { handleDataValueInterpolation } from './interpolation';
import { DEFAULT_PRECISION } from '../../eChartsConstants';

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
  chartRef: MutableRefObject<ECharts | null>,
  seriesIndex: LineSeriesOption['yAxisIndex']
): number =>
  chartRef.current?.convertToPixel({ yAxisIndex: seriesIndex }, value) ?? 0;

export const calculateSeriesMakers = (
  series: SeriesOption[],
  timestampInMs: number,
  chartRef: MutableRefObject<ECharts | null>,
  visualization: Visualization,
  significantDigits?: number
) => {
  const trendCursorsSeriesMakersInPixels: number[] = [];
  const trendCursorsSeriesMakersValue: number[] = [];
  series.forEach((s: SeriesOption, seriesIndex) => {
    const data = s.data as Array<number[]>;
    // find where the user has moved i.e. find the data indexes within which the TC is dragged / clicked
    const { leftIndex, rightIndex } = getLeftRightIndexes(data, timestampInMs);
    let value = 0;

    if (data.length === 0) {
      value = 0;
    } else if (leftIndex < 0) {
      // There is no Left value , so we take the first available value
      value = data[0][1];
    } else if (rightIndex === data.length) {
      // There is no right value , so we take the last available value
      value = data[data.length - 1][1];
    } else {
      value = handleDataValueInterpolation({
        visualization,
        data,
        timestampInMs,
        leftIndex,
        rightIndex,
      });
    }

    trendCursorsSeriesMakersValue[seriesIndex] = Number(
      value.toFixed(significantDigits ?? DEFAULT_PRECISION)
    );
    // Converting the Y axis value to pixels

    trendCursorsSeriesMakersInPixels[seriesIndex] = convertValueIntoPixels(
      value,
      chartRef,
      (s as LineSeriesOption)?.yAxisIndex ?? 0
    );
  });

  return { trendCursorsSeriesMakersInPixels, trendCursorsSeriesMakersValue };
};
