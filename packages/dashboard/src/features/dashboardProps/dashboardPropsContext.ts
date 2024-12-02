import { createContext } from 'react';
import type { DashboardProps } from '../../types';

export type DashboardPropsContextState = Pick<
  DashboardProps,
  'onSave' | 'edgeMode' | 'timeZone' | 'name'
>;

export const DashboardPropsContext = createContext<DashboardPropsContextState>(
  {}
);
