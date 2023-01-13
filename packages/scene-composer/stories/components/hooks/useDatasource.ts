import { initialize } from '@iot-app-kit/source-iottwinmaker';
import { useMemo } from 'react';

const region = 'us-east-1';
const rociEndpoint = 'https://iottwinmaker.us-east-1.amazonaws.com';

const useDataSource = (awsCredentials, workspaceId) => {
  const datasource = useMemo(() => {
    const datasource = initialize(workspaceId!, {
      awsCredentials: awsCredentials,
      awsRegion: region,
      tmEndpoint: rociEndpoint,
    });
    return datasource;
  }, [awsCredentials, workspaceId]);

  return datasource;
};

export default useDataSource;
