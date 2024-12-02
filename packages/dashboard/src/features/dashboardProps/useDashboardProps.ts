import { useContext } from 'react';
import { DashboardPropsContext } from './dashboardPropsContext';

export function useDashboardProps() {
  return useContext(DashboardPropsContext);
}
