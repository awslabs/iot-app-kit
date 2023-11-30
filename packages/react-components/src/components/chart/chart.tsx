import React from 'react';
import { ChartOptions } from './types';
import { ChartStoreProvider } from './store';
import BaseChart from './baseChart';
import { useChartId } from './hooks/useChartId';

export const Chart: React.FC<ChartOptions> = (options) => {
  const chartId = useChartId(options.id);
  return (
    <ChartStoreProvider id={chartId}>
      <BaseChart {...options} id={chartId} />
    </ChartStoreProvider>
  );
};
