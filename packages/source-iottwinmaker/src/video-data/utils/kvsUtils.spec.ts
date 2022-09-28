import { mockClient } from 'aws-sdk-client-mock';
import { GetDataEndpointCommand, KinesisVideoClient } from '@aws-sdk/client-kinesis-video';
import {
  GetHLSStreamingSessionURLCommand,
  KinesisVideoArchivedMediaClient,
} from '@aws-sdk/client-kinesis-video-archived-media';
import { getKVSDataEndpoint, getLiveHLSStreamingSessionURL, getOnDemandHLSStreamingSessionURL } from './kvsUtils';
import {
  mockAWSCredentials,
  mockDataEndpoint,
  mockGetDataEndpointResponse,
  mockKVSStreamName,
  mockLiveGetHLSStreamingSessionURLResponse,
  mockLiveURL,
  mockOnDemandGetHLSStreamingSessionURLResponse,
  mockOnDemandURL,
} from '../../__mocks__/MockVideoPlayerProps';
import { GetLiveHLSStreamingSessionURLRequest, GetOnDemandHLSStreamingSessionURLRequest } from '../types';

describe('KVSUtils for Video Player', () => {
  const kinesisVideoClient = new KinesisVideoClient({
    ...{
      region: 'abc',
    },
    credentials: mockAWSCredentials,
  });
  const kinesisVideoClientMock = mockClient(kinesisVideoClient);

  const kinesisVideoArchivedMediaClient = new KinesisVideoArchivedMediaClient({
    ...{
      region: 'abc',
    },
    credentials: mockAWSCredentials,
  });
  const kinesisVideoArchivedMediaClientMock = mockClient(kinesisVideoArchivedMediaClient);

  it('Get KVS DataEndpoint', async () => {
    kinesisVideoClientMock.on(GetDataEndpointCommand).resolves(mockGetDataEndpointResponse);
    const kvsDataEndpoint = await getKVSDataEndpoint(mockKVSStreamName, kinesisVideoClient);
    expect(kvsDataEndpoint).toEqual(mockDataEndpoint);
  });

  it('Get HLSStreamingSessionURL for ON_DEMAND mode', async () => {
    kinesisVideoArchivedMediaClientMock
      .on(GetHLSStreamingSessionURLCommand)
      .resolves(mockOnDemandGetHLSStreamingSessionURLResponse);
    const mockGetOnDemandHLSStreamingSessionURLRequest: GetOnDemandHLSStreamingSessionURLRequest = {
      kvsStreamName: mockKVSStreamName,
      kvsDataEndpoint: mockDataEndpoint,
      startTimestamp: new Date(),
      endTimestamp: new Date(),
    };
    const onDemandHLSStreamingSessionURL = await getOnDemandHLSStreamingSessionURL(
      mockGetOnDemandHLSStreamingSessionURLRequest,
      kinesisVideoArchivedMediaClient
    );
    expect(onDemandHLSStreamingSessionURL).toEqual(mockOnDemandURL);
  });

  it('Get HLSStreamingSessionURL for LIVE mode', async () => {
    kinesisVideoArchivedMediaClientMock
      .on(GetHLSStreamingSessionURLCommand)
      .resolves(mockLiveGetHLSStreamingSessionURLResponse);
    const mockGetLiveHLSStreamingSessionURLRequest: GetLiveHLSStreamingSessionURLRequest = {
      kvsStreamName: mockKVSStreamName,
      kvsDataEndpoint: mockDataEndpoint,
    };
    const liveHLSStreamingSessionURL = await getLiveHLSStreamingSessionURL(
      mockGetLiveHLSStreamingSessionURLRequest,
      kinesisVideoArchivedMediaClient
    );
    expect(liveHLSStreamingSessionURL).toEqual(mockLiveURL);
  });
});
