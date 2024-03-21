import React from 'react';
import { renderToString } from 'react-dom/server';
import { AnomalyWidgetTooltip, AnomalyWidgetTooltipOptions } from './tooltip';

export type { AnomalyWidgetTooltipData } from './formatTooltipData';

export const tooltipAsString = (options: AnomalyWidgetTooltipOptions) =>
  renderToString(<AnomalyWidgetTooltip {...options} />);
