import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { Credentials, Provider } from '@aws-sdk/types';
import { SiteWiseDataSourceInitInputs } from './initialize';

const DEFAULT_REGION = 'us-west-2';

const DEFAULT_PARTITION = 'com';

export const sitewiseSdk = ({
  credentials,
  awsRegion,
  awsPartition,
}: {
  credentials: Credentials | Provider<Credentials>;
  awsRegion?: string;
  awsPartition?: string;
}) =>
  new IoTSiteWiseClient({
    region: awsRegion || DEFAULT_REGION,
    endpoint: `https://iotsitewise.${awsRegion || DEFAULT_REGION}.amazonaws.${awsPartition || DEFAULT_PARTITION}/`,
    credentials,
  });

export const getSiteWiseClient = (input: SiteWiseDataSourceInitInputs): IoTSiteWiseClient => {
  const { iotSiteWiseClient, awsCredentials, awsRegion } = input;

  if (iotSiteWiseClient) {
    return iotSiteWiseClient;
  }

  if (awsCredentials) {
    return sitewiseSdk({ credentials: awsCredentials, awsRegion });
  }

  throw Error('IoTSiteWiseClient not found or credentials missing');
};
