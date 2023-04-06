import { TwinMakerSceneMetadataModule } from '@iot-app-kit/source-iottwinmaker';
import { IntlShape } from 'react-intl';

import {
  MATTERPORT_SECRET_ARN,
  OPTIONS_PLACEHOLDER_VALUE,
  SCENE_CAPABILITY_MATTERPORT,
  SECRET_MANAGER_MATTERPORT_TAG,
} from '../common/constants';

export const getMatterportConnectionList = async (
  intl: IntlShape,
  twinMakerSceneMetadataModule?: TwinMakerSceneMetadataModule,
): Promise<{ label: string; value: string }[]> => {
  const connectionList: { label: string; value: string }[] = [
    {
      label: intl.formatMessage({
        defaultMessage: 'Select a connection',
        description: 'Select a connection placeholder',
      }),
      value: OPTIONS_PLACEHOLDER_VALUE,
    },
  ];
  if (twinMakerSceneMetadataModule) {
    const response = await twinMakerSceneMetadataModule.get3pConnectionList(SECRET_MANAGER_MATTERPORT_TAG);
    if (response) {
      response.forEach((secret) => {
        if (secret.Name && secret.ARN) {
          connectionList.push({ label: secret.Name, value: secret.ARN });
        }
      });
    }
  }
  return connectionList;
};

export const getUpdatedSceneInfoForConnection = async (
  connection: string,
  twinMakerSceneMetadataModule: TwinMakerSceneMetadataModule,
): Promise<{
  capabilities: string[] | undefined;
  sceneMetadata: Record<string, string> | undefined;
}> => {
  let sceneCapabilities: string[] | undefined;
  let sceneMetadata: Record<string, string> | undefined;
  const getSceneResponse = await twinMakerSceneMetadataModule.getSceneInfo();
  if (getSceneResponse) {
    sceneCapabilities = getSceneResponse.capabilities;
    sceneMetadata = getSceneResponse.sceneMetadata;
  }

  if (connection === OPTIONS_PLACEHOLDER_VALUE) {
    if (sceneCapabilities && sceneCapabilities.includes(SCENE_CAPABILITY_MATTERPORT)) {
      sceneCapabilities = sceneCapabilities.filter((capability) => capability !== SCENE_CAPABILITY_MATTERPORT);
    }

    if (sceneMetadata && sceneMetadata[MATTERPORT_SECRET_ARN]) {
      delete sceneMetadata[MATTERPORT_SECRET_ARN];
    }
  } else {
    if (!sceneCapabilities) {
      sceneCapabilities = [];
    }
    if (!sceneCapabilities.includes(SCENE_CAPABILITY_MATTERPORT)) {
      sceneCapabilities.push(SCENE_CAPABILITY_MATTERPORT);
    }

    if (!sceneMetadata) {
      sceneMetadata = {};
    }
    sceneMetadata[MATTERPORT_SECRET_ARN] = connection;
  }

  return { capabilities: sceneCapabilities, sceneMetadata: sceneMetadata };
};
