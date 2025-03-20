import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import type { AwsCredentialIdentity, Provider } from '@aws-sdk/types';
import { type SiteWiseDataSourceInitialization } from './siteWiseDataSourceInitialization';
import { DEFAULT_REGION, getEndpointProvider } from './endpointProvider';

const subDomain = 'iotsitewise';

export const siteWiseSdk = ({
  credentials,
  awsRegion,
  awsPartition,
}: {
  credentials: AwsCredentialIdentity | Provider<AwsCredentialIdentity>;
  awsRegion?: string | Provider<string>;
  awsPartition?: string;
}) =>
  new IoTSiteWiseClient({
    region: awsRegion || DEFAULT_REGION,
    endpoint: getEndpointProvider({ subDomain, awsRegion, awsPartition }),
    credentials,
  });

export const getSiteWiseClient = (
  input: SiteWiseDataSourceInitialization
): IoTSiteWiseClient => {
  const { iotSiteWiseClient, awsCredentials, awsRegion } = input;

  if (iotSiteWiseClient) {
    return iotSiteWiseClient;
  }

  if (awsCredentials) {
    return siteWiseSdk({ credentials: awsCredentials, awsRegion });
  }

  throw Error('IoTSiteWiseClient not found or credentials missing');
};
