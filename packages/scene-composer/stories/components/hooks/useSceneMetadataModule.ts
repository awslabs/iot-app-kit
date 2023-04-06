import { CredentialProvider, Credentials } from '@aws-sdk/types';
import { TwinMakerSceneMetadataModule, initialize } from '@iot-app-kit/source-iottwinmaker';
import { useMemo } from 'react';

const region = 'us-east-1';
// const rociEndpoint = 'https://iottwinmaker.us-east-1.amazonaws.com';
const rociEndpoint = 'https://gamma.us-east-1.twinmaker.iot.aws.dev';

interface SceneMetadataModuleProps {
  source: string;
  scene: string;
  awsCredentials?: Credentials | CredentialProvider;
  workspaceId: string | undefined;
  sceneId: string | undefined;
}

const useSceneMetadataModule = (
  sceneMetadatModuleProps: SceneMetadataModuleProps,
): TwinMakerSceneMetadataModule | undefined => {
  const awsSceneMetadataModule = useMemo(() => {
    if (!sceneMetadatModuleProps.awsCredentials) return undefined;

    const init = initialize(sceneMetadatModuleProps.workspaceId!, {
      awsCredentials: sceneMetadatModuleProps.awsCredentials,
      awsRegion: region,
      tmEndpoint: rociEndpoint,
    });
    const sceneMetadataModule = init.sceneMetadataModule(sceneMetadatModuleProps.sceneId!);

    return sceneMetadataModule as TwinMakerSceneMetadataModule;
  }, [sceneMetadatModuleProps]);

  const sceneMetadataModule = useMemo(() => {
    switch (sceneMetadatModuleProps.source) {
      case 'aws':
        return sceneMetadatModuleProps.awsCredentials &&
          sceneMetadatModuleProps.workspaceId &&
          sceneMetadatModuleProps.sceneId
          ? awsSceneMetadataModule
          : undefined;
      default:
        return undefined;
    }
  }, [sceneMetadatModuleProps]);

  return sceneMetadataModule;
};

export default useSceneMetadataModule;
