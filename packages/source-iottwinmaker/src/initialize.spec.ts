import { Credentials } from '@aws-sdk/types';

import { initialize } from './initialize';

describe('initialize', () => {
  it('should return S3SceneLoader', async () => {
    const init = initialize('ws-id', { awsCredentials: {} as Credentials, awsRegion: 'us-east-1' });
    const result = init.s3SceneLoader('scene-id');

    expect(result).toBeDefined();
    expect(result['workspaceId']).toEqual('ws-id');
    expect(result['sceneId']).toEqual('scene-id');
  });
});
