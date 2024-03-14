import { SeriesOption, TooltipComponentOption } from 'echarts';

import { ChartDataQuality, ChartOptions } from '../../types';
import { useMemo } from 'react';
import { formatter } from './formatter';
import { GenericSeries } from '../../../../echarts/types';

type ColorMap = { [key in string]: string };
const useColorMap = (series: SeriesOption[]) => {
  return useMemo<ColorMap>(() => {
    return series.reduce<ColorMap>((acc, n) => {
      const id = n.id?.toString() ?? '';
      acc[id] = (n as GenericSeries).appKitColor ?? '';
      return acc;
    }, {});
  }, [series]);
};

export const useTooltip = ({
  significantDigits,
  series,
  showBadDataIcons,
  showUncertainDataIcons,
}: {
  significantDigits: ChartOptions['significantDigits'];
  series: SeriesOption[];
} & ChartDataQuality) => {
  // We need to derive colors from series because the tooltip
  // params only include the itemStyling
  // This may be different than the series color because data quality
  // color is hardcoded to error or warning variants
  const colorMap = useColorMap(series);

  return useMemo<TooltipComponentOption>(
    () => ({
      formatter: formatter({
        significantDigits,
        colorMap,
        showBadDataIcons,
        showUncertainDataIcons,
      }),
    }),
    [significantDigits, colorMap, showBadDataIcons, showUncertainDataIcons]
  );
};
