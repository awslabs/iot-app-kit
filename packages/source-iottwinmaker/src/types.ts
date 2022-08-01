import { VideoPlaybackMode } from './video-data/types';

export interface SceneLoader {
  // TODO: remove getSceneUrl once switched internal code to getSceneUri
  getSceneUrl: () => Promise<string | null>;

  getSceneUri: () => Promise<string | null>;
  getSceneObject: (uri: string) => Promise<ArrayBuffer> | null;
}

export interface VideoData {
  getKvsStreamSrc: (playbackMode: VideoPlaybackMode, startTime?: Date, endTime?: Date) => Promise<string | undefined>;
  getAvailableTimeRanges: (
    startTime: Date,
    endTime: Date
  ) => Promise<[{ start: number; end: number; src: string }[], { start: number; end: number }[], string] | undefined>;
  triggerLiveVideoUpload: () => Promise<boolean>;
  triggerOnDemandVideoUploadRequest: (startTimestamp: string, endTimestamp: string) => Promise<boolean>;
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
