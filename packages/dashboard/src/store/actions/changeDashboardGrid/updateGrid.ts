import { placeWithinRectangle } from '#grid/rectangle/nest';
import type { DashboardState } from '../../state-old';

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
  const widgets = state.dashboardConfiguration.widgets.map((widget) => {
    const { position: position, dimensions } = placeWithinRectangle(
      {
        position: { x: widget.x, y: widget.y },
        dimensions: { height: widget.height, width: widget.width },
      },
      {
        position: { x: 0, y: 0 },
        dimensions: { width: grid.width, height: grid.height },
      }
    );

    return {
      ...widget,
      ...position,
      ...dimensions,
    };
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
