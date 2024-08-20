import React from 'react';
import { ChartOptions } from './types';
import { ChartStoreProvider } from './store';
import BaseChart from './baseChart';
import { useChartId } from './hooks/useChartId';
import { DEFAULT_CHART_SETTINGS } from './eChartsConstants';
import { ActionPanel } from '../assistant-action-panel/actionPanel';

export const Chart: React.FC<ChartOptions> = (options) => {
  const chartId = useChartId(options.id);
  const chartOptions = { ...DEFAULT_CHART_SETTINGS, ...options };

  const component = (
    <ChartStoreProvider id={chartId}>
      <BaseChart {...chartOptions} id={chartId} />
    </ChartStoreProvider>
  );

  if (options.assistant) {
    return <ActionPanel width='min-content'>{component}</ActionPanel>;
  } else {
    return component;
  }
};
