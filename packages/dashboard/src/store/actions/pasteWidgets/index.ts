import { minBy, max } from 'lodash';
import { v4 } from 'uuid';
import type { Action } from 'redux';
import type { Position, DashboardWidget } from '~/types';
import type { DashboardState } from '../../state';

type PasteWidgetsActionPayload = {
  position?: Position;
};
export interface PasteWidgetsAction extends Action {
  type: 'PASTE_WIDGETS';
  payload: PasteWidgetsActionPayload;
}

export const onPasteWidgetsAction = (payload: PasteWidgetsActionPayload): PasteWidgetsAction => ({
  type: 'PASTE_WIDGETS',
  payload,
});

export const pasteWidgets = (state: DashboardState, action: PasteWidgetsAction): DashboardState => {
  const { position } = action.payload;

  const cellSize = state.grid.cellSize;
  const copyGroup = state.copiedWidgets;
  const gridWidth = state.grid.width;
  const gridHeight = state.grid.height;
  let pasteCounter = state.pasteCounter + 1;

  let offset: Position = {
    x: 0,
    y: 0,
  };
  const correctionOffset: Position = {
    x: 0,
    y: 0,
  };
  if (position !== undefined) {
    pasteCounter = 0;

    const cellPosition: Position = {
      x: position && Math.floor(position.x / cellSize),
      y: position && Math.floor(position.y / cellSize),
    };

    // getting widgets group's left most cell value
    const leftmostWidget: DashboardWidget = minBy(copyGroup, 'x') || copyGroup[0];
    const groupLeftX = leftmostWidget.x;

    // getting widgets group's top most cell value
    const topmostWidget: DashboardWidget = minBy(copyGroup, 'y') || copyGroup[0];
    const groupTopY = topmostWidget.y;

    // getting widgets group's right most cell value
    const widgetsRightPos = copyGroup.map((widget) => {
      return widget.x + widget.width;
    });
    const groupRightX = max(widgetsRightPos) || gridWidth;

    // getting widgets group's bottom most cell value
    const widgetsBottomPos = copyGroup.map((widget) => {
      return widget.y + widget.height;
    });
    const groupBottomY = max(widgetsBottomPos) || gridHeight;

    // calculating widgets group's width & height
    const groupWidth = groupRightX - groupLeftX;
    const groupHeight = groupBottomY - groupTopY;

    // setting offset postion
    offset = {
      x: cellPosition.x - groupLeftX,
      y: cellPosition.y - groupTopY,
    };

    // setting correction offset position if widgets group's width or height is going off the grid
    if (cellPosition.x + groupWidth > gridWidth) {
      correctionOffset.x = cellPosition.x + groupWidth - gridWidth;
    }
    if (cellPosition.y + groupHeight > gridHeight) {
      correctionOffset.y = cellPosition.y + groupHeight - gridHeight;
    }
  }

  const widgetsToPaste = copyGroup.map((widget) => ({
    ...widget,
    id: v4(),
    x: offset.x + widget.x + pasteCounter - correctionOffset.x,
    y: offset.y + widget.y + pasteCounter - correctionOffset.y,
  }));

  return {
    ...state,
    dashboardConfiguration: {
      ...state.dashboardConfiguration,
      widgets: [...state.dashboardConfiguration.widgets, ...widgetsToPaste],
    },
    pasteCounter: position !== undefined ? 0 : pasteCounter,
    selectedWidgets: widgetsToPaste,
  };
};
