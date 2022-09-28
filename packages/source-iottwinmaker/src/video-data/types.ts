import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { KinesisVideoClient } from '@aws-sdk/client-kinesis-video';
import { KinesisVideoArchivedMediaClient } from '@aws-sdk/client-kinesis-video-archived-media';
import { Endpoint } from '@aws-sdk/types';

export type GetOnDemandHLSStreamingSessionURLRequest = {
  kvsStreamName: string;
  kvsDataEndpoint: Endpoint;
  startTimestamp: Date;
  endTimestamp: Date;
};

export type GetLiveHLSStreamingSessionURLRequest = {
  kvsStreamName: string;
  kvsDataEndpoint: Endpoint;
};

export type TriggerVideoUploadRequest = {
  assetId: string;
  propertyId: string;
  startTimestamp?: string;
  endTimestamp?: string;
};

export type GetLastValueBeforeTimestampRequest = {
  assetId: string;
  propertyId: string;
  timestamp: Date;
};

export type VideoPlaybackMode = 'LIVE' | 'ON_DEMAND';

export type VideoDataInput = {
  workspaceId?: string;
  entityId?: string;
  componentName?: string;
  kvsStreamName?: string;
  kinesisVideoClient: KinesisVideoClient;
  kinesisVideoArchivedMediaClient: KinesisVideoArchivedMediaClient;
  siteWiseClient: IoTSiteWiseClient;
  twinMakerClient: IoTTwinMakerClient;
  sitewiseAssetId?: string;
  videoUploadRequestPropertyId?: string;
};
