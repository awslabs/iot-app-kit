import { GetAssetPropertyValueRequest, IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import {
  GetEntityCommand,
  GetEntityCommandInput,
  GetPropertyValueHistoryRequest,
  IoTTwinMakerClient,
} from '@aws-sdk/client-iottwinmaker';
import { KinesisVideoClient } from '@aws-sdk/client-kinesis-video';
import { KinesisVideoArchivedMediaClient } from '@aws-sdk/client-kinesis-video-archived-media';
import { Endpoint } from '@aws-sdk/types';
import { isEmpty } from 'lodash';
import {
  ASCENDING,
  CachedVideoAgeOutOnEdge,
  edgeVideoComponentTypeId,
  KinesisVideoStreamName,
  kvsVideoComponentTypeId,
  PLAYBACKMODE_LIVE,
  sitewiseAssetId,
  VideoUploadedTimeRange,
  VideoUploadRequest,
} from './constants';
import {
  GetLastValueBeforeTimestampRequest,
  GetLiveHLSStreamingSessionURLRequest,
  GetOnDemandHLSStreamingSessionURLRequest,
  TriggerVideoUploadRequest,
} from './types';
import { VideoDataInput, VideoPlaybackMode } from './types';
import { VideoData } from '../types';
import { getKVSDataEndpoint, getLiveHLSStreamingSessionURL, getOnDemandHLSStreamingSessionURL } from './utils/kvsUtils';
import { getAssetPropertyValue, getLastValueBeforeTimestamp, triggerVideoUploadRequest } from './utils/sitewiseUtils';
import { createPropertyIndentifierKey, getSinglePropertyValueHistory } from './utils/twinmakerUtils';
export class VideoDataImpl implements VideoData {
  workspaceId?: string;
  entityId?: string;
  componentName?: string;
  kvsStreamName?: string;
  sitewiseAssetPropertyId = '';
  videoUploadRequestPropertyId = '';
  kinesisVideoClient: KinesisVideoClient;
  kinesisVideoArchivedMediaClient: KinesisVideoArchivedMediaClient;
  siteWiseClient: IoTSiteWiseClient;
  twinMakerClient: IoTTwinMakerClient;
  private timerangesWithSource: Array<{ start: number; end: number; src: string }> = [];
  private timerangesForVideoOnEdgeRaw: Array<{ start: number; end: number }> = [];
  private kvsStreamNameCalculated = '';
  private kvsEndpoint?: Endpoint;
  private videoUploadedTimeRangePropertyId = '';
  private KinesisVideoStreamNamePropertyId = '';

  constructor(input: VideoDataInput) {
    this.workspaceId = input.workspaceId;
    this.entityId = input.entityId;
    this.componentName = input.componentName;
    this.kvsStreamName = input.kvsStreamName;
    this.kinesisVideoClient = input.kinesisVideoClient;
    this.kinesisVideoArchivedMediaClient = input.kinesisVideoArchivedMediaClient;
    this.siteWiseClient = input.siteWiseClient;
    this.twinMakerClient = input.twinMakerClient;
    if (input.sitewiseAssetId) {
      this.sitewiseAssetPropertyId = input.sitewiseAssetId;
    }
    if (input.videoUploadRequestPropertyId) {
      this.videoUploadRequestPropertyId = input.videoUploadRequestPropertyId;
    }
  }

  // Helper function to trigger live video upload from SiteWise to KVS
  async triggerLiveVideoUpload(): Promise<void> {
    if (!isEmpty(this.sitewiseAssetPropertyId) && !isEmpty(this.videoUploadRequestPropertyId)) {
      const liveVideoUploadRequest: TriggerVideoUploadRequest = {
        assetId: this.sitewiseAssetPropertyId,
        propertyId: this.videoUploadRequestPropertyId,
      };
      await triggerVideoUploadRequest(liveVideoUploadRequest, this.siteWiseClient);
    }
  }

  async triggerOnDemandVideoUploadRequest(startTimestamp: string, endTimestamp: string): Promise<void> {
    if (!isEmpty(this.sitewiseAssetPropertyId) && !isEmpty(this.videoUploadRequestPropertyId)) {
      const onDemandVideoUploadRequest: TriggerVideoUploadRequest = {
        assetId: this.sitewiseAssetPropertyId,
        propertyId: this.videoUploadRequestPropertyId,
        startTimestamp: startTimestamp,
        endTimestamp: endTimestamp,
      };
      await triggerVideoUploadRequest(onDemandVideoUploadRequest, this.siteWiseClient);
    }
  }

  async getKvsStreamSrc(
    playbackMode: VideoPlaybackMode,
    startTime?: Date,
    endTime?: Date
  ): Promise<string | undefined> {
    // 1. SiteWatch/KVS Component Mode
    if (this.workspaceId && this.entityId && this.componentName) {
      // Fetch the SiteWatch properties
      await this.updateSiteWatchAndKvsProperties();
      if (!!this.kvsStreamNameCalculated && !isEmpty(this.kvsStreamNameCalculated)) {
        const videoSource = await this.getKVSSource(playbackMode, this.kvsStreamNameCalculated, startTime, endTime);
        return videoSource;
      }
    }
    // 2. Simple Mode
    else {
      // Update the KVS Stream Name
      if (!!this.kvsStreamName && !isEmpty(this.kvsStreamName)) {
        const streamName = this.kvsStreamName as string;
        const videoSource = await this.getKVSSource(playbackMode, streamName, startTime, endTime);
        return videoSource;
      }
    }
  }

  private async getKVSSource(
    playbackMode: VideoPlaybackMode,
    kvsStreamName: string,
    startTime?: Date,
    endTime?: Date
  ): Promise<string | undefined> {
    if (!!kvsStreamName && !isEmpty(kvsStreamName)) {
      // Fetch Data Endpoint
      const kvsDataEndpoint = await getKVSDataEndpoint(kvsStreamName, this.kinesisVideoClient);
      if (kvsDataEndpoint) {
        this.kvsEndpoint = kvsDataEndpoint;
        if (playbackMode === PLAYBACKMODE_LIVE) {
          const getLiveHLSStreamingSessionURLRequest: GetLiveHLSStreamingSessionURLRequest = {
            kvsStreamName: kvsStreamName,
            kvsDataEndpoint: kvsDataEndpoint,
          };
          const sessionURL = await getLiveHLSStreamingSessionURL(
            getLiveHLSStreamingSessionURLRequest,
            this.kinesisVideoArchivedMediaClient
          );
          return sessionURL;
        } else {
          const getOnDemandHLSStreamingSessionURLRequest: GetOnDemandHLSStreamingSessionURLRequest = {
            kvsStreamName: kvsStreamName,
            kvsDataEndpoint: kvsDataEndpoint,
            startTimestamp: startTime as Date,
            endTimestamp: endTime as Date,
          };
          const sessionURL = await getOnDemandHLSStreamingSessionURL(
            getOnDemandHLSStreamingSessionURLRequest,
            this.kinesisVideoArchivedMediaClient
          );
          return sessionURL;
        }
      }
    }
  }

  private async updateSiteWatchAndKvsProperties() {
    this.kvsStreamNameCalculated = this.kvsStreamName as string;
    if (this.workspaceId && this.entityId && this.componentName) {
      const getEntityRequest: GetEntityCommandInput = { workspaceId: this.workspaceId, entityId: this.entityId };
      const entity = await this.twinMakerClient.send(new GetEntityCommand(getEntityRequest));
      if (entity && entity.components) {
        // Get SiteWatch/KVS component and desired properties from Entity
        const videoComponent = entity.components[this.componentName as string];
        if (videoComponent && videoComponent.properties) {
          if (videoComponent.componentTypeId === edgeVideoComponentTypeId) {
            this.sitewiseAssetPropertyId = videoComponent.properties[sitewiseAssetId].value?.stringValue as string;
            this.videoUploadedTimeRangePropertyId = videoComponent.properties[VideoUploadedTimeRange].definition
              ?.configuration?.sitewisePropertyId as string;
            this.videoUploadRequestPropertyId = videoComponent.properties[VideoUploadRequest].definition?.configuration
              ?.sitewisePropertyId as string;
            this.KinesisVideoStreamNamePropertyId = videoComponent.properties[KinesisVideoStreamName].definition
              ?.configuration?.sitewisePropertyId as string;

            const getAssetPropertyValueRequest: GetAssetPropertyValueRequest = {
              assetId: this.sitewiseAssetPropertyId,
              propertyId: this.KinesisVideoStreamNamePropertyId,
            };
            const propertyValue = await getAssetPropertyValue(getAssetPropertyValueRequest, this.siteWiseClient);
            const streamName = propertyValue as string;
            this.kvsStreamNameCalculated = streamName;
          } else if (videoComponent.componentTypeId === kvsVideoComponentTypeId) {
            // For KVS Component Type - Fetch the KVS streamm name and proceed further
            this.kvsStreamNameCalculated = videoComponent.properties[KinesisVideoStreamName].value
              ?.stringValue as string;
            this.sitewiseAssetPropertyId = '';
            this.videoUploadRequestPropertyId = '';
          }
        }
      }
    }
  }

  async getAvailableTimeRanges(
    startTime: Date,
    endTime: Date
  ): Promise<[{ start: number; end: number; src: string }[], { start: number; end: number }[]] | undefined> {
    if (
      this.workspaceId &&
      this.entityId &&
      this.componentName &&
      !isEmpty(this.sitewiseAssetPropertyId) &&
      !isEmpty(this.videoUploadedTimeRangePropertyId)
    ) {
      const entityId = this.entityId as string;
      const componentName = this.componentName as string;

      // Decrement the start time by 1 second so that API return value for extact matching start time
      const startDateTime = new Date(startTime.getTime() - 1);

      const cachedVideoAgeOutOnEdgeHistory = await this.getSinglePropertyValueHistory(
        CachedVideoAgeOutOnEdge,
        startDateTime,
        endTime
      );
      const videoOnEdgeDataId = await createPropertyIndentifierKey(entityId, componentName, CachedVideoAgeOutOnEdge);
      cachedVideoAgeOutOnEdgeHistory[videoOnEdgeDataId].forEach((data) => {
        const start = data.x < startTime.getTime() ? startTime.getTime() : data.x;
        const end = Number(data.y) * 1000 > endTime.getTime() ? endTime.getTime() : Number(data.y) * 1000;
        this.timerangesForVideoOnEdgeRaw.push({
          start: new Date(start).getTime(),
          end: new Date(end).getTime(),
        });
      });

      const getLastValueBeforeTimestampRequest: GetLastValueBeforeTimestampRequest = {
        assetId: this.sitewiseAssetPropertyId,
        propertyId: this.videoUploadedTimeRangePropertyId,
        timestamp: startTime,
      };
      const prevEnd = await getLastValueBeforeTimestamp(getLastValueBeforeTimestampRequest, this.siteWiseClient);
      const prevEndTimestamp = prevEnd.getTime();
      if (!isNaN(prevEndTimestamp)) {
        // Get KVS stream URL for the interpolated time range
        await this.insertVideoInformation(startTime, prevEnd);
      }

      const videoUploadedTimeRangeHistory = await this.getSinglePropertyValueHistory(
        VideoUploadedTimeRange,
        startDateTime,
        endTime
      );
      const availableVideoDataId = await createPropertyIndentifierKey(entityId, componentName, VideoUploadedTimeRange);
      // Get KVS stream URLs for all the time ranges
      for (const data of videoUploadedTimeRangeHistory[availableVideoDataId]) {
        const start = data.x < startTime.getTime() ? startTime.getTime() : data.x;
        const end = Number(data.y) * 1000 > endTime.getTime() ? endTime.getTime() : Number(data.y) * 1000;
        await this.insertVideoInformation(new Date(start), new Date(end));
      }

      return [this.timerangesWithSource, this.timerangesForVideoOnEdgeRaw];
    }
  }

  private async getSinglePropertyValueHistory(propertyName: string, startDateTime: Date, endDateTime: Date) {
    const getPropertyValueHistoryRequest: GetPropertyValueHistoryRequest = {
      workspaceId: this.workspaceId as string,
      entityId: this.entityId as string,
      componentName: this.componentName as string,
      selectedProperties: [propertyName],
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      orderByTime: ASCENDING,
    };
    return await getSinglePropertyValueHistory(getPropertyValueHistoryRequest, this.twinMakerClient);
  }

  private async insertVideoInformation(start: Date, end: Date) {
    if (this.kvsEndpoint && !isEmpty(this.kvsStreamNameCalculated)) {
      const getOnDemandHLSStreamingSessionURLRequest: GetOnDemandHLSStreamingSessionURLRequest = {
        kvsStreamName: this.kvsStreamNameCalculated,
        kvsDataEndpoint: this.kvsEndpoint,
        startTimestamp: start,
        endTimestamp: end,
      };
      const videoURL = await getOnDemandHLSStreamingSessionURL(
        getOnDemandHLSStreamingSessionURLRequest,
        this.kinesisVideoArchivedMediaClient
      );
      if (!!videoURL && !isEmpty(videoURL)) {
        this.timerangesWithSource.push({ start: start.getTime(), end: end.getTime(), src: videoURL });
      }
    }
  }
}
