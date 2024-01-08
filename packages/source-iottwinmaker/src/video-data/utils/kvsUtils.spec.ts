import {
  getKVSDataEndpoint,
  getLiveHLSStreamingSessionURL,
  getOnDemandHLSStreamingSessionURL,
} from './kvsUtils';
import {
  mockDataEndpoint,
  mockGetDataEndpointResponse,
  mockKVSStreamName,
  mockLiveGetHLSStreamingSessionURLResponse,
  mockLiveURL,
  mockOnDemandGetHLSStreamingSessionURLResponse,
  mockOnDemandURL,
} from '../../__mocks__/MockVideoPlayerProps';
import { createMockKinesisVideoArchivedMediaSDK } from '../../__mocks__/kinesisVideoArchivedMediaSDK';
import { createMockKinesisVideoSDK } from '../../__mocks__/kinesisVideoSDK';
import {
  GetLiveHLSStreamingSessionURLRequest,
  GetOnDemandHLSStreamingSessionURLRequest,
} from '../types';

describe('KVSUtils for Video Player', () => {
  const getDataEndpoint = jest.fn();
  const kinesisVideoClientMock = createMockKinesisVideoSDK({
    getDataEndpoint,
  });

  const getHLSStreamingSessionURL = jest.fn();
  const kinesisVideoArchivedMediaClientMock =
    createMockKinesisVideoArchivedMediaSDK({
      getHLSStreamingSessionURL,
    });

  it('Get KVS DataEndpoint', async () => {
    getDataEndpoint.mockResolvedValue(mockGetDataEndpointResponse);
    const kvsDataEndpoint = await getKVSDataEndpoint(
      mockKVSStreamName,
      kinesisVideoClientMock
    );
    expect(kvsDataEndpoint).toEqual(mockDataEndpoint);
  });

  it('Get HLSStreamingSessionURL for ON_DEMAND mode', async () => {
    getHLSStreamingSessionURL.mockResolvedValue(
      mockOnDemandGetHLSStreamingSessionURLResponse
    );
    const mockGetOnDemandHLSStreamingSessionURLRequest: GetOnDemandHLSStreamingSessionURLRequest =
      {
        kvsStreamName: mockKVSStreamName,
        kvsDataEndpoint: mockDataEndpoint,
        startTimestamp: new Date(),
        endTimestamp: new Date(),
      };
    const onDemandHLSStreamingSessionURL =
      await getOnDemandHLSStreamingSessionURL(
        mockGetOnDemandHLSStreamingSessionURLRequest,
        kinesisVideoArchivedMediaClientMock
      );
    expect(onDemandHLSStreamingSessionURL).toEqual(mockOnDemandURL);
  });

  it('Get HLSStreamingSessionURL for LIVE mode', async () => {
    getHLSStreamingSessionURL.mockResolvedValue(
      mockLiveGetHLSStreamingSessionURLResponse
    );
    const mockGetLiveHLSStreamingSessionURLRequest: GetLiveHLSStreamingSessionURLRequest =
      {
        kvsStreamName: mockKVSStreamName,
        kvsDataEndpoint: mockDataEndpoint,
      };
    const liveHLSStreamingSessionURL = await getLiveHLSStreamingSessionURL(
      mockGetLiveHLSStreamingSessionURLRequest,
      kinesisVideoArchivedMediaClientMock
    );
    expect(liveHLSStreamingSessionURL).toEqual(mockLiveURL);
  });
});
