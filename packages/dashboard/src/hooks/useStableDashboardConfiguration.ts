import { Viewport } from '@iot-app-kit/core';
import isEqual from 'lodash/isEqual';
import noop from 'lodash/noop';
import throttle from 'lodash/throttle';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DashboardConfiguration, DashboardConfigurationChange } from '~/types';

export const useStableDashboardConfiguration = ({
  dashboardConfiguration,
  onDashboardConfigurationChange = noop,
  viewport,
  viewmode,
}: {
  dashboardConfiguration: DashboardConfiguration;
  onDashboardConfigurationChange?: DashboardConfigurationChange;
  viewport?: Viewport;
  viewmode?: string;
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
  }, [dashboardConfiguration, viewport, viewmode]);

  return {
    stableDashboardConfiguration,
    onStableDashboardConfigurationChange,
  };
};
