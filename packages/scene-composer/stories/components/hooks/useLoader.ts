import { SceneLoader, initialize } from '@iot-app-kit/source-iottwinmaker';
import { useCallback, useMemo } from 'react';

import scenes from '../../scenes';

const useLoader = (source, scene, awsCredentials, region, workspaceId, sceneId) => {
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
    const init = initialize(workspaceId!, {
      awsCredentials: awsCredentials,
      awsRegion: region,
    });
    const loader = init.s3SceneLoader(sceneId!);

    return loader as SceneLoader;
  }, [awsCredentials, workspaceId, region, sceneId]);

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
