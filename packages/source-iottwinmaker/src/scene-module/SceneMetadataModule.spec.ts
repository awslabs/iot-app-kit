import { SceneMetadataModule } from './SceneMetadataModule';
import { createMockSecretsManagerSDK } from '../__mocks__/secretsManagerSDK';
import { createMockTwinMakerSDK } from '../__mocks__/iottwinmakerSDK';

const getScene = jest.fn();
const updateScene = jest.fn();
const twinMakerClientMock = createMockTwinMakerSDK({
  getScene,
  updateScene,
});

const listSecrets = jest.fn();
const secretsManagerClientMock = createMockSecretsManagerSDK({
  listSecrets,
});

const sceneMetadataModule = new SceneMetadataModule({
  workspaceId: 'ws-id',
  sceneId: 'scene-id',
  twinMakerClient: twinMakerClientMock,
  secretsManagerClient: secretsManagerClientMock,
});

describe('getSceneInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get a valid scene info', async () => {
    getScene.mockResolvedValue({
      contentLocation: 'mock-contentLocation',
      s3Location: 'mock-s3Location',
      capabilities: ['MATTERPORT'],
    });

    const expected = {
      contentLocation: 'mock-contentLocation',
      s3Location: 'mock-s3Location',
      capabilities: ['MATTERPORT'],
    };
    const result = await sceneMetadataModule.getSceneInfo();

    expect(getScene).toBeCalledTimes(1);
    expect(result).toEqual(expected);
  });

  it('should get error when API failed', async () => {
    getScene.mockRejectedValue('TwinMaker API failed');

    try {
      await sceneMetadataModule.getSceneInfo();
    } catch (err) {
      expect(err).toEqual('TwinMaker API failed');
      expect(getScene).toBeCalledTimes(1);
    }
  });
});

describe('updateScene', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update the scene', async () => {
    updateScene.mockResolvedValue({ updateDateTime: new Date() });

    await sceneMetadataModule.updateSceneInfo({
      capabilities: ['MATTERPORT'],
      sceneMetadata: { MATTERPORT_SECRET_ARN: 'dummySecretARN' },
    });

    expect(updateScene).toBeCalledTimes(1);
  });

  it('should get error when API failed', async () => {
    updateScene.mockRejectedValue('TwinMaker API failed');

    try {
      await sceneMetadataModule.updateSceneInfo({
        capabilities: ['MATTERPORT'],
        sceneMetadata: { MATTERPORT_SECRET_ARN: 'dummySecretARN' },
      });
    } catch (err) {
      expect(err).toEqual('TwinMaker API failed');
      expect(updateScene).toBeCalledTimes(1);
    }
  });
});

describe('get3pConnectionList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get correct list of secrets', async () => {
    listSecrets.mockResolvedValue({ SecretList: [{ Name: 'dummySecret', ARN: 'dummySecretARN' }] });

    const expected = [{ Name: 'dummySecret', ARN: 'dummySecretARN' }];
    const result = await sceneMetadataModule.get3pConnectionList('dummayTag');

    expect(listSecrets).toBeCalledTimes(1);
    expect(result).toEqual(expected);
  });

  it('should get error when API failed', async () => {
    listSecrets.mockRejectedValue('Secrets Manager  API failed');

    try {
      await sceneMetadataModule.get3pConnectionList('dummyTag');
    } catch (err) {
      expect(err).toEqual('Secrets Manager  API failed');
      expect(listSecrets).toBeCalledTimes(1);
    }
  });
});
