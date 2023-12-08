import { constrainWidgetPositionToGrid } from '~/util/constrainWidgetPositionToGrid';
import type { DashboardState } from '../../state';
import { WidgetPropertiesGeneratorMap } from '~/customization/widgetPropertiesGeneratorMap';
import { WIDGET_INITIAL_HEIGHT, WIDGET_INITIAL_WIDTH } from '~/customization/widgets/constants';

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
    const { initialSize } = WidgetPropertiesGeneratorMap[w.type] || {};

    const { width: widgetPixelWidth, height: widgetPixelHeight } = initialSize || {
      height: WIDGET_INITIAL_HEIGHT,
      width: WIDGET_INITIAL_WIDTH,
    };
    const width = Math.min(Math.ceil(widgetPixelWidth / state.grid.cellSize), grid.width);
    const height = Math.min(Math.ceil(widgetPixelHeight / state.grid.cellSize), grid.height);

    return constrainWidgetPositionToGrid(
      { x: 0, y: 0, width: grid.width, height: grid.height },
      { ...w, ...(property !== 'cellSize' && { width: width, height: height }) }
    );
  });

  const updatedSelectedWidgets = state.selectedWidgets.map((w) => {
    return widgets.find((k) => k.id === w.id) || w;
  });

  return {
    ...state,
    dashboardConfiguration: {
      ...state.dashboardConfiguration,
      widgets,
    },
    grid,
    selectedWidgets: [...updatedSelectedWidgets],
  };
};
