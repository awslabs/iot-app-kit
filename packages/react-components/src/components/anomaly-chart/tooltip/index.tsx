import React from 'react';
import { renderToString } from 'react-dom/server';
import { AnomalyChartTooltip, AnomalyChartTooltipOptions } from './tooltip';

export type { AnomalyChartTooltipData } from './formatTooltipData';

export const tooltipAsString = (options: AnomalyChartTooltipOptions) =>
  renderToString(<AnomalyChartTooltip {...options} />);
