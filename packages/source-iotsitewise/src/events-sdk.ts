import { IoTEventsClient } from '@aws-sdk/client-iot-events';
import { Credentials, Provider } from '@aws-sdk/types';
import { SiteWiseDataSourceInitInputs } from './initialize';

const DEFAULT_REGION = 'us-west-2';

const DEFAULT_PARTITION = 'com';

export const eventsSdk = ({
  credentials,
  awsRegion,
  awsPartition,
}: {
  credentials: Credentials | Provider<Credentials>;
  awsRegion?: string;
  awsPartition?: string;
}) =>
  new IoTEventsClient({
    region: awsRegion || DEFAULT_REGION,
    endpoint: `https://iotevents.${awsRegion || DEFAULT_REGION}.amazonaws.${awsPartition || DEFAULT_PARTITION}/`,
    credentials,
  });

export const getIotEventsClient = (input: SiteWiseDataSourceInitInputs): IoTEventsClient => {
  const { iotEventsClient, awsCredentials, awsRegion } = input;

  if (iotEventsClient) {
    return iotEventsClient;
  }

  if (awsCredentials) {
    return eventsSdk({ credentials: awsCredentials, awsRegion });
  }

  throw Error('IoTEventsClient not found or credentials missing');
};
