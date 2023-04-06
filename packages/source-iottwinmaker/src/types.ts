import { GetSceneCommandOutput } from '@aws-sdk/client-iottwinmaker';
import { SecretListEntry } from '@aws-sdk/client-secrets-manager';
import type { VideoPlaybackMode } from './video-data/types';

export interface SceneLoader {
  getSceneUri: () => Promise<string | null>;
  getSceneObject: (uri: string) => Promise<ArrayBuffer> | null;
}

export type SceneInfo = { capabilities?: string[]; sceneMetadata?: Record<string, string> };

export interface TwinMakerSceneMetadataModule {
  getSceneInfo: () => Promise<GetSceneCommandOutput>;
  updateSceneInfo: (sceneInfo: SceneInfo) => Promise<void>;
  get3pConnectionList: (connectionTag: string) => Promise<SecretListEntry[] | undefined> | null;
}

export interface VideoData {
  getKvsStreamSrc: (playbackMode: VideoPlaybackMode, startTime?: Date, endTime?: Date) => Promise<string | undefined>;
  getAvailableTimeRanges: (
    startTime: Date,
    endTime: Date
  ) => Promise<[{ start: number; end: number; src: string }[], { start: number; end: number }[]] | undefined>;
  triggerLiveVideoUpload: () => Promise<void>;
  triggerOnDemandVideoUploadRequest: (startTimestamp: string, endTimestamp: string) => Promise<void>;
}

export type VideoDataProps =
  | {
      kvsStreamName: string;
      entityId?: string;
      componentName?: string;
      sitewiseAssetId?: string;
      videoUploadRequestPropertyId?: string;
    }
  | {
      entityId: string;
      componentName: string;
      kvsStreamName?: string;
      sitewiseAssetId?: string;
      videoUploadRequestPropertyId?: string;
    };
