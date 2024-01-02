import Grid from 'echarts/types/src/coord/cartesian/Grid';
import ExtensionAPI from 'echarts/types/src/core/ExtensionAPI';

export const getCartesianCoordinateSystem = (api: ExtensionAPI) => {
  const system = api
    ?.getCoordinateSystems()
    .find((a) => a.model?.type === 'grid') as Grid;
  if (!system) {
    throw new Error('Could not find coordinate system');
  }
  return system;
};
