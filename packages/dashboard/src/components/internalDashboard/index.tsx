import React, { CSSProperties, ReactNode, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPlugin } from '@iot-app-kit/core';
import { WebglContext, TimeSync } from '@iot-app-kit/react-components';
import Box from '@cloudscape-design/components/box';
import {
  colorBackgroundCellShaded,
  colorBorderDividerDefault,
  spaceScaledXxxs,
} from '@cloudscape-design/design-tokens';
import { ContentLayout } from '@cloudscape-design/components';

import { selectedRect } from '~/util/select';

/**
 * Component imports
 */
import { ResizablePanes } from '../resizablePanes';
import ContextMenu from '../contextMenu';
import { GestureableGrid, ReadOnlyGrid } from '../grid';
import Widgets from '../widgets/list';
import UserSelection from '../userSelection';
import ComponentPalette from '../palette';
import CustomDragLayer from '../dragLayer';
import { QueryEditor } from '../queryEditor';
import { useClients } from '../dashboard/clientContext';
import DashboardEmptyState from './dashboardEmptyState';

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

import { DefaultDashboardMessages } from '~/messages';
import type { DashboardSave, Position, DashboardWidget } from '~/types';
import type { ContextMenuProps } from '../contextMenu';
import type { DropEvent, GesturableGridProps } from '../grid';
import type { WidgetsProps } from '../widgets/list';
import type { UserSelectionProps } from '../userSelection';
import type { DashboardState } from '~/store/state';
import { useSelectedWidgets } from '~/hooks/useSelectedWidgets';
import ConfirmDeleteModal from '../confirmDeleteModal';
import { AssetModelSelection } from '../assetModelSelection/assetModelSelection';
import { useModelBasedQuery } from '../queryEditor/iotSiteWiseQueryEditor/assetModelDataStreamExplorer/modelBasedQuery/useModelBasedQuery';
import DashboardHeader from './dashboardHeader';

import '@iot-app-kit/components/styles.css';
import './index.css';

type InternalDashboardProperties = {
  onSave?: DashboardSave;
  editable?: boolean;
  name?: string;
  propertiesPanel?: ReactNode;
};

const defaultUserSelect: CSSProperties = { userSelect: 'initial' };
const disabledUserSelect: CSSProperties = { userSelect: 'none' };

