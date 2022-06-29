import { DashboardConfiguration } from '../types';

export const createWidget = ({ dashboardConfiguration }: { dashboardConfiguration: DashboardConfiguration }) => [
  ...dashboardConfiguration,
  {
    x: 1,
    y: 1,
    z: 1,
    width: 4,
    height: 4,
    widget: 'line-chart',
    id: Math.random().toString() + new Date().toISOString(),
  },
];
