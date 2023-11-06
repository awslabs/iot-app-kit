import type { Viewport } from '@iot-app-kit/core';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { IoTEventsClient } from '@aws-sdk/client-iot-events';
import type { AwsCredentialIdentity, Provider } from '@aws-sdk/types';
import {
  SiteWiseAssetModelQuery,
  SiteWiseAssetQuery,
  SiteWisePropertyAliasQuery,
  SiteWiseQuery,
} from '@iot-app-kit/source-iotsitewise';
import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';

export type DashboardClientCredentials = {
  awsCredentials: AwsCredentialIdentity | Provider<AwsCredentialIdentity>;
  awsRegion: string | Provider<string>;
};

export type DashboardIotSiteWiseClients = {
  iotSiteWiseClient: IoTSiteWiseClient;
  iotEventsClient: IoTEventsClient;
  iotTwinMakerClient: IoTTwinMakerClient;
};

export type DashboardIotSiteWiseQueries = {
  iotSiteWiseQuery: SiteWiseQuery;
};

export type IoTSiteWiseDataStreamQuery = Partial<
  SiteWiseAssetQuery & SiteWisePropertyAliasQuery & SiteWiseAssetModelQuery
>;

export type DashboardClientConfiguration = DashboardIotSiteWiseClients | DashboardClientCredentials;

export type DashboardSave = (dashboardConfiguration: DashboardConfiguration) => Promise<void>;

export type DashboardWidget<Properties extends Record<string, unknown> = Record<string, unknown>> = {
  type: string;
  id: string;
  x: number;
  y: number;
  z: number;
  height: number;
  width: number;
  properties: Properties;
};

export type DashboardDisplaySettings = {
  numRows: number;
  numColumns: number;
  cellSize?: number;
  significantDigits?: number;
};

export type DashboardConfiguration<Properties extends Record<string, unknown> = Record<string, unknown>> = {
  displaySettings: DashboardDisplaySettings;
  widgets: DashboardWidget<Properties>[];
  viewport: Viewport;
};

export type DashboardWidgetsConfiguration<Properties extends Record<string, unknown> = Record<string, unknown>> = {
  widgets: DashboardWidget<Properties>[];
  viewport: Viewport;
};

export type Position = { x: number; y: number };
export type Rect = { x: number; y: number; width: number; height: number };
export type Selection = {
  start: Position;
  end: Position;
};

export enum MouseClick {
  Left = 0,
  Right = 2,
}

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};

export type PickRequiredOptional<T, TRequired extends keyof T, TOptional extends keyof T> = Pick<T, TRequired> &
  RecursivePartial<Pick<T, TOptional>>;
