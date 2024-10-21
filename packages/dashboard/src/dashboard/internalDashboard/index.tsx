import '@iot-app-kit/components/styles.css';
import { Viewport } from '@iot-app-kit/core';
import React, { CSSProperties, memo, ReactNode, useState } from 'react';
import { useMode } from '~/features/dashboard-mode';
import { useDefaultViewport } from '~/features/dashboard-settings/use-default-viewport';
import { ResourceExplorer } from '~/features/resource-explorer';
import { useModelBasedQuery } from '~/features/resource-explorer/iotSiteWiseQueryEditor/assetModelDataStreamExplorer/modelBasedQuery/useModelBasedQuery';
import { useDeleteWidgets } from '~/features/widget-deletion/use-delete-widgets';
import CustomDragLayer from '~/features/widget-movement';
import { useSelectedWidgetIds } from '~/features/widget-selection/use-selected-widget-ids';
import { useSelectedWidgets } from '~/features/widget-selection/use-selected-widgets';
import Widgets, { WidgetsProps } from '~/features/widgets/list';
import { useDashboardViewport } from '~/hooks/useDashboardViewport';
import { useSyncDashboardConfiguration } from '~/hooks/useSyncDashboardConfiguration';
import { EditModeLayout } from '~/layout/edit-mode/edit-mode-layout';
import { ViewModeLayout } from '~/layout/view-mode/view-mode-layout';
import { DefaultDashboardMessages } from '~/messages';
import '~/styles/reset.css';
import '~/styles/variables.css';
import type {
  DashboardConfigurationChange,
  DashboardSave,
  DashboardToolbar,
} from '~/types';
import { useKeyboardShortcuts } from './keyboardShortcuts';

type InternalDashboardProperties = {
  onSave?: DashboardSave;
  editable?: boolean;
  propertiesPanel?: ReactNode;
  defaultViewport?: Viewport;
  currentViewport?: Viewport;
  toolbar?: DashboardToolbar;
  onDashboardConfigurationChange?: DashboardConfigurationChange;
};

const defaultUserSelect: CSSProperties = { userSelect: 'initial' };
const disabledUserSelect: CSSProperties = { userSelect: 'none' };

const InternalDashboard = memo(function ({
  onDashboardConfigurationChange,
  editable,
  propertiesPanel,
  currentViewport,
  toolbar,
}: InternalDashboardProperties) {
  useSyncDashboardConfiguration({ onDashboardConfigurationChange });

  /**
   * disable user select styles on drag to prevent highlighting of text under the pointer
   */
  const [userSelect, setUserSelect] =
    useState<CSSProperties>(defaultUserSelect);

  /**
   * Store variables
   */
  const deleteWidgets = useDeleteWidgets();
  const [defaultViewport] = useDefaultViewport();
  const { mode } = useMode();

  const selectedWidgetIds = useSelectedWidgetIds();
  const selectedWidgets = useSelectedWidgets();
  const { assetModelId, hasModelBasedQuery } = useModelBasedQuery();

  const hasValidAssetModelData = !!(hasModelBasedQuery && assetModelId);

  const [viewFrame, setViewFrameElement] = useState<HTMLDivElement | undefined>(
    undefined
  );
  const [visible, setVisible] = useState<boolean>(false);

  useDashboardViewport(currentViewport || defaultViewport);

  const handleDeleteWidgets = () => {
    deleteWidgets({ widgetIds: selectedWidgetIds });
    setVisible(true);
  };

  /**
   * setup keyboard shortcuts for actions
   */
  useKeyboardShortcuts({ deleteWidgets: handleDeleteWidgets });

  /**
   * setup gesture handling for grid
   */

  /**
   *
   * Child component props configuration
   */

  const widgetsProps: WidgetsProps = {
    readOnly: false,
    messageOverrides: DefaultDashboardMessages,
    dragEnabled: true,
  };

  /*
  const selectionProps: UserSelectionProps = {
    rect: selectedRect(userSelection),
  };
  */

  if (mode === 'edit') {
    return (
      <>
        <CustomDragLayer
          onDrag={(isDragging) =>
            setUserSelect(isDragging ? disabledUserSelect : defaultUserSelect)
          }
        />

        <EditModeLayout
          configurationPanel={propertiesPanel}
          resourceExplorerPanel={<ResourceExplorer />}
        >
          <Widgets {...widgetsProps} />
        </EditModeLayout>
      </>
    );
  } else {
    return (
      <ViewModeLayout assistantPanel={<></>}>
        <Widgets {...widgetsProps} />
      </ViewModeLayout>
    );
  }
});

export default InternalDashboard;
