import { SceneLoader, initialize } from '@iot-app-kit/source-iottwinmaker';
import { useCallback, useMemo } from 'react';
import str2ab from 'string-to-arraybuffer';

import { testScenes } from '../../../tests/testData';

const region = 'us-east-1';
const rociEndpoint = 'https://iottwinmaker.us-east-1.amazonaws.com';

const useLoader = (source, scene, credentials, workspaceId, sceneId) => {
  const { awsAccessKeyId, awsSecretAccessKey, awsSessionToken } = credentials;
  const sceneContent = useMemo(() => testScenes[scene], [scene]);

  const getSceneObject = useCallback(
    (uri: string) => {
      if (!Object.keys(testScenes).includes(uri)) {
        return null;
      } else {
        return Promise.resolve(str2ab(sceneContent));
      }
    },
    [sceneContent],
  );

  const localLoader = useMemo(
    () =>
      ({
        getSceneUri: () => Promise.resolve(scene),
        getSceneObject,
      } as SceneLoader),
    [scene],
  );

  const awsLoader = useMemo(() => {
    const init = initialize(workspaceId!, {
      awsCredentials: credentials,
      awsRegion: region,
      tmEndpoint: rociEndpoint,
    });
    const loader = init.s3SceneLoader(sceneId!);

    return loader as SceneLoader;
  }, [awsAccessKeyId, awsSecretAccessKey, awsSessionToken, workspaceId, sceneId]);

  const loader = useMemo(() => {
    switch (source) {
      case 'aws':
        return awsAccessKeyId && awsSecretAccessKey && awsSessionToken && workspaceId && sceneId ? awsLoader : null;
      default:
        return scene ? localLoader : null;
    }
  }, [scene, credentials, workspaceId, sceneId, source]);

  return loader;
};

export default useLoader;
