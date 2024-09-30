import React, { CSSProperties, ReactNode, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Viewport, getPlugin } from '@iot-app-kit/core';
import { WebglContext } from '@iot-app-kit/react-components';
import Box from '@cloudscape-design/components/box';
import {
  colorBackgroundCellShaded,
  colorBackgroundLayoutMain,
  colorBorderDividerDefault,
  colorChartsPurple700,
  spaceScaledXxxs,
} from '@cloudscape-design/design-tokens';
import { ContentLayout } from '@cloudscape-design/components';
import messages from '@cloudscape-design/components/i18n/messages/all.all';
import { I18nProvider } from '@cloudscape-design/components/i18n';
import PropertiesPanelIcon from '../resizablePanes/assets/propertiesPane.svg';

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
import type {
  DashboardSave,
  Position,
  DashboardWidget,
  DashboardToolbar,
  DashboardConfigurationChange,
} from '~/types';
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
import { useDashboardViewport } from '~/hooks/useDashboardViewport';
import { parseViewport } from '~/util/parseViewport';
import Actions from '../actions';
import { useSyncDashboardConfiguration } from '~/hooks/useSyncDashboardConfiguration';
import { Chatbot } from '../assistant/chatbot';
import { useChatbotPosition } from '~/hooks/useChatbotPosition';
import AssistantIcon from '../assistant/assistantIcon.svg';

type InternalDashboardProperties = {
  onSave?: DashboardSave;
  editable?: boolean;
  name?: string;
  propertiesPanel?: ReactNode;
  defaultViewport?: Viewport;
  currentViewport?: Viewport;
  toolbar?: DashboardToolbar;
  onDashboardConfigurationChange?: DashboardConfigurationChange;
};

const defaultUserSelect: CSSProperties = { userSelect: 'initial' };
const disabledUserSelect: CSSProperties = { userSelect: 'none' };

const InternalDashboard: React.FC<InternalDashboardProperties> = ({
  onSave,
  onDashboardConfigurationChange,
  editable,
  name,
  propertiesPanel,
  currentViewport,
  toolbar,
}) => {
  useSyncDashboardConfiguration({ onDashboardConfigurationChange });

  const { iotSiteWiseClient, iotTwinMakerClient, iotSiteWise } = useClients();

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
  const assistant = useSelector((state: DashboardState) => state.assistant);
  const selectedWidgets = useSelectedWidgets();
  const { assetModelId, hasModelBasedQuery } = useModelBasedQuery();

  const hasValidAssetModelData = !!(hasModelBasedQuery && assetModelId);

  const [viewFrame, setViewFrameElement] = useState<HTMLDivElement | undefined>(
    undefined
  );
  const [visible, setVisible] = useState<boolean>(false);
  useDashboardViewport(
    currentViewport || parseViewport(dashboardConfiguration?.defaultViewport)
  );
  const { chatbotHeight, calculateChatbotDimensions } = useChatbotPosition(
    '[data-test-id=read-only-mode-dashboard]'
  );

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

  const onAddWidget = ({
    componentTag,
    position,
  }: {
    componentTag: string;
    position: Position;
  }) => {
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

  const onDrop = (e: DropEvent) => {
    const { item, position } = e;
    const componentTag = item.componentTag;

    onAddWidget({ componentTag, position });
  };

  // Adds the widget to the start of the dashboard
  // Provides an accessible way to add a widget
  const onAddWidgetFromPalette = (componentTag: string) => {
    onAddWidget({ componentTag, position: { x: 0, y: 0 } });
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
    backgroundColor: colorBackgroundLayoutMain,
  };

  if (
    iotSiteWiseClient == null ||
    iotTwinMakerClient == null ||
    iotSiteWise == null
  ) {
    return null;
  }

  const EditComponent = (
    <ContentLayout
      disableOverlap
      headerVariant='high-contrast'
      header={
        <DashboardHeader
          editable={editable}
          toolbar={toolbar}
          onSave={onSave}
          name={name}
        />
      }
    >
      <div
        className='dashboard'
        data-test-id='edit-mode-dashboard'
        style={userSelect}
      >
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
          <div
            style={{
              padding: '12px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <ComponentPalette onAddWidget={onAddWidgetFromPalette} />
            {toolbar && (
              <Actions
                key='3'
                defaultToolbar={false}
                readOnly={readOnly}
                editable={editable}
              />
            )}
          </div>
        </div>
        <ResizablePanes
          leftPane={
            <QueryEditor
              iotSiteWiseClient={iotSiteWise}
              selectedWidgets={selectedWidgets}
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
          rightPaneOptions={{
            icon: PropertiesPanelIcon,
            headerText: 'Configuration',
            hideHeader: true,
          }}
        />
      </div>
    </ContentLayout>
  );

  const ReadOnlyComponent = (
    <ContentLayout
      disableOverlap
      headerVariant='high-contrast'
      header={
        <DashboardHeader
          editable={editable}
          toolbar={toolbar}
          onSave={onSave}
          name={name}
        />
      }
    >
      <div className='dashboard' data-test-id='read-only-mode-dashboard'>
        {hasValidAssetModelData && (
          <div
            style={dashboardToolbarBottomBorder}
            className='dashboard-toolbar-read-only'
            aria-label='preview mode dashboard toolbar'
            data-test-id='read-only-mode-dashboard-toolbar'
            //eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={0}
          >
            <Box float='left' padding='s'>
              <AssetModelSelection iotSiteWiseClient={iotSiteWise} />
            </Box>
          </div>
        )}
        {assistant.state === 'DISABLED' ? (
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
        ) : (
          <ResizablePanes
            leftPane={null}
            centerPane={
              <div
                className='display-area'
                ref={(el) => {
                  calculateChatbotDimensions();
                  setViewFrameElement(el || undefined);
                }}
                style={{ backgroundColor: colorBackgroundCellShaded }}
              >
                <ReadOnlyGrid {...grid}>
                  <Widgets {...widgetsProps} />
                </ReadOnlyGrid>
                <WebglContext viewFrame={viewFrame} />
              </div>
            }
            rightPane={<Chatbot height={chatbotHeight} />}
            rightPaneOptions={{
              icon: AssistantIcon,
              iconBackground: colorChartsPurple700,
              headerText: 'AI Assistant',
              hideHeader: true,
            }}
          />
        )}
      </div>
    </ContentLayout>
  );

  return (
    <I18nProvider locale='en' messages={[messages]}>
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
    </I18nProvider>
  );
};

export default InternalDashboard;
