import { ANOMALY_TOOLTIP } from '../constants';
import { type ConfigurationOptions } from '../hooks/types';
import { type AnomalyChartTooltipData, tooltipAsString } from '../tooltip';

import {
  colorBorderControlDefault,
  colorBackgroundContainerContent,
} from '@cloudscape-design/design-tokens';

export const convertTooltip = ({
  decimalPlaces,
  tooltipSort,
}: Pick<ConfigurationOptions, 'decimalPlaces' | 'tooltipSort'>) => ({
  ...ANOMALY_TOOLTIP,
  formatter: (data: AnomalyChartTooltipData[]) =>
    tooltipAsString({ data, decimalPlaces, tooltipSort }),
  borderColor: colorBorderControlDefault,
  backgroundColor: colorBackgroundContainerContent,
});
