import { EndpointV2, Provider } from '@aws-sdk/types';

export const DEFAULT_REGION = 'us-west-2';

export const DEFAULT_PARTITION = 'com';

const constructEndpoint =
  (subDomain: string) =>
  ([awsRegion, awsPartition]: [string, string]): EndpointV2 => ({
    url: new URL(
      `https://${subDomain}.${awsRegion}.amazonaws.${awsPartition}/`
    ),
  });

export const getEndpointPovider = ({
  subDomain,
  awsRegion,
  awsPartition,
}: {
  subDomain: string;
  awsRegion: string | Provider<string> | undefined;
  awsPartition: string | Provider<string> | undefined;
}): Provider<EndpointV2> => {
  let region = Promise.resolve(DEFAULT_REGION);
  let partition = Promise.resolve(DEFAULT_PARTITION);

  if (awsRegion) {
    region =
      typeof awsRegion === 'string' ? Promise.resolve(awsRegion) : awsRegion();
  }

  if (awsPartition) {
    partition =
      typeof awsPartition === 'string'
        ? Promise.resolve(awsPartition)
        : awsPartition();
  }

  return () =>
    Promise.all([region, partition]).then(constructEndpoint(subDomain));
};
