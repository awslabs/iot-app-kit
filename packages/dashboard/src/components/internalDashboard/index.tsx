import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@cloudscape-design/components/box';
import { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';

import { Position, Widget } from '../../types';
import { selectedRect } from '../../util/select';
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
import { ResourceExplorer } from '../resourceExplorer';
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
import { useSelectionGestures } from './gestures/useSelection';
import { Gesture } from './gestures/types';

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
  const [activeGesture, setActiveGesture] = useState<Gesture | undefined>(undefined);
  const [anchor, setAnchor] = useState<Anchor | null>(null);

  const { userSelection, onPointSelect, onSelectionStart, onSelectionUpdate, onSelectionEnd } = useSelectionGestures({
    setActiveGesture,
    dashboardConfiguration,
    cellSize: grid.cellSize,
  });

  /**
   * Selection handlers
   */
  const onClearSelection = () => {
    selectWidgets([], false);
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
    /**
     * Note: isOnSelection refers to the cursor being in a location which is over the selection rect but not
     * over a selected widget. To understand if we are on a widget in the selection we must use the widget id
     */
    const { isOnResizeHandle, isOnSelection, isOnWidget, widgetId, isUnion, anchor } =
      determineTargetGestures(dragEvent);

    const isOnWidgetInSelection = selectedWidgets.some((widget) => widget.id === widgetId);

    const isMoveGesture = !isUnion && (isOnWidget || isOnSelection);

    if (isOnWidget && !isOnSelection && !isOnWidgetInSelection) {
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
              {query && <ResourceExplorer treeQuery={query.assetTree.fromRoot()} messageOverrides={messageOverrides} />}
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
