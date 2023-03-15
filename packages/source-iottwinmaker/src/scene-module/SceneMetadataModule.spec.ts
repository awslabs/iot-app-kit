import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { SceneMetadataModule } from './SceneMetadataModule';
import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

/*eslint-disable @typescript-eslint/no-explicit-any */

class MockResponse {
  data: any;

  constructor(data: any) {
    this.data = data;
  }

  arrayBuffer = jest.fn().mockImplementation(() => this.data);
}

global.Response = MockResponse as any;

const sceneMetadataModule = new SceneMetadataModule({
  workspaceId: 'ws-id',
  sceneId: 'scene-id',
  twinMakerClient: new IoTTwinMakerClient({}),
  secretsManagerClient: new SecretsManagerClient({}),
});

describe('getSceneInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get a valid scene info', async () => {
    const sendSpy = jest.spyOn(IoTTwinMakerClient.prototype, 'send').mockImplementation(() => {
      return Promise.resolve({ contentLocation: 'mock-contentLocation', s3Location: 'mock-s3Location', "capabilities": ["MATTERPORT"] });
    });

    const expected = { contentLocation: 'mock-contentLocation', s3Location: 'mock-s3Location', "capabilities": ["MATTERPORT"] };
    const result = await sceneMetadataModule.getSceneInfo();

    expect(sendSpy).toBeCalledTimes(1);
    expect(result).toEqual(expected);
  });

  it('should get error when API failed', async () => {
    const sendSpy = jest.spyOn(IoTTwinMakerClient.prototype, 'send').mockImplementation(() => {
      throw 'TwinMaker API failed';
    });

    let error: any;
    try {
      await sceneMetadataModule.getSceneInfo();
    } catch (e) {
      error = e;
    }

    expect(sendSpy).toBeCalled();
    expect(error).toEqual('TwinMaker API failed');
  });
});

describe('updateScene', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update the scene', async () => {
    const sendSpy = jest.spyOn(IoTTwinMakerClient.prototype, 'send').mockImplementation(() => {
      return Promise.resolve();
    });

    await sceneMetadataModule.updateScene(['MATTERPORT'], { MATTERPORT_SECRET_ARN: 'dummySecretARN'});

    expect(sendSpy).toBeCalledTimes(1);
  });

  it('should get error when API failed', async () => {
    const sendSpy = jest.spyOn(IoTTwinMakerClient.prototype, 'send').mockImplementation(() => {
      throw 'TwinMaker API failed';
    });

    let error: any;
    try {
      await sceneMetadataModule.updateScene(['MATTERPORT'], { MATTERPORT_SECRET_ARN: 'dummySecretARN'});
    } catch (e) {
      error = e;
    }

    expect(sendSpy).toBeCalled();
    expect(error).toEqual('TwinMaker API failed');
  });
});

describe('get3pConnectionList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get correct list of secrets', async () => {
    const sendSpy = jest.spyOn(SecretsManagerClient.prototype, 'send').mockImplementation(() => {
      return Promise.resolve({ SecretList: [ { Name: 'dummySecret', ARN: 'dummySecretARN'} ] });
    });

    const expected = [ { Name: 'dummySecret', ARN: 'dummySecretARN'} ];
    const result = await sceneMetadataModule.get3pConnectionList('dummayTag');

    expect(sendSpy).toBeCalledTimes(1);
    expect(result).toEqual(expected);
  });

  it('should get error when API failed', async () => {
    const sendSpy = jest.spyOn(SecretsManagerClient.prototype, 'send').mockImplementation(() => {
      throw 'Secrets Manager  API failed';
    });

    let error: any;
    try {
      await sceneMetadataModule.get3pConnectionList('dummyTag');
    } catch (e) {
      error = e;
    }

    expect(sendSpy).toBeCalled();
    expect(error).toEqual('Secrets Manager  API failed');
  });
});
