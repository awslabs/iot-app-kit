import { SceneMetadataModule } from './SceneMetadataModule';
import { createMockSecretsManagerSDK } from '../__mocks__/secretsManagerSDK';
import { createMockTwinMakerSDK } from '../__mocks__/iottwinmakerSDK';
import { KGDataModule } from '../knowledgeGraph-module/KGDataModule';

const getScene = vi.fn();
const updateScene = vi.fn();
const getEntity = vi.fn();
const createEntity = vi.fn();
const updateEntity = vi.fn();
const deleteEntity = vi.fn();
const createScene = vi.fn();
const twinMakerClientMock = createMockTwinMakerSDK({
  getScene,
  updateScene,
  getEntity,
  createEntity,
  updateEntity,
  deleteEntity,
  createScene,
});

const listSecrets = vi.fn();
const secretsManagerClientMock = createMockSecretsManagerSDK({
  listSecrets,
});

const kgModule = new KGDataModule({
  workspaceId: 'ws-id',
  twinMakerClient: twinMakerClientMock,
});
const sceneMetadataModule = new SceneMetadataModule({
  workspaceId: 'ws-id',
  sceneId: 'scene-id',
  twinMakerClient: twinMakerClientMock,
  secretsManagerClient: secretsManagerClientMock,
  kgModule,
});

describe('getSceneInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get expected kgModule', () => {
    expect(sceneMetadataModule.kgModule).toEqual(kgModule);
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
    vi.clearAllMocks();
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
    vi.clearAllMocks();
  });

  it('should get correct list of secrets', async () => {
    listSecrets.mockResolvedValue({
      SecretList: [{ Name: 'dummySecret', ARN: 'dummySecretARN' }],
    });

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

describe('getSceneId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get correct sceneId', async () => {
    const result = await sceneMetadataModule.getSceneId();

    expect(result).toEqual('scene-id');
  });
});

describe('getSceneEntity', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get correct entity', async () => {
    getEntity.mockResolvedValue({ entityId: 'eid' });

    const result = await sceneMetadataModule.getSceneEntity({
      entityId: 'eid',
    });

    expect(result).toEqual({ entityId: 'eid' });
    expect(getEntity).toBeCalledTimes(1);
  });

  it('should get error when API failed', async () => {
    getEntity.mockRejectedValue('TwinMaker API failed');

    try {
      await sceneMetadataModule.getSceneEntity({ entityId: 'eid' });
    } catch (err) {
      expect(err).toEqual('TwinMaker API failed');
      expect(getEntity).toBeCalledTimes(1);
    }
  });
});

describe('createSceneEntity', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call API to create entity successfully', async () => {
    await sceneMetadataModule.createSceneEntity({
      entityId: 'eid',
      entityName: 'ename',
    });

    expect(createEntity).toBeCalledTimes(1);
    expect(createEntity).toBeCalledWith({
      entityId: 'eid',
      entityName: 'ename',
      workspaceId: 'ws-id',
    });
  });

  it('should get error when API failed', async () => {
    getEntity.mockRejectedValue('TwinMaker API failed');

    try {
      await sceneMetadataModule.createSceneEntity({
        entityId: 'eid',
        entityName: 'ename',
      });
    } catch (err) {
      expect(err).toEqual('TwinMaker API failed');
      expect(createEntity).toBeCalledTimes(1);
    }
  });
});

describe('updateSceneEntity', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call API to update entity successfully', async () => {
    await sceneMetadataModule.updateSceneEntity({
      entityId: 'eid',
      componentUpdates: { test: {} },
    });

    expect(updateEntity).toBeCalledTimes(1);
    expect(updateEntity).toBeCalledWith({
      entityId: 'eid',
      componentUpdates: { test: {} },
      workspaceId: 'ws-id',
    });
  });

  it('should get error when API failed', async () => {
    getEntity.mockRejectedValue('TwinMaker API failed');

    try {
      await sceneMetadataModule.updateSceneEntity({ entityId: 'eid' });
    } catch (err) {
      expect(err).toEqual('TwinMaker API failed');
      expect(updateEntity).toBeCalledTimes(1);
    }
  });
});

describe('deleteSceneEntity', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call API to delete entity successfully', async () => {
    await sceneMetadataModule.deleteSceneEntity({ entityId: 'eid' });

    expect(deleteEntity).toBeCalledTimes(1);
    expect(deleteEntity).toBeCalledWith({
      entityId: 'eid',
      workspaceId: 'ws-id',
    });
  });

  it('should get error when API failed', async () => {
    getEntity.mockRejectedValue('TwinMaker API failed');

    try {
      await sceneMetadataModule.deleteSceneEntity({ entityId: 'eid' });
    } catch (err) {
      expect(err).toEqual('TwinMaker API failed');
      expect(deleteEntity).toBeCalledTimes(1);
    }
  });
});

describe('createScene', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call API to create scene successfully', async () => {
    await sceneMetadataModule.createScene({ capabilities: ['DYNAMIC_SCENE'] });
    expect(createScene).toBeCalledTimes(1);
    expect(createScene).toBeCalledWith({
      workspaceId: 'ws-id',
      sceneId: 'scene-id',
      capabilities: ['DYNAMIC_SCENE'],
      contentLocation: undefined,
      sceneMetadata: undefined,
    });
  });

  it('should get error when API failed', async () => {
    createScene.mockRejectedValue('TwinMaker API failed');

    try {
      await sceneMetadataModule.createScene({
        capabilities: ['DYNAMIC_SCENE'],
      });
    } catch (err) {
      expect(err).toEqual('TwinMaker API failed');
      expect(createScene).toBeCalledTimes(1);
    }
  });
});
