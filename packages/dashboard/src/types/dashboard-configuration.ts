import type { Viewport } from '@iot-app-kit/core';
import type { RefreshRate } from '../components/refreshRate/types';
import type { RegisteredWidget } from './widgets';

export interface DashboardDisplaySettings {
  numRows: number;
  numColumns: number;
  cellSize?: number;
  significantDigits?: number;
}

export interface DashboardTimeSeriesSettings {
  refreshRate?: RefreshRate;
}

export interface DashboardConfiguration {
  displaySettings: DashboardDisplaySettings;
  querySettings?: DashboardTimeSeriesSettings;
  widgets: RegisteredWidget[];
  defaultViewport?: Viewport;
  /** @deprecated */
  viewport?: Viewport;
}
