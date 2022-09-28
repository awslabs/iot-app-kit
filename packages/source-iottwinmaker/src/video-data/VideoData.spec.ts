import { GetDataEndpointCommand, KinesisVideoClient } from '@aws-sdk/client-kinesis-video';
import {
  GetHLSStreamingSessionURLCommand,
  KinesisVideoArchivedMediaClient,
} from '@aws-sdk/client-kinesis-video-archived-media';
import {
  BatchPutAssetPropertyValueCommand,
  GetAssetPropertyValueCommand,
  GetInterpolatedAssetPropertyValuesCommand,
  IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import { GetEntityCommand, GetPropertyValueHistoryCommand, IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { mockClient } from 'aws-sdk-client-mock';
import { VideoDataImpl } from './VideoData';
import {
  batchPutAssetPropertyResponse,
  mockAWSCredentials,
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

describe('Test VideoData class', () => {
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

  const sitewiseClient = new IoTSiteWiseClient({
    ...{
      region: 'abc',
    },
    credentials: mockAWSCredentials,
  });
  const siteWiseClientMock = mockClient(sitewiseClient);

  const twinMakerClient = new IoTTwinMakerClient({
    ...{
      region: 'abc',
    },
    credentials: mockAWSCredentials,
  });
  const twinMakerClientMock = mockClient(twinMakerClient);

  const videoDataInput: VideoDataInput = {
    workspaceId: mockWorkspaceId,
    entityId: mockEntityId,
    componentName: mockComponentName,
    kinesisVideoClient: kinesisVideoClient,
    kinesisVideoArchivedMediaClient: kinesisVideoArchivedMediaClient,
    siteWiseClient: sitewiseClient,
    twinMakerClient: twinMakerClient,
    sitewiseAssetId: mockSitewiseAssetId,
    videoUploadRequestPropertyId: mockVideoUploadRequestPropertyId,
  };
  const videoData = new VideoDataImpl(videoDataInput);

  const videoDataInputSimpleMode: VideoDataInput = {
    kvsStreamName: mockKVSStreamName,
    kinesisVideoClient: kinesisVideoClient,
    kinesisVideoArchivedMediaClient: kinesisVideoArchivedMediaClient,
    siteWiseClient: sitewiseClient,
    twinMakerClient: twinMakerClient,
    sitewiseAssetId: mockSitewiseAssetId,
    videoUploadRequestPropertyId: mockVideoUploadRequestPropertyId,
  };
  const videoDataSimpleMode = new VideoDataImpl(videoDataInputSimpleMode);

  beforeEach(() => {
    kinesisVideoClientMock.reset();
    kinesisVideoClientMock.on(GetDataEndpointCommand).resolves(mockGetDataEndpointResponse);

    siteWiseClientMock.reset();
    siteWiseClientMock.on(BatchPutAssetPropertyValueCommand).resolves(batchPutAssetPropertyResponse);
    siteWiseClientMock.on(GetAssetPropertyValueCommand).resolves(mockGetAssetPropertyValueResponse);

    jest.clearAllMocks();
  });

  it('Test successful triggerLiveVideoUpload()', async () => {
    expect(() => videoDataSimpleMode.triggerLiveVideoUpload()).not.toThrow();
  });

  it('Test successful triggerOnDemandVideoUploadRequest()', async () => {
    expect(() =>
      videoDataSimpleMode.triggerOnDemandVideoUploadRequest(new Date().toISOString(), new Date().toISOString())
    ).not.toThrow();
  });

  it('Fetch KVS stream source for LIVE playback - Simple Mode', async () => {
    kinesisVideoArchivedMediaClientMock
      .on(GetHLSStreamingSessionURLCommand)
      .resolves(mockLiveGetHLSStreamingSessionURLResponse);
    const response = await videoDataSimpleMode.getKvsStreamSrc(PLAYBACKMODE_LIVE);
    expect(response).toEqual(mockLiveURL);
  });

  it('Fetch KVS stream source for ON_DEMAND playback - Simple Mode', async () => {
    kinesisVideoArchivedMediaClientMock
      .on(GetHLSStreamingSessionURLCommand)
      .resolves(mockOnDemandGetHLSStreamingSessionURLResponse);
    const response = await videoDataSimpleMode.getKvsStreamSrc(PLAYBACKMODE_ON_DEMAND);
    expect(response).toEqual(mockOnDemandURL);
  });

  it('Fetch KVS stream source for LIVE playback - EdgeVideo Component', async () => {
    kinesisVideoArchivedMediaClientMock
      .on(GetHLSStreamingSessionURLCommand)
      .resolves(mockLiveGetHLSStreamingSessionURLResponse);
    twinMakerClientMock.on(GetEntityCommand).resolves(mockEdgeVideoEntity);
    const response = await videoData.getKvsStreamSrc(PLAYBACKMODE_LIVE);
    expect(response).toEqual(mockLiveURL);
  });

  it('Fetch KVS stream source for ON_DEMAND playback - EdgeVideo Component', async () => {
    kinesisVideoArchivedMediaClientMock
      .on(GetHLSStreamingSessionURLCommand)
      .resolves(mockOnDemandGetHLSStreamingSessionURLResponse);
    twinMakerClientMock.on(GetEntityCommand).resolves(mockEdgeVideoEntity);
    const response = await videoData.getKvsStreamSrc(PLAYBACKMODE_ON_DEMAND);
    expect(response).toEqual(mockOnDemandURL);
  });

  it('Fetch KVS stream source for LIVE playback - KVS Component', async () => {
    kinesisVideoArchivedMediaClientMock
      .on(GetHLSStreamingSessionURLCommand)
      .resolves(mockLiveGetHLSStreamingSessionURLResponse);
    twinMakerClientMock.on(GetEntityCommand).resolves(mockKVSEntity);
    const response = await videoData.getKvsStreamSrc(PLAYBACKMODE_LIVE);
    expect(response).toEqual(mockLiveURL);
  });

  it('Fetch KVS stream source for ON_DEMAND playback - KVS Component', async () => {
    kinesisVideoArchivedMediaClientMock
      .on(GetHLSStreamingSessionURLCommand)
      .resolves(mockOnDemandGetHLSStreamingSessionURLResponse);
    twinMakerClientMock.on(GetEntityCommand).resolves(mockKVSEntity);
    const response = await videoData.getKvsStreamSrc(PLAYBACKMODE_ON_DEMAND);
    expect(response).toEqual(mockOnDemandURL);
  });

  it('Get available time ranges when video is available', async () => {
    kinesisVideoArchivedMediaClientMock
      .on(GetHLSStreamingSessionURLCommand)
      .resolves(mockOnDemandGetHLSStreamingSessionURLResponse);
    twinMakerClientMock.on(GetEntityCommand).resolves(mockEdgeVideoEntity);
    twinMakerClientMock
      .on(GetPropertyValueHistoryCommand)
      .resolvesOnce(mockCachedVideoAgeOutOnEdge)
      .resolves(mockVideoUploadedTimeRange);
    siteWiseClientMock
      .on(GetInterpolatedAssetPropertyValuesCommand)
      .resolves(mockGetInterpolatedAssetPropertyValuesResponse);
    const kvsStreamSrc = await videoData.getKvsStreamSrc(PLAYBACKMODE_ON_DEMAND);
    const response = await videoData.getAvailableTimeRanges(new Date(1630005300000), new Date(1630005900000));
    expect(kvsStreamSrc).toEqual(mockOnDemandURL);
    expect(response).toEqual(mockGetAvailableTimeRangeResponse);
  });
});
