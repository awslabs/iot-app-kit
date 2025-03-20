import { ContentLayout } from '@cloudscape-design/components';
import Box from '@cloudscape-design/components/box';
import { I18nProvider } from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.all';
import {
  colorBackgroundCellShaded,
  colorBackgroundLayoutMain,
  colorBorderDividerDefault,
  colorForegroundControlReadOnly,
  spaceScaledXxxs,
} from '@cloudscape-design/design-tokens';
import { type Viewport } from '@iot-app-kit/core';
import { WebglContext } from '@iot-app-kit/react-components';
import { type CSSProperties, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PropertiesPaneIcon } from '../resizablePanes/assets/propertiesPaneIcon';
import { selectedRect } from '../../util/select';
import { ContextMenu } from '../../components/contextMenu';
import { Palette } from '../../components/palette';
import { useClients } from '../dashboard/clientContext';
import { CustomDragLayer } from '../dragLayer';
import type { DropEvent } from '../grid';
import { GestureableGrid, ReadOnlyGrid } from '../grid';
import { QueryEditor } from '../queryEditor';
import { ResizablePanes } from '../resizablePanes';
import { UserSelection } from '../userSelection';
import type { WidgetsProps } from '../widgets/list';
import { Widgets } from '../widgets/list';
import { DashboardEmptyState } from './dashboardEmptyState';
import {
  onBringWidgetsToFrontAction,
  onCopyWidgetsAction,
  onCreateWidgetsAction,
  onDeleteWidgetsAction,
  onPasteWidgetsAction,
  onSendWidgetsToBackAction,
} from '../../store/actions';
import { createWidgetInstance } from '../../features/widget-instance/create';
import { toGridPosition } from '../../util/position';
import { useGestures } from './gestures';
import { useKeyboardShortcuts } from './keyboardShortcuts';
import { useSelectedWidgets } from '../../features/selection/use-selected-widgets';
import type { DashboardState } from '../../store/state';
import type { DashboardConfigurationChange } from '../../types/dashboard-props';
import type { DashboardSave } from '../../types/saving';
import type { DashboardToolbar, Position } from '~/types';
import { AssetModelSelection } from '../assetModelSelection/assetModelSelection';
import { ConfirmDeleteModal } from '../confirmDeleteModal';
import { useModelBasedQuery } from '../queryEditor/iotSiteWiseQueryEditor/useQuery/useModelBasedQuery';
import { DashboardHeader } from './dashboardHeader';
import { useChatbotPosition } from '../../hooks/useChatbotPosition';
import { useDashboardViewport } from '../../hooks/useDashboardViewport';
import { useSyncDashboardConfiguration } from '../../hooks/useSyncDashboardConfiguration';
import { parseViewport } from '../../util/parseViewport';
import { Actions } from '../../components/actions';
import { AssistantFloatingMenu } from '../assistant/assistantFloatingMenu';
import { AssistantIcon } from '../assistant/assistantIcon';
import { Chatbot } from '../assistant/chatbot';
import './index.css';
import { type WidgetInstance } from '~/features/widget-instance/instance';
import { type RegisteredWidgetType } from '~/features/widget-plugins/registry';
import { SettingsPanel } from '../../features/widget-customization/settings-panel';

const defaultUserSelect = { userSelect: 'initial' } satisfies CSSProperties;
const disabledUserSelect = { userSelect: 'none' } satisfies CSSProperties;
const dashboardToolbarBottomBorder = {
  borderBottom: `solid ${spaceScaledXxxs} ${colorBorderDividerDefault}`,
  backgroundColor: colorBackgroundLayoutMain,
} satisfies CSSProperties;

export interface InternalDashboardProps {
  onSave?: DashboardSave;
  editable?: boolean;
  name?: string;
  defaultViewport?: Viewport;
  currentViewport?: Viewport;
  toolbar?: DashboardToolbar;
  onDashboardConfigurationChange?: DashboardConfigurationChange;
}

