import { DashboardConfiguration, Widget } from '../types';
import { DescribeAssetResponse } from '@aws-sdk/client-iotsitewise';

export type DashboardState = {
  grid: {
    enabled: boolean;
    width: number;
    height: number;
    cellSize: number;
    stretchToFit: boolean;
  };
  readOnly: boolean;
  selectedWidgets: Widget[];
  copiedWidgets: Widget[];
  pasteCounter: number;
  dashboardConfiguration: DashboardConfiguration;
  assetsDescriptionMap: {
    [assetId: string]: DescribeAssetResponse;
  };
};

export type SaveableDashboard = {
  grid: {
    width: number;
    height: number;
    cellSize: number;
    stretchToFit: boolean;
  };
  dashboardConfiguration: DashboardConfiguration;
  assetsDescriptionMap: DashboardState['assetsDescriptionMap'];
};

export const initialState: DashboardState = {
  grid: {
    enabled: true,
    width: 100,
    height: 100,
    cellSize: 10,
    stretchToFit: false,
  },
  readOnly: false,
  selectedWidgets: [],
  copiedWidgets: [],
  pasteCounter: 0,
  dashboardConfiguration: {
    viewport: { duration: '5m' },
    widgets: [],
  },
  assetsDescriptionMap: {},
};
