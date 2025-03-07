import type { IoTEventsClient } from '@aws-sdk/client-iot-events';
import type {
  IoTSiteWise,
  IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import type { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import type { AwsCredentialIdentity, Provider } from '@aws-sdk/types';

export interface DashboardIotSiteWiseClients {
  iotSiteWiseClient: IoTSiteWiseClient;
  iotEventsClient: IoTEventsClient;
  iotTwinMakerClient: IoTTwinMakerClient;
  iotSiteWise: IoTSiteWise;
}

export interface DashboardClientCredentials {
  awsCredentials: AwsCredentialIdentity | Provider<AwsCredentialIdentity>;
  awsRegion: string | Provider<string>;
}

export type DashboardClientConfiguration =
  | DashboardIotSiteWiseClients
  | DashboardClientCredentials;
