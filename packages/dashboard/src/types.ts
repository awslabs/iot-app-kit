import type { IoTEventsClient } from '@aws-sdk/client-iot-events';
import type {
  DescribeDashboardRequest,
  DescribeDashboardResponse,
  IoTSiteWise,
  IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import type { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import type { AwsCredentialIdentity, Provider } from '@aws-sdk/types';
import type { Viewport } from '@iot-app-kit/core';
import type {
  SiteWiseAlarmAssetModelQuery,
  SiteWiseAlarmQuery,
  SiteWiseAssetModelQuery,
  SiteWiseAssetQuery,
  SiteWisePropertyAliasQuery,
  SiteWiseQuery,
} from '@iot-app-kit/source-iotsitewise';
import type { ReactElement } from 'react';
import type { PartialDeep } from 'type-fest';
import type { RefreshRate } from './components/refreshRate/types';

export type DashboardClientCredentials = {
  awsCredentials: AwsCredentialIdentity | Provider<AwsCredentialIdentity>;
  awsRegion: string | Provider<string>;
};

export type DashboardIotSiteWiseClients = {
  iotSiteWiseClient: IoTSiteWiseClient;
  iotEventsClient: IoTEventsClient;
  iotTwinMakerClient: IoTTwinMakerClient;
  iotSiteWise: IoTSiteWise;
};

export type DashboardIotSiteWiseQueries = {
  iotSiteWiseQuery: SiteWiseQuery;
};

export type IoTSiteWiseDataStreamQuery = Partial<
  SiteWiseAssetQuery &
    SiteWisePropertyAliasQuery &
    SiteWiseAssetModelQuery &
    SiteWiseAlarmQuery &
    SiteWiseAlarmAssetModelQuery
>;

export type DashboardClientConfiguration =
  | DashboardIotSiteWiseClients
  | DashboardClientCredentials;

// OnSave has an optional viewMode value which can be used to persist the dashboard's viewMode after the save action
export type DashboardSave = (
  dashboardConfiguration: DashboardConfiguration,
  viewModeOnSave?: 'preview' | 'edit'
) => Promise<void>;

export type ViewportChange = (viewport: Viewport) => void;

export type DashboardConfigurationChange = (
  dashboardConfiguration: DashboardConfiguration
) => void;

export type AssistantStateTypes = 'DISABLED' | 'PASSIVE';

export type AssistantConfiguration = {
  state?: AssistantStateTypes;
};

export type DashboardWidget<
  Properties extends Record<string, unknown> = Record<string, unknown>
> = {
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

export type DashboardTimeSeriesSettings = {
  refreshRate?: RefreshRate;
};

export type DashboardConfiguration<
  Properties extends Record<string, unknown> = Record<string, unknown>
> = {
  displaySettings: DashboardDisplaySettings;
  querySettings?: DashboardTimeSeriesSettings;
  widgets: DashboardWidget<Properties>[];
  defaultViewport?: Viewport;
  /** @deprecated */
  viewport?: Viewport;
};

export type DashboardWidgetsConfiguration<
  Properties extends Record<string, unknown> = Record<string, unknown>
> = {
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

export type PickRequiredOptional<
  T,
  TRequired extends keyof T,
  TOptional extends keyof T
> = Pick<T, TRequired> & PartialDeep<Pick<T, TOptional>>;

export type RequestTimeout = number;

/** First-class function used to send requests to AWS. */
export type RequestFunction<Request, Response> = (
  request: Request,
  options?: {
    abortSignal?: AbortSignal;
    requestTimeout?: RequestTimeout;
  }
) => PromiseLike<Response>;

/**
 * First-class function for requesting IoT SiteWise dashboard descriptions
 * from AWS.
 *
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_DescribeDashboard.html}
 */
export type DescribeDashboard = RequestFunction<
  DescribeDashboardRequest,
  DescribeDashboardResponse
>;

export type MigrateDashboard = (options: {
  parameters: { dashboardId: string };
  iotSiteWiseClient: { describeDashboard: DescribeDashboard };
}) => Promise<DashboardConfiguration>;

export type DashboardToolbar = ({
  viewmode,
  viewport,
  dashboardConfiguration,
}: {
  viewmode: 'preview' | 'edit';
  dashboardConfiguration: DashboardConfiguration;
  viewport?: Viewport;
}) => ReactElement;
