import { EChartsExtensionInstallRegisters } from 'echarts/types/src/extension';
import { findMinMax } from './minMaxDataStreamSync';
import useDataStore from '../../../store';
import throttle from 'lodash.throttle';
import Grid from 'echarts/types/src/coord/cartesian/Grid';
import { LifecycleEvents } from 'echarts/types/src/core/lifecycle';

const THROTTLE_RATE = 1000;

// Echarts core use type does not map correctly to the echarts extension type so exporting as any
// eslint-disable-next-line
export const dataStreamMinMaxSyncExtension: any = (registers: EChartsExtensionInstallRegisters) => {
  const dataStreamMinMaxCallback = (
    ...args: LifecycleEvents['series:afterupdate']
  ) => {
    const [ecModel, api, params] = args;
    const appKitChartId = ecModel.option.appKitChartId as string; // widget-id
    const appKitSignificantDigits = ecModel.option
      .appKitSignificantDigits as number; //significant digits
    const grid = api
      ?.getCoordinateSystems()
      .find((a) => a.model?.type === 'grid') as Grid;

    if (!grid) return; // grid not found, return early

    const axis = grid?.getAxis('x'); //get X axis object from echarts
    if (!axis) return; // axis not found, return early

    const startDateXCoordinateValue = axis?.coordToData(
      axis.toLocalCoord(axis?.getExtent()[0])
    ); // start date coordinate value for x as number
    const endDateXCoordinateValue = axis?.coordToData(
      axis.toLocalCoord(axis?.getExtent()[1])
    ); // end date coordinate value for x as number

    if (
      !params.updatedSeries ||
      startDateXCoordinateValue === undefined ||
      endDateXCoordinateValue === undefined ||
      startDateXCoordinateValue > endDateXCoordinateValue
    )
      return;

    const minValues: Record<string, number | undefined> = {}; // each value will be {dsId: min}
    const maxValues: Record<string, number | undefined> = {}; // each value will be {dsId: max}

    params.updatedSeries?.forEach((series) => {
      const id = `${series.option.id}`; // datastream-id
      const { max, min } = findMinMax(
        series,
        startDateXCoordinateValue,
        endDateXCoordinateValue,
        appKitSignificantDigits
      );
      minValues[id] = min;
      maxValues[id] = max;
    });
    // add min/max values to the appropriate chart store
    const storeState = useDataStore.getState();
    const stores = storeState.chartStores;
    const store = stores[appKitChartId]; //get store for widget
    if (!store) return;
    const state = store.getState();
    state.setMaxes(maxValues);
    state.setMins(minValues);
  };

  registers.registerUpdateLifecycle(
    'series:afterupdate',
    throttle(dataStreamMinMaxCallback, THROTTLE_RATE)
  );
};
