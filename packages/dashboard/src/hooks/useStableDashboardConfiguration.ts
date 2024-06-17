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
  /**
   * This is a temporary change to prevent infinite rerenders.
   * The correct fix requires us to remove the internal dependency
   * on redux to manage the dashboard configuration.
   */

  /* eslint-disable react-hooks/exhaustive-deps */
  const memoizedOnDashboardConfigurationChange = useMemo(
    () => onDashboardConfigurationChange,
    []
  );

  const [stableDashboardConfiguration, setStableDashboardconfiguration] =
    useState(dashboardConfiguration);

  const configRef = useRef(dashboardConfiguration);

  const handleDashboardConfigurationChange = useCallback(
    (dc: DashboardConfiguration) => {
      memoizedOnDashboardConfigurationChange(dc);
      configRef.current = dc;
    },
    [memoizedOnDashboardConfigurationChange, configRef]
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
