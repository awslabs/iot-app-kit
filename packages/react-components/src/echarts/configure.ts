import * as echartsCore from 'echarts/core';

// Custom Extensions
import {
  yAxisSyncExtension,
  trendCursorsExtension,
  dataStreamMinMaxSyncExtension,
} from './extensions';

export const configureEchartsPlugins = () => {
  echartsCore.use(yAxisSyncExtension);
  echartsCore.use(trendCursorsExtension);
  echartsCore.use(dataStreamMinMaxSyncExtension);
};
