import { initialize } from '@iot-app-kit/source-iottwinmaker';
import { useMemo } from 'react';

const useDataSource = (awsCredentials, region, workspaceId) => {
  const datasource = useMemo(() => {
    const datasource = initialize(workspaceId!, {
      awsCredentials: awsCredentials,
      awsRegion: region,
    });
    return datasource;
  }, [awsCredentials, workspaceId]);

  return datasource;
};

export default useDataSource;
