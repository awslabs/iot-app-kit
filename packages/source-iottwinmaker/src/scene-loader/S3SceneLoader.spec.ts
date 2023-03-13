jest.mock('../utils/s3Utils', () => {
  const originalModule = jest.requireActual('../utils/s3Utils');

  return {
    __esModule: true,
    ...originalModule,
    parseS3BucketFromArn: <T>(x: T) => x,
    parseS3RelativeScenePathFromURI: <T>(x: T) => x,
  };
});

import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { S3Client } from '@aws-sdk/client-s3';
import { S3SceneLoader } from './S3SceneLoader';
import * as S3Utils from '../utils/s3Utils';

/*eslint-disable @typescript-eslint/no-explicit-any */

class MockResponse {
  data: any;

  constructor(data: any) {
    this.data = data;
  }

  arrayBuffer = jest.fn().mockImplementation(() => this.data);
}

global.Response = MockResponse as any;

const loader = new S3SceneLoader({
  workspaceId: 'ws-id',
  sceneId: 'scene-id',
  twinMakerClient: new IoTTwinMakerClient({}),
  s3Client: new S3Client({}),
});

describe('getSceneUri', () => {
  beforeEach(() => {
    jest.spyOn(S3Utils, 'parseS3BucketFromArn').mockImplementation((input) => input);
    jest.spyOn(S3Utils, 'parseS3RelativeScenePathFromURI').mockImplementation((input) => input);

    jest.clearAllMocks();
  });

  it('should get correct scene url', async () => {
    const sendSpy = jest.spyOn(IoTTwinMakerClient.prototype, 'send').mockImplementation(() => {
      return Promise.resolve({ contentLocation: 'mock-contentLocation', s3Location: 'mock-s3Location' });
    });

    const expected = 's3://mock-s3Location/mock-contentLocation';
    const result = await loader.getSceneUri();

    expect(sendSpy).toBeCalledTimes(2);
    expect(result).toEqual(expected);
  });

  it('should get null when missing data', async () => {
    const sendSpy = jest.spyOn(IoTTwinMakerClient.prototype, 'send').mockImplementation(() => {
      return Promise.resolve({ contentLocation: 'mock-contentLocation' });
    });

    const result = await loader.getSceneUri();

    expect(sendSpy).toBeCalledTimes(2);
    expect(result).toBeNull();
  });

  it('should get error when API failed', async () => {
    const sendSpy = jest.spyOn(IoTTwinMakerClient.prototype, 'send').mockImplementation(() => {
      throw 'API failed';
    });

    let error;
    try {
      await loader.getSceneUri();
    } catch (e) {
      error = e;
    }

    expect(sendSpy).toBeCalled();
    expect(error).toEqual('API failed');
  });
});

describe('getSceneObject', () => {
  let cmd: any;
  let sendSpy: any;

  beforeEach(() => {
    cmd = undefined;
    sendSpy = jest.spyOn(S3Client.prototype, 'send').mockImplementation((c) => {
      cmd = c;
      return Promise.resolve({ Body: 'mock-data' });
    });

    jest.clearAllMocks();
  });

  it('should send GetObjectCommand with valid s3 uri', async () => {
    const result = await loader.getSceneObject('s3://bucket/file.json');

    expect(sendSpy).toBeCalledTimes(1);
    expect(cmd).toBeDefined();
    expect(result).toEqual('mock-data');
  });

  it('should not send GetObjectCommand with invalid s3 uri', async () => {
    const result = loader.getSceneObject('uri');

    expect(result).toBeNull();
    expect(sendSpy).not.toBeCalled();
    expect(cmd).toBeUndefined();
  });
});
