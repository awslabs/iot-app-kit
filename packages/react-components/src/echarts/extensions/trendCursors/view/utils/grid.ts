import type ExtensionAPI from 'echarts/types/src/core/ExtensionAPI.js';
import { getCartesianCoordinateSystem } from './coordinateSystem';

export const getGrid = (api: ExtensionAPI) => {
  return getCartesianCoordinateSystem(api).getRect();
};
