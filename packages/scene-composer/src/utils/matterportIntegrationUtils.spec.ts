import { useIntl } from 'react-intl';
import { type TwinMakerSceneMetadataModule } from '@iot-app-kit/source-iottwinmaker';

import { OPTIONS_PLACEHOLDER_VALUE } from '../common/internalConstants';
import { SceneCapabilities, SceneMetadataMapKeys } from '../common/sceneModelConstants';

import { getMatterportConnectionList, getUpdatedSceneInfoForConnection } from './matterportIntegrationUtils';

describe('matterportIntegrationUtils', () => {
  const intl = useIntl();
  const MOCK_CONNECTION_NAME = 'mockConnectionName';
  const MOCK_ARN = 'mockARN';
  const MOCK_CAPABILITY = 'mockCapability';
  const getSceneInfo = jest.fn();
  const updateSceneInfo = jest.fn();
  const get3pConnectionList = jest.fn();
  const mockSceneMetadataModule: Partial<TwinMakerSceneMetadataModule> = {
    getSceneInfo,
    updateSceneInfo,
    get3pConnectionList,
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return default option when SceneMetadataModule is not defined', async () => {
    const connectionList = await getMatterportConnectionList(intl);
    expect(connectionList).toEqual([
      {
        label: 'Select a connection',
        value: OPTIONS_PLACEHOLDER_VALUE,
      },
    ]);
  });

  it('should return valid list when SceneMetadataModule is defined', async () => {
    get3pConnectionList.mockResolvedValue([{ Name: MOCK_CONNECTION_NAME, ARN: MOCK_ARN }]);
    const connectionList = await getMatterportConnectionList(
      intl,
      mockSceneMetadataModule as TwinMakerSceneMetadataModule,
    );
    expect(connectionList).toEqual([
      {
        label: 'Select a connection',
        value: OPTIONS_PLACEHOLDER_VALUE,
      },
      {
        label: MOCK_CONNECTION_NAME,
        value: MOCK_ARN,
      },
    ]);
  });

  it('should remove Matterport config when connection is cleared', async () => {
    getSceneInfo.mockResolvedValue({
      capabilities: [SceneCapabilities.MATTERPORT],
      sceneMetadata: { [SceneMetadataMapKeys.MATTERPORT_SECRET_ARN]: MOCK_ARN },
    });
    const updatedSceneInfo = await getUpdatedSceneInfoForConnection(
      OPTIONS_PLACEHOLDER_VALUE,
      mockSceneMetadataModule as TwinMakerSceneMetadataModule,
    );
    expect(updatedSceneInfo).toEqual({ capabilities: [], sceneMetadata: {} });
  });

  it('should remove Matterport config when connection is cleared leaving other settings', async () => {
    getSceneInfo.mockResolvedValue({
      capabilities: [SceneCapabilities.MATTERPORT, MOCK_CAPABILITY],
      sceneMetadata: { [SceneMetadataMapKeys.MATTERPORT_SECRET_ARN]: MOCK_ARN },
    });
    const updatedSceneInfo = await getUpdatedSceneInfoForConnection(
      OPTIONS_PLACEHOLDER_VALUE,
      mockSceneMetadataModule as TwinMakerSceneMetadataModule,
    );
    expect(updatedSceneInfo).toEqual({ capabilities: [MOCK_CAPABILITY], sceneMetadata: {} });
  });

  it('should add Matterport config when a valid connection is selected', async () => {
    getSceneInfo.mockResolvedValue({
      capabilities: [],
      sceneMetadata: {},
    });
    const updatedSceneInfo = await getUpdatedSceneInfoForConnection(
      MOCK_ARN,
      mockSceneMetadataModule as TwinMakerSceneMetadataModule,
    );
    expect(updatedSceneInfo).toEqual({
      capabilities: [SceneCapabilities.MATTERPORT],
      sceneMetadata: { [SceneMetadataMapKeys.MATTERPORT_SECRET_ARN]: MOCK_ARN },
    });
  });

  it('should update connection ARN when connection changed for Matterport scene', async () => {
    getSceneInfo.mockResolvedValue({
      capabilities: [SceneCapabilities.MATTERPORT],
      sceneMetadata: { [SceneMetadataMapKeys.MATTERPORT_SECRET_ARN]: MOCK_ARN },
    });
    const updatedSceneInfo = await getUpdatedSceneInfoForConnection(
      'new-ARN',
      mockSceneMetadataModule as TwinMakerSceneMetadataModule,
    );
    expect(updatedSceneInfo).toEqual({
      capabilities: [SceneCapabilities.MATTERPORT],
      sceneMetadata: { [SceneMetadataMapKeys.MATTERPORT_SECRET_ARN]: 'new-ARN' },
    });
  });
});
