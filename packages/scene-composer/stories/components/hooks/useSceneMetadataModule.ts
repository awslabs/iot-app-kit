import { type TwinMakerSceneMetadataModule, type initialize } from '@iot-app-kit/source-iottwinmaker';
import { useMemo } from 'react';

interface SceneMetadataModuleProps {
  source: string;
  scene: string;
  sceneId: string | undefined;
}

const useSceneMetadataModule = (
  sceneMetadatModuleProps: SceneMetadataModuleProps,
  dataSource: ReturnType<typeof initialize>,
): TwinMakerSceneMetadataModule | undefined => {
  const awsSceneMetadataModule = useMemo(() => {
    const sceneMetadataModule = dataSource.sceneMetadataModule(sceneMetadatModuleProps.sceneId!);

    return sceneMetadataModule as TwinMakerSceneMetadataModule;
  }, [sceneMetadatModuleProps]);

  const sceneMetadataModule = useMemo(() => {
    switch (sceneMetadatModuleProps.source) {
      case 'aws':
        return awsSceneMetadataModule || undefined;
      default:
        return undefined;
    }
  }, [sceneMetadatModuleProps.sceneId, sceneMetadatModuleProps.source]);

  return sceneMetadataModule;
};

export default useSceneMetadataModule;
