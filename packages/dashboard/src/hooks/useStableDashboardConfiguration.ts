import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import noop from 'lodash/noop';
import throttle from 'lodash/throttle';
import isEqual from 'lodash/isEqual';
import { DashboardConfiguration, DashboardConfigurationChange } from '~/types';

export const useStableDashboardConfiguration = ({
  dashboardConfiguration,
  onDashboardConfigurationChange = noop,
}: {
  dashboardConfiguration: DashboardConfiguration;
  onDashboardConfigurationChange?: DashboardConfigurationChange;
}) => {
  const [stableDashboardConfiguration, setStableDashboardconfiguration] =
    useState(dashboardConfiguration);

  const configRef = useRef(dashboardConfiguration);

  const handleDashboardConfigurationChange = useCallback(
    (dc: DashboardConfiguration) => {
      onDashboardConfigurationChange(dc);
      configRef.current = dc;
    },
    [onDashboardConfigurationChange, configRef]
  );

  const onStableDashboardConfigurationChange = useMemo(
    () => throttle(handleDashboardConfigurationChange, 60, { trailing: true }),
    [handleDashboardConfigurationChange]
  );

  useEffect(() => {
    if (!isEqual(dashboardConfiguration, configRef.current)) {
      setStableDashboardconfiguration(dashboardConfiguration);
    }
  }, [dashboardConfiguration]);

  return {
    stableDashboardConfiguration,
    onStableDashboardConfigurationChange,
  };
};
