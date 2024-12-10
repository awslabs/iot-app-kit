import isEqual from 'lodash-es/isEqual';
import noop from 'lodash-es/noop';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { type DashboardConfigurationChange } from '../types';
import { convertToDashboardConfiguration } from '../util/convertToDashbaoardConfiguration';

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
