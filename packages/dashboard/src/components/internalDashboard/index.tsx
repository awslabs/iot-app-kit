import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@cloudscape-design/components/box';
import { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';

import last from 'lodash/last';
import sortBy from 'lodash/sortBy';

import { Position, Rect, Widget } from '../../types';
import { getSelectedWidgets } from '../../util/select';
import { useKeyPress } from '../../hooks/useKeyPress';
import { determineTargetGestures } from './determineTargetGestures';
import { DashboardMessages } from '../../messages';

/**
 * Component imports
 */
import { ResizablePanes } from '../resizablePanes';
import ContextMenu, { ContextMenuProps } from '../contextMenu';
import Grid, { DragEvent, DropEvent, GridProps, PointClickEvent } from '../grid';
import Widgets, { WidgetsProps } from '../widgets/list';
import UserSelection, { UserSelectionProps } from '../userSelection';
import SidePanel from '../sidePanel';
import ComponentPalette from '../palette';
import CustomDragLayer from '../dragLayer';
import { IotResourceExplorer } from '../resourceExplorer';
import ViewportSelection from '../viewportSelection';
import Actions from '../actions';

/**
 * Store imports
 */
import {
  Anchor,
  onBringWidgetsToFrontAction,
  onChangeDashboardHeightAction,
  onChangeDashboardWidthAction,
  onCopyWidgetsAction,
  onCreateWidgetsAction,
  onPasteWidgetsAction,
  onResizeWidgetsAction,
  onSelectWidgetsAction,
  onSendWidgetsToBackAction,
} from '../../store/actions';
import { onMoveWidgetsAction } from '../../store/actions/moveWidgets';
import { DashboardState, SaveableDashboard } from '../../store/state';
import { onDeleteWidgetsAction } from '../../store/actions/deleteWidgets';
import { widgetCreator } from '../../store/actions/createWidget/presets';
import { DASHBOARD_CONTAINER_ID } from '../grid/getDashboardPosition';

import './index.css';
import '@iot-app-kit/components/styles.css';

type Gesture = 'move' | 'resize' | 'select' | undefined;

type Selection = {
  start: Position;
  end: Position;
};

const selectedRect = (selection: Selection | undefined): Rect | undefined => {
  if (!selection) {
    return undefined;
  }
  return {
    x: Math.min(selection.start.x, selection.end.x),
    y: Math.min(selection.start.y, selection.end.y),
    width: Math.abs(selection.start.x - selection.end.x),
    height: Math.abs(selection.start.y - selection.end.y),
  };
};

const toGridPosition = (position: Position, cellSize: number): Position => ({
  x: position.x / cellSize,
  y: position.y / cellSize,
});

type InternalDashboardProps = {
  messageOverrides: DashboardMessages;
  query?: SiteWiseQuery;
  onSave?: (dashboard: SaveableDashboard) => void;
};

const InternalDashboard: React.FC<InternalDashboardProps> = ({ messageOverrides, query, onSave }) => {
  /**
   * Store variables
   */
  const dashboardConfiguration = useSelector((state: DashboardState) => state.dashboardConfiguration);
  const assetsDescriptionMap = useSelector((state: DashboardState) => state.assetsDescriptionMap);
  const viewport = useSelector((state: DashboardState) => state.dashboardConfiguration.viewport);
  const grid = useSelector((state: DashboardState) => state.grid);
  const selectedWidgets = useSelector((state: DashboardState) => state.selectedWidgets);
  const copiedWidgets = useSelector((state: DashboardState) => state.copiedWidgets);
  const readOnly = useSelector((state: DashboardState) => state.readOnly);

  const dispatch = useDispatch();
  const createWidgets = (widgets: Widget[]) =>
    dispatch(
      onCreateWidgetsAction({
        widgets,
      })
    );

  const selectWidgets = (widgets: Widget[], union: boolean) => {
    dispatch(
      onSelectWidgetsAction({
        widgets,
        union,
      })
    );
  };

  const copyWidgets = () => {
    dispatch(
      onCopyWidgetsAction({
        widgets: selectedWidgets,
      })
    );
  };

  const pasteWidgets = (position?: Position) => {
    dispatch(
      onPasteWidgetsAction({
        position,
      })
    );
  };

  const moveWidgets = (vector: Position, complete?: boolean) => {
    dispatch(
      onMoveWidgetsAction({
        widgets: selectedWidgets,
        vector: toGridPosition(vector, grid.cellSize),
        complete,
      })
    );
  };

  const bringWidgetsToFront = () => {
    dispatch(onBringWidgetsToFrontAction());
  };

  const sendWidgetsToBack = () => {
    dispatch(onSendWidgetsToBackAction());
  };

  const deleteWidgets = () => {
    dispatch(
      onDeleteWidgetsAction({
        widgets: selectedWidgets,
      })
    );
  };

  const resizeWidgets = (anchor: Anchor, vector: Position, complete?: boolean) => {
    dispatch(
      onResizeWidgetsAction({
        anchor,
        widgets: selectedWidgets,
        vector: toGridPosition(vector, grid.cellSize),
        complete,
      })
    );
  };

  // leaving these in for when we hook this up later
  // eslint-disable-next-line
  const changeWidth = (e: React.ChangeEvent<HTMLInputElement>) =>
    dispatch(
      onChangeDashboardWidthAction({
        width: parseInt(e.target.value),
      })
    );

  // eslint-disable-next-line
  const changeHeight = (e: React.ChangeEvent<HTMLInputElement>) =>
    dispatch(
      onChangeDashboardHeightAction({
        height: parseInt(e.target.value),
      })
    );

  /**
   * Local variables
   */
  const [userSelection, setUserSelection] = useState<Selection | undefined>(undefined);
  const [activeGesture, setActiveGesture] = useState<Gesture | undefined>(undefined);
  const [anchor, setAnchor] = useState<Anchor | null>(null);

  /**
   * Selection handlers
   */
  const onClearSelection = () => {
    selectWidgets([], false);
  };
  const onPointSelect = ({ position, union }: { position: Position; union: boolean }) => {
    /**
     * TODO Can refactor this to be less lines
     * edge case where bottom most pixel on a widget does not pick up the intersection
     */
    const { x, y } = position;
    const intersectedWidgets = getSelectedWidgets({
      selectedRect: { x, y, width: 1, height: 1 },
      dashboardConfiguration,
      cellSize: grid.cellSize,
    });
    const selectingAlreadySelectedWidget = intersectedWidgets
      .map((widget) => widget.id)
      .some((widgetId) => selectedWidgets.map((w) => w.id).includes(widgetId));

    if (selectedWidgets.length === 0 || !selectingAlreadySelectedWidget) {
      const sortableWidgets = intersectedWidgets.map((widget, index) => ({ id: widget.id, z: widget.z, index }));
      const topMostWidgetId = last(sortBy(sortableWidgets, ['z', 'index']).map((widget) => widget.id));
      const widgetIds = topMostWidgetId ? [topMostWidgetId] : [];
      const widgets = dashboardConfiguration.widgets.filter((w) => widgetIds.includes(w.id));

      selectWidgets(widgets, union);
    }
  };
  const onSelectionStart = (dragEvent: DragEvent) => {
    setActiveGesture('select');
    setUserSelection({
      start: dragEvent.start,
      end: dragEvent.end,
    });
  };

  const onSelectionUpdate = (dragEvent: DragEvent) => {
    const updatedSelection = {
      start: dragEvent.start,
      end: dragEvent.end,
    };
    setUserSelection(updatedSelection);

    const union = dragEvent.union;

    const intersectedWidgets = getSelectedWidgets({
      selectedRect: selectedRect(updatedSelection),
      dashboardConfiguration,
      cellSize: grid.cellSize,
    });

    selectWidgets(intersectedWidgets, union);
  };
  const onSelectionEnd = () => {
    setUserSelection(undefined);
  };

  /**
   * Move handlers
   */
  const onMoveStart = () => {
    setActiveGesture('move');
  };
  const onMoveUpdate = (dragEvent: DragEvent) => {
    moveWidgets(dragEvent.vector, false);
  };
  const onMoveEnd = (dragEvent: DragEvent) => {
    moveWidgets(dragEvent.vector, true);
  };

  /**
   * Resize handlers
   */
  const onResizeStart = (anchor: Anchor | null) => {
    setAnchor(anchor);
    setActiveGesture('resize');
  };
  const onResizeUpdate = (dragEvent: DragEvent) => {
    if (!anchor) return;
    resizeWidgets(anchor, dragEvent.vector, false);
  };
  const onResizeEnd = (dragEvent: DragEvent) => {
    if (!anchor) return;
    resizeWidgets(anchor, dragEvent.vector, true);
    setAnchor(null);
  };

  /**
   * Gesture handlers
   */
  const onPointClick = (pointClickEvent: PointClickEvent) => {
    onPointSelect(pointClickEvent);
  };
  const onGestureStart = (dragEvent: DragEvent) => {
    const { isOnResizeHandle, isOnSelection, isOnWidget, isUnion, anchor } = determineTargetGestures(dragEvent);

    const isMoveGesture = !isUnion && (isOnWidget || isOnSelection);

    if (isOnWidget && !isOnSelection) {
      onPointSelect({ position: dragEvent.start, union: dragEvent.union });
    }

    if (isOnResizeHandle) {
      onResizeStart(anchor);
    } else if (isMoveGesture) {
      onMoveStart();
    } else {
      onSelectionStart(dragEvent);
    }
  };
  const onGestureUpdate = (dragEvent: DragEvent) => {
    if (activeGesture === 'resize') {
      onResizeUpdate(dragEvent);
    } else if (activeGesture === 'select') {
      onSelectionUpdate(dragEvent);
    } else if (activeGesture === 'move') {
      onMoveUpdate(dragEvent);
    }
  };
  const onGestureEnd = (dragEvent: DragEvent) => {
    if (activeGesture === 'resize') {
      onResizeEnd(dragEvent);
    } else if (activeGesture === 'select') {
      onSelectionEnd();
    } else if (activeGesture === 'move') {
      onMoveEnd(dragEvent);
    }

    setActiveGesture(undefined);
    setAnchor(null);
  };

  const onDrop = (e: DropEvent) => {
    const { item, position } = e;
    const componentTag = item.componentTag;

    const widgetPresets = widgetCreator(grid)(componentTag);

    const { x, y } = toGridPosition(position, grid.cellSize);

    const widget: Widget = {
      ...widgetPresets,
      x: Math.floor(x),
      y: Math.floor(y),
      z: 0,
    };
    createWidgets([widget]);
  };

  /**
   * Keyboard hotkey / shortcut configuration
   * key press filter makes sure that the event is not coming from
   * other areas where we might use keyboard interactions such as
   * the settings pane or a text area in a widget
   */
  const keyPressFilter = (e: KeyboardEvent) =>
    e.target !== null &&
    e.target instanceof Element &&
    (e.target.id === DASHBOARD_CONTAINER_ID || e.target === document.body);
  useKeyPress('esc', { filter: keyPressFilter, callback: onClearSelection });
  useKeyPress('backspace, del', { filter: keyPressFilter, callback: deleteWidgets });
  useKeyPress('mod+c', { filter: keyPressFilter, callback: copyWidgets });
  useKeyPress('mod+v', { filter: keyPressFilter, callback: () => pasteWidgets() });
  useKeyPress('[', { filter: keyPressFilter, callback: sendWidgetsToBack });
  useKeyPress(']', { filter: keyPressFilter, callback: bringWidgetsToFront });

  /**
   *
   * Child component props configuration
   */
  const gridProps: GridProps = {
    readOnly,
    grid,
    click: onPointClick,
    dragStart: onGestureStart,
    drag: onGestureUpdate,
    dragEnd: onGestureEnd,
    drop: onDrop,
  };

  const widgetsProps: WidgetsProps = {
    query,
    readOnly,
    dashboardConfiguration,
    selectedWidgets,
    messageOverrides,
    cellSize: grid.cellSize,
    dragEnabled: grid.enabled,
  };

  const selectionProps: UserSelectionProps = {
    rect: selectedRect(userSelection),
  };

  const contextMenuProps: ContextMenuProps = {
    messageOverrides,
    copyWidgets,
    pasteWidgets,
    deleteWidgets,
    sendWidgetsToBack,
    bringWidgetsToFront,
    hasCopiedWidgets: copiedWidgets.length > 0,
    hasSelectedWidgets: selectedWidgets.length > 0,
  };

  if (readOnly) {
    return (
      <div className="iot-dashboard">
        <div className="iot-dashboard-grid">
          <Grid {...gridProps}>
            <Widgets {...widgetsProps} />
          </Grid>
        </div>
      </div>
    );
  }

  return (
    <div className="iot-dashboard">
      <CustomDragLayer messageOverrides={messageOverrides} />
      <div className="iot-dashboard-toolbar">
        <ComponentPalette messageOverrides={messageOverrides} />
        <ViewportSelection viewport={viewport} messageOverrides={messageOverrides} />
        {onSave && (
          <Actions
            messageOverrides={messageOverrides}
            onSave={onSave}
            dashboardConfiguration={dashboardConfiguration}
            grid={grid}
            assetsDescriptionMap={assetsDescriptionMap}
          />
        )}
      </div>
      <div className="iot-dashboard-panes-area">
        <ResizablePanes
          leftPane={
            <div className="iot-resource-explorer-pane">
              {query && (
                <IotResourceExplorer treeQuery={query.assetTree.fromRoot()} messageOverrides={messageOverrides} />
              )}
              {!query && <Box>{messageOverrides.resourceExplorer.explorerEmptyLabel}</Box>}
            </div>
          }
          centerPane={
            <div className="iot-dashboard-grid">
              <Grid {...gridProps}>
                <ContextMenu {...contextMenuProps} />
                <Widgets {...widgetsProps} />
                {activeGesture === 'select' && <UserSelection {...selectionProps} />}
              </Grid>
            </div>
          }
          rightPane={<SidePanel messageOverrides={messageOverrides} />}
        />
      </div>
    </div>
  );
};

export default InternalDashboard;
