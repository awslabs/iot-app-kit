import type { Viewport } from '@iot-app-kit/core';
import type { DashboardConfiguration } from './dashboard-configuration';

export type DashboardConfigurationChange = (
  dashboardConfiguration: DashboardConfiguration
) => void;

export type ViewportChange = (viewport: Viewport) => void;
