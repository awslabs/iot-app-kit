import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import last from 'lodash/last';
import sortBy from 'lodash/sortBy';

import { MockWidgetFactory } from '../../../testing/mocks';
import { ResizablePanes } from '../resizablePanes';
/**
 * For developing purposes only.
 * Will be removed once component palette
 * and asset explorer are implemented.
 */
// import { DEMO_TURBINE_ASSET_1, DEMO_TURBINE_ASSET_1_PROPERTY_4, query } from '../../../testing/siteWiseQueries';

import {
  Anchor,
  onChangeDashboardHeightAction,
  onChangeDashboardWidthAction,
  onCreateWidgetsAction,
  onResizeWidgetsAction,
  onSelectWidgetsAction,
} from '../../store/actions';
import { onMoveWidgetsAction } from '../../store/actions/moveWidgets';
import { DashboardState } from '../../store/state';
import { Position, Rect, Widget } from '../../types';
import { getSelectedWidgets } from '../../util/select';
import Grid, { DragEvent, GridProps, PointClickEvent } from '../grid';
import UserSelection, { UserSelectionProps } from '../userSelection';
import Widgets, { WidgetsProps } from '../widgets/list';

import './index.css';
import { determineTargetGestures } from './determineTargetGestures';
import { onDeleteWidgetsAction } from '../../store/actions/deleteWidgets';
import { useKeyPress } from '../../hooks/useKeyPress';

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

const InternalDashboard = () => {
  /**
   * Store variables
   */
  const dashboardConfiguration = useSelector((state: DashboardState) => state.dashboardConfiguration);
  const grid = useSelector((state: DashboardState) => state.grid);
  const selectedWidgets = useSelector((state: DashboardState) => state.selectedWidgets);

  const dispatch = useDispatch();
  const createWidgets = () =>
    dispatch(
      onCreateWidgetsAction({
        widgets: [MockWidgetFactory.getKpiWidget()],
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

  const moveWidgets = (vector: Position, complete?: boolean) => {
    dispatch(
      onMoveWidgetsAction({
        widgets: selectedWidgets,
        vector: {
          x: vector.x / grid.cellSize, // transform to grid units
          y: vector.y / grid.cellSize,
        },
        complete,
      })
    );
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
        vector: {
          x: vector.x / grid.cellSize, // transform to grid units
          y: vector.y / grid.cellSize,
        },
        complete,
      })
    );
  };

  const changeWidth = (e: React.ChangeEvent<HTMLInputElement>) =>
    dispatch(
      onChangeDashboardWidthAction({
        width: parseInt(e.target.value),
      })
    );

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

  /**
   * Keyboard hotkey configuration
   */
  useKeyPress('esc', onClearSelection);
  useKeyPress('backspace, del', deleteWidgets);

  /**
   *
   * Child component props configuration
   */
  const gridProps: GridProps = {
    grid,
    click: onPointClick,
    dragStart: onGestureStart,
    drag: onGestureUpdate,
    dragEnd: onGestureEnd,
  };

  const widgetsProps: WidgetsProps = {
    dashboardConfiguration,
    selectedWidgets,
    cellSize: grid.cellSize,
  };

  const selectionProps: UserSelectionProps = {
    rect: selectedRect(userSelection),
  };

  return (
    <div className="iot-dashboard">
      <div className="iot-dashboard-toolbar">
        toolbar
        <button onClick={createWidgets}>Add widget</button>
        <label>
          width:
          <input type="number" defaultValue={grid.width} onChange={changeWidth} />
        </label>
        <label>
          height:
          <input type="number" defaultValue={grid.height} onChange={changeHeight} />
        </label>
      </div>
      <div className="iot-dashboard-panes-area">
        <ResizablePanes
          leftPane={<div className="dummy-content">Resource explorer pane</div>}
          centerPane={
            <div className="iot-dashboard-grid">
              <Grid {...gridProps}>
                <Widgets {...widgetsProps} />
                {activeGesture === 'select' && <UserSelection {...selectionProps} />}
              </Grid>
            </div>
          }
          rightPane={<div className="dummy-content">Component pane</div>}
        />
      </div>
    </div>
  );
};

export default InternalDashboard;
