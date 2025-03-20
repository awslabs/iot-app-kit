import { useMemo } from 'react';
import { useStableDashboardConfiguration } from '~/hooks/useStableDashboardConfiguration';
import { DashboardView, type DashboardViewProps } from './view';

export const DashboardViewWrapper = ({
  clientConfiguration,
  dashboardConfiguration,
  edgeMode = 'disabled',
  name,
  currentViewport,
  onViewportChange,
  toolbar,
  timeZone,
  assistantConfiguration,
}: DashboardViewProps) => {
  /* eslint-disable react-hooks/exhaustive-deps */
  const stableOnViewportChange = useMemo(() => onViewportChange, []);
  const stableToolbar = useMemo(() => toolbar, []);

  /**
   * The purpose of this component is to ensure that the dashboard configuration
   * object is stable across onDashboardConfigurationChange events. These events
   * will occur whenever the internal dashboard configuration object
   * changes. As a result, if the user decides to manage their own state,
   * we want to protect against unnecessary re-renders, and will only
   * pass a new property to the Dashboard if it is structurally different.
   */
  const { stableDashboardConfiguration } = useStableDashboardConfiguration({
    dashboardConfiguration,
    onDashboardConfigurationChange: () => {},
    viewmode: 'view',
    viewport: currentViewport,
  });

  return (
    <DashboardView
      clientConfiguration={clientConfiguration}
      dashboardConfiguration={stableDashboardConfiguration}
      assistantConfiguration={assistantConfiguration}
      edgeMode={edgeMode}
      name={name}
      currentViewport={currentViewport}
      onViewportChange={stableOnViewportChange}
      toolbar={stableToolbar}
      timeZone={timeZone}
    />
  );
};
