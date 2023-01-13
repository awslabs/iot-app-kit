import { SceneLoader } from '@iot-app-kit/source-iottwinmaker';
import { useCallback, useMemo } from 'react';

import scenes from '../../scenes';

const useLoader = (source, scene, s3SceneLoader, sceneId) => {
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
    const loader = s3SceneLoader(sceneId!);
    return loader as SceneLoader;
  }, [s3SceneLoader, sceneId]);

  const loader = useMemo(() => {
    switch (source) {
      case 'aws':
        return s3SceneLoader && sceneId ? awsLoader : null;
      default:
        return scene ? localLoader : null;
    }
  }, [scene, s3SceneLoader, sceneId, source]);

  return loader;
};

export default useLoader;
