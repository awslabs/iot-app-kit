import type { Action } from 'redux';
import type { DashboardWidget } from '../../../types';
import type { DashboardState } from '../../state-old';
import * as rectangle from '#grid/final/rectangle';
import * as w from '#grid/final/widget';

type CreateWidgetsActionPayload = {
  widgets: DashboardWidget[];
};

export interface CreateWidgetsAction extends Action {
  type: 'CREATE_WIDGETS';
  payload: CreateWidgetsActionPayload;
}

export const onCreateWidgetsAction = (
  payload: CreateWidgetsActionPayload
): CreateWidgetsAction => ({
  type: 'CREATE_WIDGETS',
  payload,
});

export const createWidgets = (
  state: DashboardState,
  action: CreateWidgetsAction
): DashboardState => {
  const grid: rectangle.Rectangle = {
    min: { x: 0, y: 0 },
    max: { x: state.grid.width, y: state.grid.height },
  };

  const widgets = action.payload.widgets.map((widget) => {
    const widgetRectangle = rectangle.contain(grid, w.toRectangle(widget));

    return {
      ...widget,
      x: widgetRectangle.min.x,
      y: widgetRectangle.min.y,
      width: rectangle.width(widgetRectangle),
      height: rectangle.height(widgetRectangle),
    };
  });

  return {
    ...state,
    dashboardConfiguration: {
      ...state.dashboardConfiguration,
      widgets: [...state.dashboardConfiguration.widgets, ...widgets],
    },
    selectedWidgets: widgets,
  };
};
