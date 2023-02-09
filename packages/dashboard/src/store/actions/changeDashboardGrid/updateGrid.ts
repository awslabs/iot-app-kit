import { constrainWidgetPositionToGrid } from '../../../util/constrainWidgetPositionToGrid';
import { DashboardState } from '../../state';

type GridProperties = keyof DashboardState['grid'];
type GridValues = DashboardState['grid'][GridProperties];

export const changeGridProperty = (
  state: DashboardState,
  property: GridProperties,
  value: GridValues
): DashboardState => {
  const grid = {
    ...state.grid,
    [property]: value,
  };
  const widgets = state.dashboardConfiguration.widgets.map((w) => {
    return constrainWidgetPositionToGrid({ x: 0, y: 0, width: grid.width, height: grid.height }, w);
  });

  return {
    ...state,
    dashboardConfiguration: {
      ...state.dashboardConfiguration,
      widgets,
    },
    grid,
  };
};
