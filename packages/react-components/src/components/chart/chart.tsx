import React from 'react';
import { ChartOptions } from './types';
import { ChartStoreProvider } from './store';
import BaseChart from './baseChart';
import { useChartId } from './hooks/useChartId';
import { DEFAULT_CHART_SETTINGS } from './eChartsConstants';

export const Chart: React.FC<ChartOptions> = (options) => {
  const chartId = useChartId(options.id);
  const chartOptions = { ...DEFAULT_CHART_SETTINGS, ...options };

  return (
    <ChartStoreProvider id={chartId}>
      <BaseChart {...chartOptions} id={chartId} />
    </ChartStoreProvider>
  );
};
