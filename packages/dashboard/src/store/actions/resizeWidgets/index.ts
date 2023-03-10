import { Action } from 'redux';
import { Position, Rect, Widget } from '~/types';
import { constrainWidgetPositionToGrid } from '~/util/constrainWidgetPositionToGrid';
import { getSelectionBox } from '~/util/getSelectionBox';
import { trimWidgetPosition } from '~/util/trimWidgetPosition';
import { DashboardState } from '../../state';

const MIN_HEIGHT = 2;
const MIN_WIDTH = 2;

export type Anchor = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'left' | 'right' | 'top' | 'bottom';

type ResizeProps = {
  widgets: Widget[];
  selectedWidgetIds: string[];
  vector: Position;
  selectionBox: Rect;
};

type Resizer = (props: ResizeProps) => Widget[];

type ResizeWidgetsActionPayload = {
  anchor: Anchor;
  widgets: Widget[];
  vector: Position;
  complete?: boolean;
};

export interface ResizeWidgetsAction extends Action {
  type: 'RESIZE_WIDGETS';
  payload: ResizeWidgetsActionPayload;
}

export const onResizeWidgetsAction = (payload: ResizeWidgetsActionPayload): ResizeWidgetsAction => ({
  type: 'RESIZE_WIDGETS',
  payload,
});

const heightWithMin = (height: number) => Math.max(height, MIN_HEIGHT);
const widthWithMin = (width: number) => Math.max(width, MIN_WIDTH);

export const resizeWidgets = (state: DashboardState, action: ResizeWidgetsAction): DashboardState => {
  const { anchor, widgets, vector, complete } = action.payload;

  const selectedWidgetIds = widgets.map((w) => w.id);

  const selectionBox = getSelectionBox(widgets);

  if (!selectionBox) return state;

  let resizer: Resizer | null = null;

  switch (anchor) {
    case 'top-left':
      resizer = resizeFromTopLeft;
      break;
    case 'top':
      resizer = resizeFromTop;
      break;
    case 'top-right':
      resizer = resizeFromTopRight;
      break;
    case 'right':
      resizer = resizeFromRight;
      break;
    case 'bottom-right':
      resizer = resizeFromBottomRight;
      break;
    case 'bottom':
      resizer = resizeFromBottom;
      break;
    case 'bottom-left':
      resizer = resizeFromBottomLeft;
      break;
    case 'left':
      resizer = resizeFromLeft;
      break;
  }

  if (!resizer) return state;

  const resizeProps = {
    widgets: state.dashboardConfiguration.widgets,
    selectedWidgetIds: widgets.map((w) => w.id),
    selectionBox,
    vector,
  };

  let resizedWidgets = resizer(resizeProps).map((w) =>
    constrainWidgetPositionToGrid({ x: 0, y: 0, width: state.grid.width, height: state.grid.height }, w)
  );
  resizedWidgets = complete ? resizedWidgets.map(trimWidgetPosition) : resizedWidgets;

  return {
    ...state,
    dashboardConfiguration: {
      ...state.dashboardConfiguration,
      widgets: resizedWidgets,
    },
    selectedWidgets: resizedWidgets.filter((w) => selectedWidgetIds.includes(w.id)),
  };
};

const resizeFromTopLeft: Resizer = ({ widgets, selectionBox, vector, selectedWidgetIds }) => {
  const yScale = Math.max(1 - vector.y / selectionBox.height, 0);
  const xScale = Math.max(1 + (vector.x * -1) / selectionBox.width, 0);

  const gridY = selectionBox.y + vector.y;
  const gridX = selectionBox.x + vector.x;

  return widgets.map((widget) => {
    if (!selectedWidgetIds.includes(widget.id)) return widget;
    return {
      ...widget,
      x: gridX + (widget.x - selectionBox.x) * xScale,
      y: gridY + (widget.y - selectionBox.y) * yScale,
      width: widthWithMin(widget.width * xScale),
      height: heightWithMin(widget.height * yScale),
    };
  });
};

