import isEqual from 'lodash/isEqual';
import noop from 'lodash/noop';
import { useEffect } from 'react';
import { useStoreSelector } from '~/store/hooks';
import { DashboardConfigurationChange } from '~/types';

export const useSyncDashboardConfiguration = ({
  onDashboardConfigurationChange = noop,
}: {
  onDashboardConfigurationChange?: DashboardConfigurationChange;
}) => {
  const mappedDashboardConfiguration = useStoreSelector(
    (state) => state.dashboard.present.dashboardConfiguration,
    isEqual
  );

  useEffect(() => {
    onDashboardConfigurationChange(mappedDashboardConfiguration);
  }, [onDashboardConfigurationChange, mappedDashboardConfiguration]);
};
