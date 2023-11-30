import minBy from 'lodash.minby';
import maxBy from 'lodash.maxby';

import LineSeriesModel from 'echarts/types/src/chart/line/LineSeries';
import { hasCustomYAxis } from './yAxisPredicates';
import { GenericSeries } from '../../types';
import useDataStore from '../../../store';

export const handleSetYAxis = (model: LineSeriesModel) => {
  const appKitChartId = model.ecModel.option.appKitChartId as string;
  const { option, coordinateSystem } = model;
  const id = `${option.id}`; // echart option id can also be a number

  // Cannot determine yAxis unless the coordinateSystem is cartesion2d
  if (coordinateSystem.type !== 'cartesian2d' || id == null || appKitChartId == null) return;

  const storeState = useDataStore.getState();
  const stores = storeState.chartStores;
  const store = stores[appKitChartId];

  if (!store) return;

  if (hasCustomYAxis(option)) {
    const significantDigits = (option as GenericSeries).appKitSignificantDigits;
    const color = (option as GenericSeries).appKitColor;
    const yAxisTicks = coordinateSystem.getAxis('y').getTicksCoords();

    const min = minBy(yAxisTicks, 'tickValue')?.tickValue;
    const max = maxBy(yAxisTicks, 'tickValue')?.tickValue;

    if (min == null || max == null) return;

    const valuePartial = {
      color,
      significantDigits,
    };

    store.getState().setYMax(id, { ...valuePartial, value: max });
    store.getState().setYMin(id, { ...valuePartial, value: min });
  } else {
    store.getState().clearYAxis(id);
  }
};
