import type { Viewport } from '@iot-app-kit/core';
import type { RefreshRate } from '../../components/refreshRate/types';
import { type WidgetInstance } from '~/features/widget-instance/instance';

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
  widgets: WidgetInstance[];
  defaultViewport?: Viewport;
  /** @deprecated */
  viewport?: Viewport;
}
