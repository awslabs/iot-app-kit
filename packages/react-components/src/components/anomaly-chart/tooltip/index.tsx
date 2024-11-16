import { renderToString } from 'react-dom/server';
import {
  AnomalyChartTooltip,
  type AnomalyChartTooltipOptions,
} from './tooltip';

export type { AnomalyChartTooltipData } from './formatTooltipData';

export const tooltipAsString = (options: AnomalyChartTooltipOptions) =>
  renderToString(<AnomalyChartTooltip {...options} />);
