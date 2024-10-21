import React, { memo, type PropsWithChildren, type ReactNode } from 'react';
import { DashboardFrame } from '~/dashboard/dashboard-frame';
import { ContextMenu } from '~/features/context-menu';
import { CanvasFrame } from '~/features/dashboard-canvas/canvas-frame';
import { useMode } from '~/features/dashboard-mode';
import { DashboardPanel } from '~/features/dashboard-panels/dashboard-panel';
import { PanelHeader } from '~/features/dashboard-panels/panel-header/panel-header';
import { SettingsPanel } from '~/features/dashboard-settings/dashboard-settings';
import { EditModeCanvas } from '~/layout/edit-mode/edit-mode-canvas';
import { EditModeDashboardHeader } from '~/layout/edit-mode/edit-mode-dashboard-header';
import { useStoreSelector } from '~/store';
import { EditModePanelControlBar } from './edit-mode-panel-control-bar';

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
        </CanvasFrame>
      </DashboardFrame>
    );
  }
);
