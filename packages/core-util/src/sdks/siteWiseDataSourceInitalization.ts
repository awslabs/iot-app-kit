import { IoTEventsClient } from '@aws-sdk/client-iot-events';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { AwsCredentialIdentity, Provider } from '@aws-sdk/types';

export type SiteWiseDataSourceInitalization = {
  iotSiteWiseClient?: IoTSiteWiseClient;
  iotEventsClient?: IoTEventsClient;
  awsCredentials?: AwsCredentialIdentity | Provider<AwsCredentialIdentity>;
  awsRegion?: string | Provider<string>;
};
