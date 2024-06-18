import { getThresholdRangeFromMinMax } from './getThresholdRangeFromMinMax';
import { GaugeProps, GaugeSettings } from '../types';
import { DEFAULT_GAUGE_PROGRESS_COLOR } from '../constants';
import { ComparisonOperator } from '@iot-app-kit/core';

type ThresholdRange = {
  start?: number;
  end?: number;
  color: string;
  comparisonOperator: ComparisonOperator;
};

/*
the iot-app-kit LT/LTE threshold is a number which represents where the threshold ENDS
since this is similar to the echarts definition of a threshold,
we can easily convert our threshold into a value pair [percentage, threshold.color]

example: 
gauge has yMin, yMax, and threshold={comparisonOperator: 'LT', value, color} 
then we can convert the threshold to:
thresholdRange = {
  // end is calculated by doing (value / (yMax-yMin))
  end,
  color,
  comparisonOperator: 'LT;
};
and now we can convert this threshold to an echarts valuePair of: [thresholdRange.end, thresholdRange.color]
*/
const getColorValuePairsForLTandLTE = (allThresholds: ThresholdRange[]) => {
  const lineStylesLTandLTE: [number, string][] = [];

  const lteThresholds = allThresholds.filter(
    (tr) => tr.comparisonOperator === 'LT' || tr.comparisonOperator === 'LTE'
  );

  lteThresholds.forEach((thresholdRange) => {
    const { end, color, comparisonOperator } = thresholdRange;
    if (end) {
      const thresholdEnd =
        comparisonOperator === 'LT' ? end - 0.0000000001 : end;
      lineStylesLTandLTE.push([thresholdEnd, color]);
    }
  });

  return lineStylesLTandLTE;
};

/*
the iot-app-kit GT/GTE threshold is a number which represents where the threshold STARTS
this is backwards from how echarts represents its threshold (they expect the value where the threshold ENDS)

example: if our gauge has a yMin, yMax, and threshold={comparisonOperator: 'GT', value, color} 
then we can convert the threshold to:
thresholdRange = {
  // start is calculated by doing (value / (yMax-yMin))
  start, 
  color,
  comparisonOperator: 'GT;
};
we know that anything from 0-thresholdRange.start of the gauge will use the gauge's default color
and anything from thresholdRange.start-100% of the gauge will use the thresholds's color
so we must work backwards:

first we will create an echarts valuePair for our threshold: 
     [1, thresholdRange.color]
     we dont know where the threshold should END so we make it take up 100% of the gauge

we will store this threshold as the lastThreshold, since it's START will represent the next threshold's END

second we will create a valuePair for the default gauge color:
     [lastThreshold.start, DEFAULT_GAUGE_COLOR]
     we know where the default color range should END where the lastThreshold STARTS

now we have two valuePairs of color:
1. [thresholdRange.start, DEFAULT_GAUGE_COLOR] which colors anything outside the threshold's range
2. [1, thresholdRange.color] which colors the whole gauge in the threshold's color
*/
const getColorValuePairsForGTandGTE = (
  allThresholds: ThresholdRange[],
  settings?: GaugeSettings
) => {
  const lineStylesGTandGTE: [number, string][] = [];
  let lastThreshold: ThresholdRange | undefined = undefined;

  const gteThresholds = allThresholds
    // filter thresholds to only be GT or GTE
    .filter(
      (tr) => tr.comparisonOperator === 'GT' || tr.comparisonOperator === 'GTE'
    )
    // sort threshold in descending order, since each threshold provides the END of the next one
    .sort((a, b) => (b.start ?? 0) - (a.start ?? 0));

  // do the calculations from the example above ^
  gteThresholds.forEach((thresholdRange) => {
    const { start, color } = thresholdRange;
    if (!lastThreshold) {
      start !== undefined && lineStylesGTandGTE.push([1, color]);
    } else {
      if (lastThreshold.start !== undefined) {
        const thresholdEnd =
          lastThreshold.comparisonOperator === 'GTE'
            ? lastThreshold.start - 0.0000000001
            : lastThreshold.start;
        lineStylesGTandGTE.push([thresholdEnd, color]);
      }
    }
    lastThreshold = thresholdRange;
  });

  // once all thresholds have been calculated, the remaining space has to be filled in with the default gauge color
  if (lastThreshold) {
    lastThreshold['start'] !== undefined &&
      lastThreshold['start'] > 0 &&
      lineStylesGTandGTE.push([
        lastThreshold['start'],
        settings?.color ?? DEFAULT_GAUGE_PROGRESS_COLOR,
      ]);
  }

  return lineStylesGTandGTE;
};

/*
ECharts represents all gauge colors as value pairs [value: number, color: string]
value: is a number from 0-1, representing the percentage position where the threshold end
color: is a string representing a hex color

example: [.5, '#ff0000'] would color the range 0-50% of the gauge in the color '#ff0000' (red)
example: [1, '#00ff00'] would color the range 0-100% of the gauge in the color '#00ff00' (green)

in order to transform our thresholds into ECharts thresholds, we must do different calculations
depending on the comparison operator: LT/LTE do one tranformation, GT/GTE does a different transformation
*/
export const convertThresholdsToEchartsValuePair = ({
  settings,
  thresholds,
}: Pick<GaugeProps, 'settings' | 'thresholds'>) => {
  // create a list of thresholds with Start and End ranges (depending on the comparison operator)
  const thresholdsWithRanges: ThresholdRange[] =
    thresholds
      ?.map(({ value, color, comparisonOperator }) => {
        const [start, end] = getThresholdRangeFromMinMax({
          value,
          comparisonOperator,
          min: settings?.yMin,
          max: settings?.yMax,
        });

        return {
          start,
          end,
          color,
          comparisonOperator,
        };
      })
      .filter((tr) => tr.start !== tr.end) ?? [];

  const colorValuePairsLTandLTE =
    getColorValuePairsForLTandLTE(thresholdsWithRanges);

  const colorValuePairsGTandGTE = getColorValuePairsForGTandGTE(
    thresholdsWithRanges,
    settings
  );

  const allcolorValuePairs: [number, string][] = [
    ...colorValuePairsLTandLTE,
    ...colorValuePairsGTandGTE,
    // must add the default color with a range of 0-100% just in case there are holes in the threshold ranges
    // otherwise the gauge will not have a color in that section
    [1, settings?.color ?? DEFAULT_GAUGE_PROGRESS_COLOR],
  ];

  return allcolorValuePairs.sort((a, b) => a[0] - b[0]);
};
