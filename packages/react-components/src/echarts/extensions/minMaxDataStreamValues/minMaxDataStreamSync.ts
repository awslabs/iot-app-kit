import SeriesModel from 'echarts/types/src/model/Series';
import { SeriesOption, DefaultStatesMixin } from 'echarts/types/src/util/types';

export const findMinMax = (
  series: SeriesModel<SeriesOption<unknown, DefaultStatesMixin>>,
  start: number,
  end: number
) => {
  let max: number | undefined = undefined;
  let min: number | undefined = undefined;
  series.getData().each((dims) => {
    const dataPoint = series.getData().getValues(dims) as number[];
    if (contains(start, end, dataPoint[0])) {
      if (max === undefined || dataPoint[1] > max) {
        max = dataPoint[1];
      }
      if (min === undefined || dataPoint[1] < min) {
        min = dataPoint[1];
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