const InternalDashboard: React.FC<InternalDashboardProperties> = ({
  onSave,
  editable,
  name,
  propertiesPanel,
}) => {
  const { iotSiteWiseClient, iotTwinMakerClient } = useClients();

  /**
   * disable user select styles on drag to prevent highlighting of text under the pointer
   */
  const [userSelect, setUserSelect] =
    useState<CSSProperties>(defaultUserSelect);

  /**
   * Store variables
   */
  const dashboardConfiguration = useSelector(
    (state: DashboardState) => state.dashboardConfiguration
  );
  const dashboardWidgets = useSelector(
    (state: DashboardState) => state.dashboardConfiguration.widgets
  );
  const grid = useSelector((state: DashboardState) => state.grid);
  const cellSize = useSelector((state: DashboardState) => state.grid.cellSize);
  const copiedWidgets = useSelector(
    (state: DashboardState) => state.copiedWidgets
  );
  const readOnly = useSelector((state: DashboardState) => state.readOnly);
  const selectedWidgets = useSelectedWidgets();
  const significantDigits = useSelector(
    (state: DashboardState) => state.significantDigits
  );
  const { assetModelId, hasModelBasedQuery } = useModelBasedQuery();

  const hasValidAssetModelData = !!(hasModelBasedQuery && assetModelId);

  const [viewFrame, setViewFrameElement] = useState<HTMLDivElement | undefined>(
    undefined
  );
  const [visible, setVisible] = useState<boolean>(false);

  const dispatch = useDispatch();

  const metricsRecorder = getPlugin('metricsRecorder');

  const createWidgets = (widgets: DashboardWidget[]) => {
    dispatch(
      onCreateWidgetsAction({
        widgets,
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

  const bringWidgetsToFront = () => {
    dispatch(onBringWidgetsToFrontAction());
  };

  const sendWidgetsToBack = () => {
    dispatch(onSendWidgetsToBackAction());
  };

  const deleteWidgets = () => {
    setVisible(true);
  };

  const onDelete = () => {
    dispatch(
      onDeleteWidgetsAction({
        widgets: selectedWidgets,
      })
    );
    setVisible(false);
  };

  const widgetLength = dashboardConfiguration.widgets.length;

  /**
   * setup keyboard shortcuts for actions
   */
  useKeyboardShortcuts({ deleteWidgets });

  /**
   * setup gesture handling for grid
   */
  const {
    activeGesture,
    userSelection,
    onPointClick,
    onGestureStart,
    onGestureUpdate,
    onGestureEnd,
  } = useGestures({
    dashboardWidgets,
    selectedWidgets,
    cellSize,
  });

  const onDrop = (e: DropEvent) => {
    const { item, position } = e;
    const componentTag = item.componentTag;

    const widgetPresets = widgetCreator(grid)(componentTag);

    const { x, y } = toGridPosition(position, cellSize);

    const widget: DashboardWidget = {
      ...widgetPresets,
      x: Math.floor(x),
      y: Math.floor(y),
      z: 0,
    };
    createWidgets([widget]);

    const widgetType = widget.type;
    metricsRecorder?.record({
      contexts: {
        widgetType,
      },
      metricName: 'DashboardWidgetAdd',
      metricValue: 1,
    });
  };

  /**
   *
   * Child component props configuration
   */
  const gridProps: GesturableGridProps = {
    readOnly: readOnly,
    grid,
    click: onPointClick,
    dragStart: onGestureStart,
    drag: onGestureUpdate,
    dragEnd: onGestureEnd,
    drop: onDrop,
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

  const dashboardToolbarBottomBorder = {
    borderBottom: `solid ${spaceScaledXxxs} ${colorBorderDividerDefault}`,
  };

  if (iotSiteWiseClient == null || iotTwinMakerClient == null) {
    return null;
  }

  const EditComponent = (
    <ContentLayout
      disableOverlap
      header={
        <DashboardHeader
          name={name}
          editable={editable}
          readOnly={readOnly}
          dashboardConfiguration={dashboardConfiguration}
          grid={grid}
          significantDigits={significantDigits}
          onSave={onSave}
        />
      }
    >
      <div className='dashboard' style={userSelect}>
        <CustomDragLayer
          onDrag={(isDragging) =>
            setUserSelect(isDragging ? disabledUserSelect : defaultUserSelect)
          }
        />
        <div
          style={dashboardToolbarBottomBorder}
          className='dashboard-toolbar'
          aria-label='edit mode dashboard toolbar'
          //eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
        >
          <Box float='left' padding='s'>
            <ComponentPalette />
          </Box>
        </div>
        <ResizablePanes
          leftPane={
            <QueryEditor
              iotSiteWiseClient={iotSiteWiseClient}
              iotTwinMakerClient={iotTwinMakerClient}
            />
          }
          centerPane={
            <div
              className='display-area'
              ref={(el) => setViewFrameElement(el || undefined)}
              style={{ backgroundColor: colorBackgroundCellShaded }}
            >
              <GestureableGrid {...gridProps}>
                <ContextMenu {...contextMenuProps} />
                <Widgets {...widgetsProps} />
                {!widgetLength && <DashboardEmptyState />}
                {activeGesture === 'select' && (
                  <UserSelection {...selectionProps} />
                )}
              </GestureableGrid>
              <WebglContext viewFrame={viewFrame} />
            </div>
          }
          rightPane={propertiesPanel}
        />
      </div>
    </ContentLayout>
  );
  const ReadOnlyComponent = (
    <ContentLayout
      disableOverlap
      header={
        <DashboardHeader
          name={name}
          editable={editable}
          readOnly={readOnly}
          dashboardConfiguration={dashboardConfiguration}
          grid={grid}
          significantDigits={significantDigits}
          onSave={onSave}
        />
      }
    >
      <div className='dashboard'>
        {hasValidAssetModelData && (
          <div
            style={dashboardToolbarBottomBorder}
            className='dashboard-toolbar-read-only'
            aria-label='preview mode dashboard toolbar'
            //eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={0}
          >
            <Box float='left' padding='s'>
              <AssetModelSelection client={iotSiteWiseClient} />
            </Box>
          </div>
        )}
        <div
          className='display-area'
          ref={(el) => setViewFrameElement(el || undefined)}
          style={{ backgroundColor: colorBackgroundCellShaded }}
        >
          <ReadOnlyGrid {...grid}>
            <Widgets {...widgetsProps} />
          </ReadOnlyGrid>
          <WebglContext viewFrame={viewFrame} />
        </div>
      </div>
    </ContentLayout>
  );

  return (
    <TimeSync initialViewport={{ duration: '5m' }} group='dashboard-timesync'>
      {readOnly ? ReadOnlyComponent : EditComponent}
      <ConfirmDeleteModal
        visible={visible}
        headerTitle={`Delete selected widget${
          selectedWidgets.length > 1 ? 's' : ''
        }?`}
        cancelTitle='Cancel'
        submitTitle='Delete'
        description={
          <Box>
            <Box variant='p'>
              {`Are you sure you want to delete the selected widget${
                selectedWidgets.length > 1 ? 's' : ''
              }? You'll lose all the progress you made to the
                        widget${selectedWidgets.length > 1 ? 's' : ''}`}
            </Box>
            <Box variant='p' padding={{ top: 'm' }}>
              You cannot undo this action.
            </Box>
          </Box>
        }
        handleDismiss={() => setVisible(false)}
        handleCancel={() => setVisible(false)}
        handleSubmit={onDelete}
      />
    </TimeSync>
  );
};

export default InternalDashboard;
