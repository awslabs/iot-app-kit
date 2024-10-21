import React, { type PropsWithChildren, type ReactNode } from 'react';
import { DashboardFrame } from '~/dashboard/dashboard-frame';
import { CanvasFrame } from '~/features/dashboard-canvas/canvas-frame';
import { useMode } from '~/features/dashboard-mode';
import { DashboardPanel } from '~/features/dashboard-panels/dashboard-panel';
import { PanelHeader } from '~/features/dashboard-panels/panel-header/panel-header';
import { ViewModeCanvas } from '~/layout/view-mode/view-mode-canvas';
import { ViewModeDashboardHeader } from '~/layout/view-mode/view-mode-dashboard-header';
import { useStoreSelector } from '~/store';
import { ViewModePanelControlBar } from './view-mode-panel-control-bar';

export interface ViewModeLayoutProps extends PropsWithChildren {
  assistantPanel: ReactNode;
}

export function ViewModeLayout({
  assistantPanel,
  children,
}: ViewModeLayoutProps) {
  const { mode } = useMode();
  const panelType = useStoreSelector((state) => state.panels[mode].panelType);

  return (
    <DashboardFrame>
      <ViewModeDashboardHeader />

      <CanvasFrame
        panelControlBar={<ViewModePanelControlBar />}
        openPanel={
          panelType ? (
            <DashboardPanel
              type={panelType}
              header={<PanelHeader>Assistant</PanelHeader>}
            >
              {assistantPanel}
            </DashboardPanel>
          ) : undefined
        }
      >
        <ViewModeCanvas>{children}</ViewModeCanvas>
      </CanvasFrame>
    </DashboardFrame>
  );
}
