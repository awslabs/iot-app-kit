import * as echartsCore from 'echarts/core';

// Custom Extensions
import { yAxisSyncExtension, trendCursorsExtension } from './extensions';

export const configureEchartsPlugins = () => {
  echartsCore.use(yAxisSyncExtension);
  echartsCore.use(trendCursorsExtension);
};
