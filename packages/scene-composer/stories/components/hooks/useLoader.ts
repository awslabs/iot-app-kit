import { SceneLoader, initialize } from '@iot-app-kit/source-iottwinmaker';
import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { useCallback, useMemo } from 'react';

import scenes from '../../scenes';

const region = 'us-east-1';
const rociEndpoint = 'https://iottwinmaker.us-east-1.amazonaws.com';
// const rociEndpoint = 'https://gamma.us-east-1.twinmaker.iot.aws.dev';

export let tmClient;

const useLoader = (source, scene, awsCredentials, workspaceId, sceneId) => {
  const getSceneObject = useCallback((uri: string) => {
    if (!Object.values(scenes).includes(uri)) {
      return null;
    }
    return fetch(uri).then((res) => res.arrayBuffer());
  }, []);

  const localLoader = useMemo(
    () =>
      ({
        getSceneUri: () => {
          if (Object.keys(scenes).includes(scene)) {
            return Promise.resolve(scenes[scene]);
          }
          return null;
        },
        getSceneObject,
      } as SceneLoader),
    [scene],
  );

  const awsLoader = useMemo(() => {
    tmClient = new IoTTwinMakerClient({
      credentials: awsCredentials,
      region: region,
      endpoint: rociEndpoint,
    })
    const init = initialize(workspaceId!, {
      awsCredentials: awsCredentials,
      awsRegion: region,
      tmEndpoint: rociEndpoint,
      iotTwinMakerClient: tmClient
    });
    const loader = init.s3SceneLoader(sceneId!);

    return loader as SceneLoader;
  }, [awsCredentials, workspaceId, sceneId]);

  const loader = useMemo(() => {
    switch (source) {
      case 'aws':
        return awsCredentials && workspaceId && sceneId ? awsLoader : null;
      default:
        return scene ? localLoader : null;
    }
  }, [scene, awsCredentials, workspaceId, sceneId, source]);

  return loader;
};

export default useLoader;
