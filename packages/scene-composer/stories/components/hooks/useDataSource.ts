import { useMemo } from 'react';
import { initialize } from '@iot-app-kit/source-iottwinmaker';
import { type CredentialProvider, type Credentials } from '@aws-sdk/types';

const region = 'us-east-1';
const rociEndpoint = 'https://iottwinmaker.us-east-1.amazonaws.com';
// const rociEndpoint = 'https://gamma.us-east-1.twinmaker.iot.aws.dev';

const useDataSource = (
  awsCredentials: Credentials | CredentialProvider | undefined,
  workspaceId: string | undefined,
) => {
  const datasource = useMemo(() => {
    const datasource = initialize(workspaceId!, {
      awsCredentials: awsCredentials!,
      awsRegion: region,
      tmEndpoint: rociEndpoint,
    });
    return datasource;
  }, [awsCredentials, workspaceId]);

  return datasource;
};

export default useDataSource;
