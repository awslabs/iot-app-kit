import { type LineSeriesOption } from 'echarts';
import { type Emphasis } from '../../utils/getStyles';
import {
  BAD_DATA_ICON_SIZE,
  EMPHASIZE_SCALE_CONSTANT,
  UNCERTAIN_DATA_ICON_SIZE,
} from '../../eChartsConstants';
import { type ChartDataQuality } from '../../types';

export type ConvertSymbolSizeOptions = {
  emphasis: Emphasis;
  symbolSize: number;
} & ChartDataQuality;
export const convertSymbolSize =
  ({
    emphasis,
    symbolSize,
    showBadDataIcons,
    showUncertainDataIcons,
  }: ConvertSymbolSizeOptions): LineSeriesOption['symbolSize'] =>
  (value) => {
    const shouleEmphasize = emphasis === 'emphasize';
    const scaledSymbolSize = shouleEmphasize
      ? symbolSize + EMPHASIZE_SCALE_CONSTANT
      : symbolSize;

    const quality = value.quality;
    if (showUncertainDataIcons && quality === 'UNCERTAIN') {
      return shouleEmphasize
        ? UNCERTAIN_DATA_ICON_SIZE + EMPHASIZE_SCALE_CONSTANT
        : UNCERTAIN_DATA_ICON_SIZE;
    } else if (showBadDataIcons && quality === 'BAD') {
      return shouleEmphasize
        ? BAD_DATA_ICON_SIZE + EMPHASIZE_SCALE_CONSTANT
        : BAD_DATA_ICON_SIZE;
    }

    return scaledSymbolSize;
  };
