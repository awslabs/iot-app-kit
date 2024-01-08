import { VideoDataImpl } from './VideoData';
import {
  batchPutAssetPropertyResponse,
  mockCachedVideoAgeOutOnEdge,
  mockComponentName,
  mockEdgeVideoEntity,
  mockEntityId,
  mockGetAssetPropertyValueResponse,
  mockGetAvailableTimeRangeResponse,
  mockGetDataEndpointResponse,
  mockGetInterpolatedAssetPropertyValuesResponse,
  mockKVSEntity,
  mockKVSStreamName,
  mockLiveGetHLSStreamingSessionURLResponse,
  mockLiveURL,
  mockOnDemandGetHLSStreamingSessionURLResponse,
  mockOnDemandURL,
  mockSitewiseAssetId,
  mockVideoUploadedTimeRange,
  mockVideoUploadRequestPropertyId,
  mockWorkspaceId,
} from '../__mocks__/MockVideoPlayerProps';
import { PLAYBACKMODE_LIVE, PLAYBACKMODE_ON_DEMAND } from './constants';
import { VideoDataInput } from './types';
import { createMockKinesisVideoSDK } from '../__mocks__/kinesisVideoSDK';
import { createMockKinesisVideoArchivedMediaSDK } from '../__mocks__/kinesisVideoArchivedMediaSDK';
import { createMockTwinMakerSDK } from '../__mocks__/iottwinmakerSDK';
import { createMockSiteWiseSDK } from '../__mocks__/iotsitewiseSDK';

