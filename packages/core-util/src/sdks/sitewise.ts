import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import type { AwsCredentialIdentity, Provider } from '@aws-sdk/types';

import { SiteWiseDataSourceInitalization } from './siteWiseDataSourceInitalization';
import { getEndpointPovider, DEFAULT_REGION } from './endpointProvider';

const subDomain = 'iotsitewise';

export const sitewiseSdk = ({
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
    endpoint: getEndpointPovider({ subDomain, awsRegion, awsPartition }),
    credentials,
  });

export const getSiteWiseClient = (
  input: SiteWiseDataSourceInitalization
): IoTSiteWiseClient => {
  const { iotSiteWiseClient, awsCredentials, awsRegion } = input;

  if (iotSiteWiseClient) {
    return iotSiteWiseClient;
  }

  if (awsCredentials) {
    return sitewiseSdk({ credentials: awsCredentials, awsRegion });
  }

  throw Error('IoTSiteWiseClient not found or credentials missing');
};
