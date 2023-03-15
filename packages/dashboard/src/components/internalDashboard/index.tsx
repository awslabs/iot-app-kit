import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { WebglContext } from '@iot-app-kit/react-components';
import { selectedRect } from '~/util/select';
/**
 * Component imports
 */
import { ResizablePanes } from '../resizablePanes';
import ContextMenu from '../contextMenu';
import Grid from '../grid';
import Widgets from '../widgets/list';
import UserSelection from '../userSelection';
import SidePanel from '../sidePanel';
import ComponentPalette from '../palette';
import CustomDragLayer from '../dragLayer';
import ResourceExplorer from '../resourceExplorer';
import ViewportSelection from '../viewportSelection';
import Actions from '../actions';

/**
 * Store imports
 */
import {
  onBringWidgetsToFrontAction,
  onCopyWidgetsAction,
  onCreateWidgetsAction,
  onDeleteWidgetsAction,
  onPasteWidgetsAction,
  onSendWidgetsToBackAction,
} from '~/store/actions';
import { widgetCreator } from '~/store/actions/createWidget/presets';

import { toGridPosition } from '~/util/position';
import { useGestures } from './gestures';
import { useKeyboardShortcuts } from './keyboardShortcuts';

import '@iot-app-kit/components/styles.css';
import './index.css';
import type { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import type { Position, Widget } from '~/types';
import type { DashboardMessages } from '~/messages';
import type { ContextMenuProps } from '../contextMenu';
import type { DropEvent, GridProps } from '../grid';
import type { WidgetsProps } from '../widgets/list';
import type { UserSelectionProps } from '../userSelection';
import type { DashboardState, SaveableDashboard } from '~/store/state';
import { useSelectedWidgets } from '~/hooks/useSelectedWidgets';

type InternalDashboardProps = {
  messageOverrides: DashboardMessages;
  hasEditPermission: boolean;
  query?: SiteWiseQuery;
  onSave?: (dashboard: SaveableDashboard) => void;
};

const InternalDashboard: React.FC<InternalDashboardProps> = ({
  messageOverrides,
  hasEditPermission,
  query,
  onSave,
}) => {
  /**
   * Store variables
   */
  const dashboardConfiguration = useSelector((state: DashboardState) => state.dashboardConfiguration);
  const grid = useSelector((state: DashboardState) => state.grid);
  const cellSize = useSelector((state: DashboardState) => state.grid.cellSize);
  const copiedWidgets = useSelector((state: DashboardState) => state.copiedWidgets);
  const readOnly = useSelector((state: DashboardState) => state.readOnly);
  const selectedWidgets = useSelectedWidgets();

  const [viewFrame, setViewFrameElement] = useState<HTMLDivElement | undefined>(undefined);

  const dispatch = useDispatch();
  const createWidgets = (widgets: Widget[]) =>
    dispatch(
      onCreateWidgetsAction({
        widgets,
      })
    );

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

  /**
   * setup keyboard shortcuts for actions
   */
  useKeyboardShortcuts();

  /**
   * setup gesture handling for grid
   */
  const { activeGesture, userSelection, onPointClick, onGestureStart, onGestureUpdate, onGestureEnd } = useGestures({
    dashboardConfiguration,
    selectedWidgets,
    cellSize,
  });

  const onDrop = (e: DropEvent) => {
    const { item, position } = e;
    const componentTag = item.componentTag;

    const widgetPresets = widgetCreator(grid)(componentTag);

    const { x, y } = toGridPosition(position, cellSize);

    const widget: Widget = {
      ...widgetPresets,
      x: Math.floor(x),
      y: Math.floor(y),
      z: 0,
    };
    createWidgets([widget]);
  };

  /**
   *
   * Child component props configuration
   */
  const gridProps: GridProps = {
    readOnly: readOnly,
    grid,
    click: onPointClick,
    dragStart: onGestureStart,
    drag: onGestureUpdate,
    dragEnd: onGestureEnd,
    drop: onDrop,
    children: null,
  };

  const widgetsProps: WidgetsProps = {
    query,
    readOnly,
    dashboardConfiguration,
    selectedWidgets,
    messageOverrides,
    cellSize,
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
      <div className='iot-dashboard'>
        <div className='iot-dashboard-toolbar iot-dashboard-toolbar-overlay'>
          <ViewportSelection messageOverrides={messageOverrides} />
          <Actions
            hasEditPermission={hasEditPermission}
            messageOverrides={messageOverrides}
            readOnly={readOnly}
            onSave={onSave}
            dashboardConfiguration={dashboardConfiguration}
            grid={grid}
          />
        </div>
        <div className='iot-dashboard-grid iot-dashboard-grid-with-overlay'>
          <Grid {...gridProps}>
            <Widgets {...widgetsProps} />
          </Grid>
        </div>
        <WebglContext />
      </div>
    );
  }

  return (
    <div className='iot-dashboard'>
      <CustomDragLayer messageOverrides={messageOverrides} />
      <div className='iot-dashboard-toolbar'>
        <ComponentPalette messageOverrides={messageOverrides} />
        <ViewportSelection messageOverrides={messageOverrides} />
        <Actions
          hasEditPermission={hasEditPermission}
          readOnly={readOnly}
          messageOverrides={messageOverrides}
          onSave={onSave}
          dashboardConfiguration={dashboardConfiguration}
          grid={grid}
        />
      </div>
      <div className='iot-dashboard-panes-area'>
        <ResizablePanes
          leftPane={
            <div className='iot-resource-explorer-pane'>
              <ResourceExplorer treeQuery={query} />
            </div>
          }
          centerPane={
            <div className='iot-dashboard-grid' ref={(el) => setViewFrameElement(el || undefined)}>
              <Grid {...gridProps}>
                <ContextMenu {...contextMenuProps} />
                <Widgets {...widgetsProps} />
                {activeGesture === 'select' && <UserSelection {...selectionProps} />}
              </Grid>
              <WebglContext viewFrame={viewFrame} />
            </div>
          }
          rightPane={<SidePanel messageOverrides={messageOverrides} />}
        />
      </div>
    </div>
  );
};

export default InternalDashboard;
