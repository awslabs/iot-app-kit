import { type EdgeMode } from '@iot-app-kit/core';
import { createContext } from 'react';
import { type DashboardSave } from '#features/saving/types';

export interface MetaContextState {
  onSave: DashboardSave | undefined;
  edgeMode: EdgeMode | undefined;
  timeZone: string | undefined;
  name: string | undefined;
}

export const initialMetaContextState: MetaContextState = {
  onSave: undefined,
  edgeMode: undefined,
  timeZone: undefined,
  name: undefined,
};

export const MetaContext = createContext<MetaContextState>(
  initialMetaContextState
);
