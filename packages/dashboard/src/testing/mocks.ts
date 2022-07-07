/**
 * Shared mocks for testing purposes
 */

import { DashboardConfiguration } from '../types';

export const MOCK_WIDGET = {
  id: 'some-id',
  widget: 'kpi',
  x: 2,
  y: 2,
  z: 2,
  width: 2,
  height: 2,
};

export const dashboardConfig: DashboardConfiguration = [MOCK_WIDGET];
