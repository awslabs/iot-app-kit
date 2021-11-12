import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { Credentials, Provider } from '@aws-sdk/types';

// Fall back region if none provided as an env variable `AWS_REGION`.
const DEFAULT_REGION = 'us-west-2';

export const sitewiseSdk = (credentials: Credentials | Provider<Credentials>) =>
  new IoTSiteWiseClient({
    region: DEFAULT_REGION,
    endpoint: `https://iotsitewise.${DEFAULT_REGION}.amazonaws.com/`,
    credentials,
  });
