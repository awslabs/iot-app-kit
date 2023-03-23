import type { Viewport } from '@iot-app-kit/core';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { IoTEventsClient } from '@aws-sdk/client-iot-events';
import type { AwsCredentialIdentity, Provider } from '@aws-sdk/types';
import { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';

export type DashboardClientCredentials = {
  awsCredentials: AwsCredentialIdentity | Provider<AwsCredentialIdentity>;
  awsRegion: string | Provider<string>;
};

export type DashboardIotSiteWiseClients = {
  iotSiteWiseClient: IoTSiteWiseClient;
  iotEventsClient: IoTEventsClient;
};

export type DashboardIotSiteWiseQueries = {
  iotSiteWiseQuery: SiteWiseQuery;
};

export type DashboardClientConfiguration = DashboardIotSiteWiseClients | DashboardClientCredentials;

export type DashboardSave = (config: DashboardConfiguration) => Promise<void>;

export type Widget<T extends Record<string, unknown> = Record<string, unknown>> = {
  type: string;
  id: string;
  x: number;
  y: number;
  z: number;
  height: number;
  width: number;
  properties: T;
};

export type DashboardConfiguration = {
  widgets: Widget[];
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
