import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { Credentials, Provider } from '@aws-sdk/types';

const DEFAULT_REGION = 'us-west-2';

export const sitewiseSdk = (credentials: Credentials | Provider<Credentials>, awsRegion?: string) =>
  new IoTSiteWiseClient({
    region: awsRegion || DEFAULT_REGION,
    endpoint: `https://iotsitewise.${awsRegion || DEFAULT_REGION}.amazonaws.com/`,
    credentials,
  });
