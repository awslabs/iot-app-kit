import type Grid from 'echarts/types/src/coord/cartesian/Grid.js';
import type ExtensionAPI from 'echarts/types/src/core/ExtensionAPI.js';

export const getCartesianCoordinateSystem = (api: ExtensionAPI) => {
  const system = api
    ?.getCoordinateSystems()
    .find((a) => a.model?.type === 'grid') as Grid;
  if (!system) {
    throw new Error('Could not find coordinate system');
  }
  return system;
};
