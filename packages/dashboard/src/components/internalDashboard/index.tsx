import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@cloudscape-design/components/box';
import { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import { WebglContext } from '@iot-app-kit/react-components';

import { Position, Widget } from '~/types';
import { selectedRect } from '~/util/select';
import { DashboardMessages } from '~/messages';

/**
 * Component imports
 */
import { ResizablePanes } from '../resizablePanes';
import ContextMenu, { ContextMenuProps } from '../contextMenu';
import Grid, { DropEvent, GridProps } from '../grid';
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
  onBringWidgetsToFrontAction,
  onCopyWidgetsAction,
  onCreateWidgetsAction,
  onPasteWidgetsAction,
  onSendWidgetsToBackAction,
  onDeleteWidgetsAction,
} from '~/store/actions';
import { DashboardState, SaveableDashboard } from '~/store/state';
import { widgetCreator } from '~/store/actions/createWidget/presets';

import './index.css';
import '@iot-app-kit/components/styles.css';
import { toGridPosition } from '~/util/position';
import { useGestures } from './gestures';
import { useKeyboardShortcuts } from './keyboardShortcuts';

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
  const cellSize = useSelector((state: DashboardState) => state.grid.cellSize);
  const selectedWidgets = useSelector((state: DashboardState) => state.selectedWidgets);
  const copiedWidgets = useSelector((state: DashboardState) => state.copiedWidgets);
  const readOnly = useSelector((state: DashboardState) => state.readOnly);

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
          <ViewportSelection viewport={viewport} messageOverrides={messageOverrides} />
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
      <div className='iot-dashboard-panes-area'>
        <ResizablePanes
          leftPane={
            <div className='iot-resource-explorer-pane'>
              {query && <ResourceExplorer treeQuery={query.assetTree.fromRoot()} messageOverrides={messageOverrides} />}
              {!query && <Box>{messageOverrides.resourceExplorer.explorerEmptyLabel}</Box>}
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
