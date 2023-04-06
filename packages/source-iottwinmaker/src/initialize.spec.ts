import { initialize } from './initialize';
import { TwinMakerTimeSeriesDataProvider } from './time-series-data/provider';
import type { Credentials } from '@aws-sdk/types';
import { createMockSiteWiseSDK } from './__mocks__/iotsitewiseSDK';
import { createMockTwinMakerSDK } from './__mocks__/iottwinmakerSDK';
import { createMockKinesisVideoArchivedMediaSDK } from './__mocks__/kinesisVideoArchivedMediaSDK';
import { createMockKinesisVideoSDK } from './__mocks__/kinesisVideoSDK';
import { createMockSecretsManagerSDK } from './__mocks__/secretsManagerSDK';

describe('initialize', () => {
  it('should return timeSeries query data provider', async () => {
    const init = initialize('ws-id', { awsCredentials: {} as Credentials, awsRegion: 'us-east-1' });
    const query = { entityId: 'entity-1', componentName: 'comp-1', properties: [{ propertyName: 'prop-1' }] };
    const params = { settings: { fetchFromStartToEnd: true }, viewport: { start: new Date(), end: new Date() } };
    const provider = init.query.timeSeriesData(query).build('random', params) as TwinMakerTimeSeriesDataProvider;

    expect(provider.input).toEqual({
      queries: [
        {
          workspaceId: 'ws-id',
          ...query,
        },
      ],
      request: params,
    });
    expect(provider.subscribe).toBeFunction();
    expect(provider.unsubscribe).toBeFunction();
    expect(provider.updateViewport).toBeFunction();
  });

  it('should return S3SceneLoader', async () => {
    const init = initialize('ws-id', { awsCredentials: {} as Credentials, awsRegion: 'us-east-1' });
    const result = init.s3SceneLoader('scene-id');

    expect(result).toBeDefined();
    expect(result['workspaceId']).toEqual('ws-id');
    expect(result['sceneId']).toEqual('scene-id');
  });

  it('should return sceneMetadataModule', async () => {
    const init = initialize('ws-id', {
      awsCredentials: {} as Credentials,
      awsRegion: 'us-east-1',
      iotTwinMakerClient: createMockTwinMakerSDK({}),
      iotSiteWiseClient: createMockSiteWiseSDK({}),
      kinesisVideoClient: createMockKinesisVideoSDK({}),
      kinesisVideoArchivedMediaClient: createMockKinesisVideoArchivedMediaSDK({}),
      secretsManagerClient: createMockSecretsManagerSDK({}),
    });
    const result = init.sceneMetadataModule('scene-id');

    expect(result).toBeDefined();
    expect(result['workspaceId']).toEqual('ws-id');
    expect(result['sceneId']).toEqual('scene-id');
  });

  it('should return VideoData', async () => {
    const init = initialize('ws-id', { awsCredentials: {} as Credentials, awsRegion: 'us-east-1' });
    const result = init.videoData({ kvsStreamName: 'kvs-stream-name' });

    expect(result).toBeDefined();
    expect(result['workspaceId']).toEqual('ws-id');
    expect(result['kvsStreamName']).toEqual('kvs-stream-name');
  });

  it('converts a time series data query to string with contents that uniquely represent the query', () => {
    const { query } = initialize('ws-id', { awsCredentials: {} as Credentials, awsRegion: 'us-east-1' });
    const timeSeriesDataQuery = query.timeSeriesData({
      entityId: 'entity-1',
      componentName: 'comp-1',
      properties: [{ propertyName: 'prop-1' }],
    });

    expect(timeSeriesDataQuery.toQueryString()).toMatchInlineSnapshot(
      `"{"source":"iottwinmaker","queryType":"time-series-data","query":{"entityId":"entity-1","componentName":"comp-1","properties":[{"propertyName":"prop-1"}]}}"`
    );
  });
});
