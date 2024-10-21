import { useContext } from 'react';
import { DashboardContext } from './dashboard-context';

export function useDashboardContext() {
  return useContext(DashboardContext);
}
