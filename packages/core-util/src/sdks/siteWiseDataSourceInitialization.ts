import { type IoTEventsClient } from '@aws-sdk/client-iot-events';
import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { type AwsCredentialIdentity, type Provider } from '@aws-sdk/types';

export interface SiteWiseDataSourceInitialization {
  iotSiteWiseClient?: IoTSiteWiseClient;
  iotEventsClient?: IoTEventsClient;
  awsCredentials?: AwsCredentialIdentity | Provider<AwsCredentialIdentity>;
  awsRegion?: string | Provider<string>;
}
