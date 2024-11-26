import { round } from '@iot-app-kit/core-util';
import type SeriesModel from 'echarts/types/src/model/Series.js';
import {
  type DefaultStatesMixin,
  type SeriesOption,
} from 'echarts/types/src/util/types.js';

export const findMinMax = (
  series: SeriesModel<SeriesOption<unknown, DefaultStatesMixin>>,
  start: number,
  end: number,
  appKitSignificantDigits: number
) => {
  let max: string | undefined = undefined;
  let min: string | undefined = undefined;
  series.getData().each((dims) => {
    const dataPoint = series.getData().getValues(dims) as number[];
    if (contains(start, end, dataPoint[0])) {
      if (max === undefined || dataPoint[1] > Number(max)) {
        max = round(dataPoint[1], appKitSignificantDigits);
      }
      if (min === undefined || dataPoint[1] < Number(min)) {
        min = round(dataPoint[1], appKitSignificantDigits);
      }
    }
  });
  return { max, min };
};

/* We are checking if the data is within the x-axis of the viewport 
  Currently, the dataZoom also filters the points so that the series 
  only contains the points seen in the viewport, but this decouples
  the functinality in case of changes to useDataZoom in the future.
*/
const contains = (start: number, end: number, value: number) => {
  return value > start && value < end;
};
