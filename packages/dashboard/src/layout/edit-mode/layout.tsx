import { memo, type PropsWithChildren, type ReactNode } from 'react';
import { DashboardFrame } from '~/dashboard/dashboardFrame';
import { ContextMenu } from '#features/context-menu/contextMenu';
import { CanvasFrame } from '~/features/dashboardCanvas/canvasFrame';
import { useMode } from '#features/mode/useMode';
import { DashboardPanel } from '~/features/dashboardPanels/dashboardPanel';
import { PanelHeader } from '~/features/dashboardPanels/panelHeader/panelHeader';
import { SettingsPanel } from '~/features/dashboardSettings/dashboardSettings';
import { DashboardEmptyState } from '~/layout/editMode/dashboardEmptyState';
import { useStoreSelector } from '#store/hooks';
import { EditModeCanvas } from './editModeCanvas';
import { EditModeDashboardHeader } from './editModeDashboardHeader';
import { EditModePanelControlBar } from './editModePanelControlBar';

export interface EditModeLayoutProps extends PropsWithChildren {
  configurationPanel: ReactNode;
  resourceExplorerPanel: ReactNode;
}

export const EditModeLayout = memo(
  ({
    configurationPanel,
    resourceExplorerPanel,
    children,
  }: EditModeLayoutProps) => {
    const { mode } = useMode();
    const panelType = useStoreSelector((state) => state.panels[mode].panelType);
    const isEmpty = useStoreSelector(
      (store) =>
        store.dashboard.present.dashboardConfiguration.widgets.length === 0
    );

    return (
      <DashboardFrame>
        <EditModeDashboardHeader />

        <CanvasFrame
          panelControlBar={<EditModePanelControlBar />}
          openPanel={
            panelType ? (
              <DashboardPanel
                type={panelType}
                header={
                  <PanelHeader>
                    {panelType === 'resources'
                      ? 'Resources'
                      : panelType === 'customization'
                      ? 'Customization'
                      : 'Settings'}
                  </PanelHeader>
                }
              >
                {panelType === 'resources' ? (
                  resourceExplorerPanel
                ) : panelType === 'customization' ? (
                  configurationPanel
                ) : (
                  <SettingsPanel />
                )}
              </DashboardPanel>
            ) : null
          }
        >
          <EditModeCanvas enabled>
            {children}
            <ContextMenu />
          </EditModeCanvas>
          {isEmpty && <DashboardEmptyState />}
        </CanvasFrame>
      </DashboardFrame>
    );
  }
);
