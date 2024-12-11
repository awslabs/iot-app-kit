import { type PropsWithChildren, type ReactNode } from 'react';
import { DashboardFrame } from '~/dashboard/dashboardFrame';
import { AssistantFloatingMenu } from '~/features/assistant/assistantFloatingMenu';
import { CanvasFrame } from '~/features/dashboardCanvas/canvasFrame';
import { useMode } from '#features/mode/useMode';
import { DashboardPanel } from '~/features/dashboardPanels/dashboardPanel';
import { PanelHeader } from '~/features/dashboardPanels/panelHeader/panelHeader';
import { ViewModeCanvas } from '~/layout/viewMode/viewModeCanvas';
import { useStoreSelector } from '#store/hooks';
import { ViewModeDashboardHeader } from './viewModeDashboardHeader';
import { ViewModePanelControlBar } from './viewModePanelControlBar';

export interface ViewModeLayoutProps extends PropsWithChildren {
  assistantPanel: ReactNode;
}

export function ViewModeLayout({
  assistantPanel,
  children,
}: ViewModeLayoutProps) {
  const { mode } = useMode();
  const panelType = useStoreSelector((state) => state.panels[mode].panelType);
  const isAssistantEnabled = useStoreSelector(
    (state) => state.assistant.state !== 'DISABLED'
  );

  return (
    <DashboardFrame>
      <ViewModeDashboardHeader />

      <CanvasFrame
        panelAction={isAssistantEnabled ? <AssistantFloatingMenu /> : null}
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
