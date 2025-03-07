import isEqual from 'lodash-es/isEqual';
import noop from 'lodash-es/noop';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { convertToDashboardConfiguration } from '~/util/convertToDashboardConfiguration';
import { type DashboardConfigurationChange } from '~/types/dashboard-props';

export const useSyncDashboardConfiguration = ({
  onDashboardConfigurationChange = noop,
}: {
  onDashboardConfigurationChange?: DashboardConfigurationChange;
}) => {
  const mappedDashboardConfiguration = useSelector(
    convertToDashboardConfiguration,
    isEqual
  );

  useEffect(() => {
    onDashboardConfigurationChange(mappedDashboardConfiguration);
  }, [onDashboardConfigurationChange, mappedDashboardConfiguration]);
};