const resizeFromTop: Resizer = ({ widgets, selectionBox, vector, selectedWidgetIds }) => {
  const yScale = Math.max(1 - vector.y / selectionBox.height, 0);
  const gridY = selectionBox.y + vector.y;

  return widgets.map((widget) => {
    if (!selectedWidgetIds.includes(widget.id)) return widget;

    return {
      ...widget,
      y: gridY + (widget.y - selectionBox.y) * yScale,
      height: heightWithMin(widget.height * yScale),
    };
  });
};

const resizeFromTopRight: Resizer = ({ widgets, selectionBox, vector, selectedWidgetIds }) => {
  const yScale = Math.max(1 - vector.y / selectionBox.height, 0);
  const xScale = Math.max(1 + vector.x / selectionBox.width, 0);

  const gridY = selectionBox.y + vector.y;

  return widgets.map((widget) => {
    if (!selectedWidgetIds.includes(widget.id)) return widget;
    return {
      ...widget,
      x: selectionBox.x + (widget.x - selectionBox.x) * xScale,
      y: gridY + (widget.y - selectionBox.y) * yScale,
      width: widthWithMin(widget.width * xScale),
      height: heightWithMin(widget.height * yScale),
    };
  });
};

const resizeFromRight: Resizer = ({ widgets, selectionBox, vector, selectedWidgetIds }) => {
  const xScale = Math.max(1 + vector.x / selectionBox.width, 0);

  return widgets.map((widget) => {
    if (!selectedWidgetIds.includes(widget.id)) return widget;
    return {
      ...widget,
      x: selectionBox.x + (widget.x - selectionBox.x) * xScale,
      width: widthWithMin(widget.width * xScale),
    };
  });
};

const resizeFromBottomRight: Resizer = ({ widgets, selectionBox, vector, selectedWidgetIds }) => {
  const xScale = Math.max(1 + vector.x / selectionBox.width, 0);
  const yScale = Math.max(1 + vector.y / selectionBox.height, 0);

  return widgets.map((widget) => {
    if (!selectedWidgetIds.includes(widget.id)) return widget;
    return {
      ...widget,
      x: selectionBox.x + (widget.x - selectionBox.x) * xScale,
      y: selectionBox.y + (widget.y - selectionBox.y) * yScale,
      width: widthWithMin(widget.width * xScale),
      height: heightWithMin(widget.height * yScale),
    };
  });
};

const resizeFromBottom: Resizer = ({ widgets, selectionBox, vector, selectedWidgetIds }) => {
  const yScale = Math.max(1 + vector.y / selectionBox.height, 0);

  return widgets.map((widget) => {
    if (!selectedWidgetIds.includes(widget.id)) return widget;
    return {
      ...widget,
      y: selectionBox.y + (widget.y - selectionBox.y) * yScale,
      height: heightWithMin(widget.height * yScale),
    };
  });
};

const resizeFromBottomLeft: Resizer = ({ widgets, selectionBox, vector, selectedWidgetIds }) => {
  const yScale = Math.max(1 + vector.y / selectionBox.height, 0);
  const xScale = Math.max(1 + (vector.x * -1) / selectionBox.width, 0);
  const gridX = selectionBox.x + vector.x;

  return widgets.map((widget) => {
    if (!selectedWidgetIds.includes(widget.id)) return widget;
    return {
      ...widget,
      x: gridX + (widget.x - selectionBox.x) * xScale,
      y: selectionBox.y + (widget.y - selectionBox.y) * yScale,
      height: heightWithMin(widget.height * yScale),
      width: widthWithMin(widget.width * xScale),
    };
  });
};

const resizeFromLeft: Resizer = ({ widgets, selectionBox, vector, selectedWidgetIds }) => {
  const xScale = Math.max(1 + (vector.x * -1) / selectionBox.width, 0);
  const gridX = selectionBox.x + vector.x;

  return widgets.map((widget) => {
    if (!selectedWidgetIds.includes(widget.id)) return widget;
    return {
      ...widget,
      x: gridX + (widget.x - selectionBox.x) * xScale,
      width: widthWithMin(widget.width * xScale),
    };
  });
};
