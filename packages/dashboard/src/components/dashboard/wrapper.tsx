import React, { useMemo } from 'react';
import { useStableDashboardConfiguration } from '~/hooks/useStableDashboardConfiguration';
import Dashboard, { DashboardProperties } from './index';

const DEFAULT_DASHBOARD_VIEWPORT = { duration: '10m' };

export const DashboardWrapper: React.FC<DashboardProperties> = ({
  onSave,
  clientConfiguration,
  dashboardConfiguration,
  edgeMode = 'disabled',
  initialViewMode,
  name,
  currentViewport = DEFAULT_DASHBOARD_VIEWPORT,
  onViewportChange,
  onDashboardConfigurationChange,
}) => {
  /* eslint-disable react-hooks/exhaustive-deps */
  const stableOnViewportChange = useMemo(() => onViewportChange, []);

  /**
   * The purpose of this component is to ensure that the dashboard configuration
   * object is stable across onDashboardConfigurationChange events. These events
   * will occur whenever the internal dashboard congifuration object
   * changes. As a result, if the user decides to manage their own state,
   * we want to protect against unnecessary re-renders, and will only
   * pass a new property to the Dashboard if it is structurally different.
   */
  const { stableDashboardConfiguration, onStableDashboardConfigurationChange } =
    useStableDashboardConfiguration({
      dashboardConfiguration,
      onDashboardConfigurationChange,
    });

  return (
    <Dashboard
      onSave={onSave}
      clientConfiguration={clientConfiguration}
      dashboardConfiguration={stableDashboardConfiguration}
      edgeMode={edgeMode}
      initialViewMode={initialViewMode}
      name={name}
      currentViewport={currentViewport}
      onViewportChange={stableOnViewportChange}
      onDashboardConfigurationChange={onStableDashboardConfigurationChange}
    />
  );
};
