import { ANOMALY_TOOLTIP } from '../constants';
import { type ConfigurationOptions } from '../hooks/types';
import { type AnomalyChartTooltipData, tooltipAsString } from '../tooltip';

import {
  colorBackgroundContainerContent,
  colorBorderControlDefault,
} from '@cloudscape-design/design-tokens';

export const convertTooltip = ({
  significantDigits,
  tooltipSort,
}: Pick<ConfigurationOptions, 'significantDigits' | 'tooltipSort'>) => ({
  ...ANOMALY_TOOLTIP,
  formatter: (data: AnomalyChartTooltipData[]) =>
    tooltipAsString({ data, decimalPlaces: significantDigits, tooltipSort }),
  borderColor: colorBorderControlDefault,
  backgroundColor: colorBackgroundContainerContent,
});
