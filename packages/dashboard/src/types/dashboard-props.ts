import type { Viewport } from '@iot-app-kit/core';
import { type DashboardConfiguration } from '~/features/dashboard-configuration/dashboard-configuration';

// TODO: move to dashboard props
export type DashboardConfigurationChange = (
  dashboardConfiguration: DashboardConfiguration
) => void;

export type ViewportChange = (viewport: Viewport) => void;
