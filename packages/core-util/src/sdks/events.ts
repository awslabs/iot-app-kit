import { IoTEventsClient } from '@aws-sdk/client-iot-events';
import type { AwsCredentialIdentity, Provider } from '@aws-sdk/types';

import { SiteWiseDataSourceInitalization } from './siteWiseDataSourceInitalization';
import { getEndpointPovider, DEFAULT_REGION } from './endpointProvider';

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
    endpoint: getEndpointPovider({ subDomain, awsRegion, awsPartition }),
    credentials,
  });

export const getIotEventsClient = (
  input: SiteWiseDataSourceInitalization
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
