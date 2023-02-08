import { Action } from 'redux';

import first from 'lodash/first';
import sortBy from 'lodash/sortBy';

import { Position } from '../../../types';
import { DashboardState } from '../../state';
import { v4 } from 'uuid';

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
  let pasteCounter = state.pasteCounter + 1;

  let offset: Position = {
    x: 0,
    y: 0,
  };
  if (position !== undefined) {
    pasteCounter = 0;

    const cellPosition: Position = {
      x: position && Math.floor(position.x / cellSize),
      y: position && Math.floor(position.y / cellSize),
    };

    const widgetToCompare = first(sortBy(copyGroup, ['x', 'y']));
    offset = {
      x: cellPosition.x - (widgetToCompare?.x ?? 0),
      y: cellPosition.y - (widgetToCompare?.y ?? 0),
    };
  }

  const widgetsToPaste = copyGroup.map((widget) => ({
    ...widget,
    id: v4(),
    x: offset.x + widget.x + pasteCounter,
    y: offset.y + widget.y + pasteCounter,
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
