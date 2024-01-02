import GlobalModel from 'echarts/types/src/model/Global';
import { TrendCursorModel } from '../model';

export const getTrendCursors = (ecmodel: GlobalModel) => {
  // sometimes echarts just maps off an option to null on delete
  const trendCursors = (
    (ecmodel.getOption().trendCursors as TrendCursorModel[]) ?? []
  ).filter((model): model is TrendCursorModel => !!model);
  return trendCursors;
};
