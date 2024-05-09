import React from 'react';
import { TooltipDate } from './date';
import { TooltipSort } from '../types';
import { TooltipDiagnostics } from './diagnostics';
import {
  AnomalyChartTooltipData,
  formatTooltipData,
} from './formatTooltipData';
import {
  spaceScaledXl,
  spaceScaledXs,
  spaceScaledXxs,
} from '@cloudscape-design/design-tokens';

export type AnomalyChartTooltipOptions = {
  data: AnomalyChartTooltipData[];
  decimalPlaces?: number;
  tooltipSort?: TooltipSort;
};

export const AnomalyChartTooltip = ({
  decimalPlaces,
  ...options
}: AnomalyChartTooltipOptions) => {
  const data = formatTooltipData({ ...options });
  // Each series option has the same date
  const date = data.at(0)?.date ?? '';

  return (
    <div>
      <TooltipDate date={date} />
      <div
        style={{
          marginTop: spaceScaledXxs,
          display: 'grid',
          gridTemplateColumns: '1fr max-content',
          rowGap: spaceScaledXs,
          columnGap: spaceScaledXl,
        }}
      >
        <TooltipDiagnostics diagnostics={data} decimalPlaces={decimalPlaces} />
      </div>
    </div>
  );
};
