import React from 'react';
import { ChartOptions } from './types';
import { ChartStoreProvider } from './store';
import BaseChart from './baseChart';

export const Chart: React.FC<ChartOptions> = (options) => (
  <ChartStoreProvider>
    <BaseChart {...options} />
  </ChartStoreProvider>
);
