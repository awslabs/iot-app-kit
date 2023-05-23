import { SceneLoader, initialize } from '@iot-app-kit/source-iottwinmaker';
import { useCallback, useMemo } from 'react';

import scenes from '../../scenes';

const region = 'us-east-1';
const rociEndpoint = 'https://iottwinmaker.us-east-1.amazonaws.com';
// const rociEndpoint = 'https://gamma.us-east-1.twinmaker.iot.aws.dev';

const useLoader = (source, scene, awsCredentials, workspaceId, sceneId) => {
  const getSceneObject = useCallback((uri: string) => {
    if (!Object.values(scenes).includes(uri)) {
      return null;
    }
    return fetch(uri).then((res) => res.arrayBuffer());
  }, []);

  const localLoader = useMemo(
    () =>
      ([{
        getSceneUri: () => {
          if (Object.keys(scenes).includes(scene)) {
            return Promise.resolve(scenes[scene]);
          }
          return null;
        },
        getSceneObject,
      } as SceneLoader, (binding) => binding]),
    [scene],
  );

  const awsLoader = useMemo(() => {
    const init = initialize(workspaceId!, {
      awsCredentials: awsCredentials,
      awsRegion: region,
      tmEndpoint: rociEndpoint,
    });
    const loader = init.s3SceneLoader(sceneId!);

    const createQuery = (dataBindingContext) => {
      return init.query.timeSeriesData({ entityId: dataBindingContext.entityId, componentName: dataBindingContext.componentName, properties: [{propertyName: dataBindingContext.propertyName}]})
    }
    return [loader as SceneLoader, createQuery];
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
