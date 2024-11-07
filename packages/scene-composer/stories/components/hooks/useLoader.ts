import { type SceneLoader, type initialize } from '@iot-app-kit/source-iottwinmaker';
import { useCallback, useMemo } from 'react';

import scenes from '../../scenes';
import { useMockedValueDataBindingProvider } from '../../useMockedValueDataBindingProvider';

const useLoader = (
  source: string,
  scene: string,
  dataSource: ReturnType<typeof initialize>,
  sceneId: string | undefined,
) => {
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
    const loader = dataSource.s3SceneLoader(sceneId!);

    return loader as SceneLoader;
  }, [dataSource.s3SceneLoader, sceneId]);

  const loader = useMemo(() => {
    switch (source) {
      case 'aws':
        return awsLoader && sceneId ? awsLoader : null;
      default:
        return scene ? localLoader : null;
    }
  }, [scene, awsLoader, sceneId, source]);

  const awsBindingProvider = useMemo(() => {
    return dataSource.valueDataBindingProviders();
  }, [dataSource]);

  const localBindingProvider = useMockedValueDataBindingProvider();

  const bindingProvider = useMemo(() => {
    switch (source) {
      case 'aws':
        return awsBindingProvider || undefined;
      default:
        return scene ? { TwinMakerEntityProperty: localBindingProvider } : undefined;
    }
  }, [scene, source]);

  return { loader, bindingProvider };
};

export default useLoader;
