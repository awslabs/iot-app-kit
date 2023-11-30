import * as echartsCore from 'echarts/core';

// Custom Extensions
import { yAxisSyncExtension } from './extensions';

export const configureEchartsPlugins = () => {
  echartsCore.use(yAxisSyncExtension);
};