export const InternalDashboard = ({
  onSave,
  onDashboardConfigurationChange,
  editable,
  name,
  currentViewport,
  toolbar,
}: InternalDashboardProps) => {
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

  console.info('new selected widgets in internal dashboard', selectedWidgets);
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
    '.iot-resizable-panes'
  );
  const [resizablePanesWidth, setResizablePanesWidth] = useState<number>(0);

  const dispatch = useDispatch();

  const createWidgets = (widgets: WidgetInstance[]) => {
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
        widgetIds: selectedWidgets,
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

  const onAddWidget = <WidgetType extends RegisteredWidgetType>({
    widgetType,
    position,
  }: {
    widgetType: WidgetType;
    position: Position;
  }) => {
    const widgetPresets = createWidgetInstance(grid)(widgetType);

    const { x, y } = toGridPosition(position, cellSize);

    const widget: WidgetInstance<WidgetType> = {
      ...widgetPresets,
      x: Math.floor(x),
      y: Math.floor(y),
      z: 0,
    };
    createWidgets([widget]);
  };

  const onDrop = <WidgetType extends RegisteredWidgetType>(
    e: DropEvent<WidgetType>
  ) => {
    const { item, position } = e;
    const componentTag = item.widgetType;

    onAddWidget({ widgetType: componentTag, position });
  };

  // Adds the widget to the start of the dashboard
  // Provides an accessible way to add a widget
  const onAddWidgetFromPalette = <WidgetType extends RegisteredWidgetType>(
    widgetType: WidgetType
  ) => {
    onAddWidget({ widgetType, position: { x: 0, y: 0 } });
  };

  const widgetsProps: WidgetsProps = {
    readOnly,
    dashboardConfiguration,
    selectedWidgets,
    cellSize,
    dragEnabled: grid.enabled,
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
        data-testid='edit-mode-dashboard'
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
            <Palette onAddWidget={onAddWidgetFromPalette} />
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
              <GestureableGrid
                readOnly={readOnly}
                grid={grid}
                click={onPointClick}
                dragStart={onGestureStart}
                drag={onGestureUpdate}
                dragEnd={onGestureEnd}
                drop={onDrop}
              >
                <ContextMenu
                  copyWidgets={copyWidgets}
                  pasteWidgets={pasteWidgets}
                  deleteWidgets={deleteWidgets}
                  sendWidgetsToBack={sendWidgetsToBack}
                  bringWidgetsToFront={bringWidgetsToFront}
                  hasCopiedWidgets={copiedWidgets.length > 0}
                  hasSelectedWidgets={selectedWidgets.length > 0}
                />
                <Widgets {...widgetsProps} />
                {!widgetLength && <DashboardEmptyState />}
                {activeGesture === 'select' && (
                  <UserSelection rectangle={selectedRect(userSelection)} />
                )}
              </GestureableGrid>
              <WebglContext viewFrame={viewFrame} />
            </div>
          }
          rightPane={
            selectedWidgets[0] ? (
              <SettingsPanel widget={selectedWidgets[0]} />
            ) : null
          }
          rightPaneOptions={{
            icon: <PropertiesPaneIcon role='img' ariaLabel='Configuration' />,
            headerText: 'Configuration',
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
      <div className='dashboard' data-testid='read-only-mode-dashboard'>
        {hasValidAssetModelData && (
          <div
            style={dashboardToolbarBottomBorder}
            className='dashboard-toolbar-read-only'
            aria-label='preview mode dashboard toolbar'
            data-testid='read-only-mode-dashboard-toolbar'
            //eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={0}
          >
            <Box float='left' padding='s'>
              <AssetModelSelection iotSiteWiseClient={iotSiteWise} />
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

  const AssistantComponent = (
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
      <div className='dashboard' data-testid='read-only-mode-dashboard'>
        {hasValidAssetModelData && (
          <div
            style={dashboardToolbarBottomBorder}
            className='dashboard-toolbar-readonly-assistant'
            aria-label='dashboard assistant mode with toolbar'
            data-testid='assistant-mode-dashboard-toolbar'
            //eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={0}
          >
            <Box float='left' padding='s'>
              <AssetModelSelection iotSiteWiseClient={iotSiteWise} />
            </Box>
          </div>
        )}
        <ResizablePanes
          onResize={(size) => {
            if (size.width) {
              setResizablePanesWidth(size.width);
            }
          }}
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
                <AssistantFloatingMenu width={resizablePanesWidth} />
                <Widgets {...widgetsProps} />
              </ReadOnlyGrid>
              <WebglContext viewFrame={viewFrame} />
            </div>
          }
          rightPane={<Chatbot height={chatbotHeight} />}
          rightPaneOptions={{
            icon: (
              <AssistantIcon
                role='img'
                // TODO: FIX
                ariaLabel=''
              />
            ),
            iconBackground: colorForegroundControlReadOnly,
            // TODO: FIX
            headerText: '',
            hideHeaderWhenExpanded: true,
          }}
        />
      </div>
    </ContentLayout>
  );

  const readOnlyOrAssistant =
    assistant.state === 'DISABLED' ? ReadOnlyComponent : AssistantComponent;
  return (
    <I18nProvider locale='en' messages={[messages]}>
      {readOnly ? readOnlyOrAssistant : EditComponent}
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
              {`Do you want to delete the selected widget${
                selectedWidgets.length > 1 ? 's' : ''
              }? All changes will be lost.`}
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
