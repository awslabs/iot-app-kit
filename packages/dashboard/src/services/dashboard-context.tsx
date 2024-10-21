import { type EdgeMode } from '@iot-app-kit/core';
import { createContext } from 'react';
import { DashboardSave } from '~/types';

export interface DashboardContextState {
  onSave: DashboardSave | undefined;
  edgeMode: EdgeMode | undefined;
  timeZone: string | undefined;
  name: string | undefined;
}

export const dashboardContextInitialState: DashboardContextState = {
  onSave: undefined,
  edgeMode: undefined,
  timeZone: undefined,
  name: undefined,
};

export const DashboardContext = createContext<DashboardContextState>(
  dashboardContextInitialState
);
