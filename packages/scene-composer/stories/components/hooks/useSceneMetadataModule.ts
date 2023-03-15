import { TwinMakerSceneMetadataModule, initialize } from '@iot-app-kit/source-iottwinmaker';
import { useMemo } from 'react';

const region = 'us-east-1';
// const rociEndpoint = 'https://iottwinmaker.us-east-1.amazonaws.com';
const rociEndpoint = 'https://gamma.us-east-1.twinmaker.iot.aws.dev';

const useSceneMetadataModule = (source, scene, awsCredentials, workspaceId, sceneId) => {
  const awsSceneMetadataModule = useMemo(() => {
    const init = initialize(workspaceId!, {
      awsCredentials: awsCredentials,
      awsRegion: region,
      tmEndpoint: rociEndpoint,
    });
    const sceneMetadataModule = init.sceneMetadataModule(sceneId!);

    return sceneMetadataModule as TwinMakerSceneMetadataModule;
  }, [awsCredentials, workspaceId, sceneId]);

  const sceneMetadataModule = useMemo(() => {
    switch (source) {
      case 'aws':
        return awsCredentials && workspaceId && sceneId ? awsSceneMetadataModule : null;
      default:
        return null;
    }
  }, [scene, awsCredentials, workspaceId, sceneId, source]);

  return sceneMetadataModule;
};

export default useSceneMetadataModule;
