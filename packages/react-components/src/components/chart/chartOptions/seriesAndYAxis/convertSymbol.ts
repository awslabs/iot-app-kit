import { type LineSeriesOption } from 'echarts';
// import { BAD_DATA_ICON, UNCERTAIN_DATA_ICON } from '../../eChartsConstants';
import { type ChartDataQuality } from '../../types';

export type ConvertSymbolOptions = {
  symbolStyle: string;
} & ChartDataQuality;

export const convertSymbol =
  ({
    symbolStyle,
    showBadDataIcons,
    showUncertainDataIcons,
  }: ConvertSymbolOptions): LineSeriesOption['symbol'] =>
  (value) => {
    const quality = value.quality;
    if (showUncertainDataIcons && quality === 'UNCERTAIN') {
      return 'triangle';
    } else if (showBadDataIcons && quality === 'BAD') {
      return 'emptyCircle';
    }

    return symbolStyle;
  };
