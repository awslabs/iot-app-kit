import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import noop from 'lodash/noop';
import isEqual from 'lodash/isEqual';
import { type DashboardConfigurationChange } from '~/types';
import { convertToDashboardConfiguration } from '~/util/convertToDashbaoardConfiguration';

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
