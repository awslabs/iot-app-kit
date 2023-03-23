import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { WebglContext } from '@iot-app-kit/react-components';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';

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
  onDeleteWidgetsAction,
  onPasteWidgetsAction,
  onSendWidgetsToBackAction,
} from '~/store/actions';
import { widgetCreator } from '~/store/actions/createWidget/presets';

import { toGridPosition } from '~/util/position';
import { useGestures } from './gestures';
import { useKeyboardShortcuts } from './keyboardShortcuts';

import type { DashboardSave, Position, Widget } from '~/types';
import type { ContextMenuProps } from '../contextMenu';
import type { DropEvent, GridProps } from '../grid';
import type { WidgetsProps } from '../widgets/list';
import type { UserSelectionProps } from '../userSelection';
import type { DashboardState } from '~/store/state';
import { useSelectedWidgets } from '~/hooks/useSelectedWidgets';

import '@iot-app-kit/components/styles.css';
import './index.css';
import { DefaultDashboardMessages } from '~/messages';

type InternalDashboardProps = {
  onSave?: DashboardSave;
};

const Divider = () => <div className='divider' />;

const InternalDashboard: React.FC<InternalDashboardProps> = ({ onSave }) => {
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
    readOnly,
    dashboardConfiguration,
    selectedWidgets,
    messageOverrides: DefaultDashboardMessages,
    cellSize,
    dragEnabled: grid.enabled,
  };

  const selectionProps: UserSelectionProps = {
    rect: selectedRect(userSelection),
  };

  const contextMenuProps: ContextMenuProps = {
    messageOverrides: DefaultDashboardMessages,
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
      <div className='dashboard'>
        <div className='dashboard-toolbar'>
          <Box float='right' padding='s'>
            <SpaceBetween size='s' direction='horizontal'>
              <ViewportSelection key='1' messageOverrides={DefaultDashboardMessages} />
              <Divider key='2' />
              <Actions
                key='3'
                messageOverrides={DefaultDashboardMessages}
                readOnly={readOnly}
                onSave={onSave}
                dashboardConfiguration={dashboardConfiguration}
                grid={grid}
              />
            </SpaceBetween>
          </Box>
        </div>
        <div className='display-area'>
          <Widgets {...widgetsProps} />
        </div>
        <WebglContext />
      </div>
    );
  }

  return (
    <div className='dashboard'>
      <CustomDragLayer messageOverrides={DefaultDashboardMessages} />
      <div className='dashboard-toolbar'>
        <Box float='left' padding='s'>
          <ComponentPalette messageOverrides={DefaultDashboardMessages} />
        </Box>
        <Box float='right' padding='s'>
          <SpaceBetween size='s' direction='horizontal'>
            <ViewportSelection key='1' messageOverrides={DefaultDashboardMessages} />
            <Divider key='2' />
            <Actions
              key='3'
              readOnly={readOnly}
              messageOverrides={DefaultDashboardMessages}
              onSave={onSave}
              dashboardConfiguration={dashboardConfiguration}
              grid={grid}
            />
          </SpaceBetween>
        </Box>
      </div>
      <ResizablePanes
        leftPane={<ResourceExplorer />}
        centerPane={
          <div className='display-area' ref={(el) => setViewFrameElement(el || undefined)}>
            <Grid {...gridProps}>
              <ContextMenu {...contextMenuProps} />
              <Widgets {...widgetsProps} />
              {activeGesture === 'select' && <UserSelection {...selectionProps} />}
            </Grid>
            <WebglContext viewFrame={viewFrame} />
          </div>
        }
        rightPane={<SidePanel messageOverrides={DefaultDashboardMessages} />}
      />
    </div>
  );
};

export default InternalDashboard;
