import { S3Client } from '@aws-sdk/client-s3';
import { initialize } from './initialize';

/*eslint-disable @typescript-eslint/no-explicit-any */

class MockResponse {
  data: any;

  constructor(data: any) {
    this.data = data;
  }

  arrayBuffer = jest.fn().mockImplementation(() => this.data);
}

global.Response = MockResponse as any;

describe('s3SceneLoader', () => {
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
    const init = initialize('ws-id', { awsCredentials: {} as any, awsRegion: 'us-east-1' });
    const result = await init.s3SceneLoader('scene-id').getSceneObject('s3://bucket/file.json');

    expect(sendSpy).toBeCalledTimes(1);
    expect(cmd).toBeDefined();
    expect(result).toEqual('mock-data');
  });

  it('should not send GetObjectCommand with invalid s3 uri', async () => {
    const init = initialize('ws-id', { awsCredentials: {} as any, awsRegion: 'us-east-1' });
    const result = init.s3SceneLoader('scene-id').getSceneObject('uri');

    expect(result).toBeNull();
    expect(sendSpy).not.toBeCalled();
    expect(cmd).toBeUndefined();
  });
});
