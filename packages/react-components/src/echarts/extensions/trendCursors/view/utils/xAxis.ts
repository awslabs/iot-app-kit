import type ExtensionAPI from 'echarts/types/src/core/ExtensionAPI';
import { getCartesianCoordinateSystem } from './coordinateSystem';

export const getXAxis = (api: ExtensionAPI) => {
  return getCartesianCoordinateSystem(api).getAxis('x');
};

export const getXAxisDataValue = (coordinate: number, api: ExtensionAPI) => {
  const axis = getXAxis(api);
  return axis.coordToData(axis.toLocalCoord(coordinate));
};

export const getXAxisCoord = (value: number, api: ExtensionAPI) => {
  const axis = getXAxis(api);
  return axis.toGlobalCoord(axis.dataToCoord(value));
};