describe('Test VideoData class', () => {
  const getDataEndpoint = jest.fn();
  const kinesisVideoClientMock = createMockKinesisVideoSDK({
    getDataEndpoint,
  });

  const getHLSStreamingSessionURL = jest.fn();
  const kinesisVideoArchivedMediaClientMock =
    createMockKinesisVideoArchivedMediaSDK({
      getHLSStreamingSessionURL,
    });

  const batchPutAssetPropertyValue = jest.fn();
  const getAssetPropertyValue = jest.fn();
  const getInterpolatedAssetPropertyValues = jest.fn();
  const siteWiseClientMock = createMockSiteWiseSDK({
    batchPutAssetPropertyValue,
    getAssetPropertyValue,
    getInterpolatedAssetPropertyValues,
  });

  const getEntity = jest.fn();
  const getPropertyValueHistory = jest.fn();
  const twinMakerClientMock = createMockTwinMakerSDK({
    getEntity,
    getPropertyValueHistory,
  });

  const videoDataInput: VideoDataInput = {
    workspaceId: mockWorkspaceId,
    entityId: mockEntityId,
    componentName: mockComponentName,
    kinesisVideoClient: kinesisVideoClientMock,
    kinesisVideoArchivedMediaClient: kinesisVideoArchivedMediaClientMock,
    siteWiseClient: siteWiseClientMock,
    twinMakerClient: twinMakerClientMock,
    sitewiseAssetId: mockSitewiseAssetId,
    videoUploadRequestPropertyId: mockVideoUploadRequestPropertyId,
  };
  const videoData = new VideoDataImpl(videoDataInput);

  const videoDataInputSimpleMode: VideoDataInput = {
    kvsStreamName: mockKVSStreamName,
    kinesisVideoClient: kinesisVideoClientMock,
    kinesisVideoArchivedMediaClient: kinesisVideoArchivedMediaClientMock,
    siteWiseClient: siteWiseClientMock,
    twinMakerClient: twinMakerClientMock,
    sitewiseAssetId: mockSitewiseAssetId,
    videoUploadRequestPropertyId: mockVideoUploadRequestPropertyId,
  };
  const videoDataSimpleMode = new VideoDataImpl(videoDataInputSimpleMode);

  beforeEach(() => {
    jest.clearAllMocks();

    getDataEndpoint.mockResolvedValue(mockGetDataEndpointResponse);
    batchPutAssetPropertyValue.mockResolvedValue(batchPutAssetPropertyResponse);
    getAssetPropertyValue.mockResolvedValue(mockGetAssetPropertyValueResponse);
  });

  it('Test successful triggerLiveVideoUpload()', async () => {
    expect(() => videoDataSimpleMode.triggerLiveVideoUpload()).not.toThrow();
  });

  it('Test successful triggerOnDemandVideoUploadRequest()', async () => {
    expect(() =>
      videoDataSimpleMode.triggerOnDemandVideoUploadRequest(
        new Date().toISOString(),
        new Date().toISOString()
      )
    ).not.toThrow();
  });

  it('Fetch KVS stream source for LIVE playback - Simple Mode', async () => {
    getHLSStreamingSessionURL.mockResolvedValue(
      mockLiveGetHLSStreamingSessionURLResponse
    );
    const response = await videoDataSimpleMode.getKvsStreamSrc(
      PLAYBACKMODE_LIVE
    );
    expect(response).toEqual(mockLiveURL);
  });

  it('Fetch KVS stream source for ON_DEMAND playback - Simple Mode', async () => {
    getHLSStreamingSessionURL.mockResolvedValue(
      mockOnDemandGetHLSStreamingSessionURLResponse
    );
    const response = await videoDataSimpleMode.getKvsStreamSrc(
      PLAYBACKMODE_ON_DEMAND
    );
    expect(response).toEqual(mockOnDemandURL);
  });

  it('Fetch KVS stream source for LIVE playback - EdgeVideo Component', async () => {
    getHLSStreamingSessionURL.mockResolvedValue(
      mockLiveGetHLSStreamingSessionURLResponse
    );
    getEntity.mockResolvedValue(mockEdgeVideoEntity);
    const response = await videoData.getKvsStreamSrc(PLAYBACKMODE_LIVE);
    expect(response).toEqual(mockLiveURL);
  });

  it('Fetch KVS stream source for ON_DEMAND playback - EdgeVideo Component', async () => {
    getHLSStreamingSessionURL.mockResolvedValue(
      mockOnDemandGetHLSStreamingSessionURLResponse
    );
    getEntity.mockResolvedValue(mockEdgeVideoEntity);
    const response = await videoData.getKvsStreamSrc(PLAYBACKMODE_ON_DEMAND);
    expect(response).toEqual(mockOnDemandURL);
  });

  it('Fetch KVS stream source for LIVE playback - KVS Component', async () => {
    getHLSStreamingSessionURL.mockResolvedValue(
      mockLiveGetHLSStreamingSessionURLResponse
    );
    getEntity.mockResolvedValue(mockKVSEntity);
    const response = await videoData.getKvsStreamSrc(PLAYBACKMODE_LIVE);
    expect(response).toEqual(mockLiveURL);
  });

  it('Fetch KVS stream source for ON_DEMAND playback - KVS Component', async () => {
    getHLSStreamingSessionURL.mockResolvedValue(
      mockOnDemandGetHLSStreamingSessionURLResponse
    );
    getEntity.mockResolvedValue(mockKVSEntity);
    const response = await videoData.getKvsStreamSrc(PLAYBACKMODE_ON_DEMAND);
    expect(response).toEqual(mockOnDemandURL);
  });

  it('Get available time ranges when video is available', async () => {
    getHLSStreamingSessionURL.mockResolvedValue(
      mockOnDemandGetHLSStreamingSessionURLResponse
    );
    getEntity.mockResolvedValue(mockEdgeVideoEntity);
    getPropertyValueHistory.mockResolvedValue(mockCachedVideoAgeOutOnEdge);
    getPropertyValueHistory.mockResolvedValue(mockVideoUploadedTimeRange);
    getInterpolatedAssetPropertyValues.mockResolvedValue(
      mockGetInterpolatedAssetPropertyValuesResponse
    );
    const kvsStreamSrc = await videoData.getKvsStreamSrc(
      PLAYBACKMODE_ON_DEMAND
    );
    const response = await videoData.getAvailableTimeRanges(
      new Date(1630005300000),
      new Date(1630005900000)
    );
    expect(kvsStreamSrc).toEqual(mockOnDemandURL);
    expect(response).toEqual(mockGetAvailableTimeRangeResponse);
  });
});
