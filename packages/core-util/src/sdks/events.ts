import { IoTEventsClient } from '@aws-sdk/client-iot-events';
import type { AwsCredentialIdentity, Provider } from '@aws-sdk/types';

import { type SiteWiseDataSourceInitialization } from './siteWiseDataSourceInitialization';
import { DEFAULT_REGION, getEndpointProvider } from './endpointProvider';

const subDomain = 'iotevents';

export const eventsSdk = ({
  credentials,
  awsRegion,
  awsPartition,
}: {
  credentials: AwsCredentialIdentity | Provider<AwsCredentialIdentity>;
  awsRegion?: string | Provider<string>;
  awsPartition?: string;
}) =>
  new IoTEventsClient({
    region: awsRegion || DEFAULT_REGION,
    endpoint: getEndpointProvider({ subDomain, awsRegion, awsPartition }),
    credentials,
  });

export const getIotEventsClient = (
  input: SiteWiseDataSourceInitialization
): IoTEventsClient => {
  const { iotEventsClient, awsCredentials, awsRegion } = input;

  if (iotEventsClient) {
    return iotEventsClient;
  }

  if (awsCredentials) {
    return eventsSdk({ credentials: awsCredentials, awsRegion });
  }

  throw Error('IoTEventsClient not found or credentials missing');
};
