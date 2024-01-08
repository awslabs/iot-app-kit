import {
  GetSceneCommandOutput,
  ExecuteQueryCommandOutput,
  CreateEntityCommandInput,
  UpdateEntityCommandInput,
  DeleteEntityCommandInput,
  CreateEntityCommandOutput,
  UpdateEntityCommandOutput,
  DeleteEntityCommandOutput,
  GetEntityCommandInput,
  GetEntityCommandOutput,
} from '@aws-sdk/client-iottwinmaker';
import { SecretListEntry } from '@aws-sdk/client-secrets-manager';

import type { VideoPlaybackMode } from './video-data/types';

import { executeQueryParams } from './knowledgeGraph-module/types';

export interface SceneLoader {
  getSceneUri: () => Promise<string | null>;
  getSceneObject: (uri: string) => Promise<ArrayBuffer> | null;
}

export type SceneInfo = {
  capabilities?: string[];
  sceneMetadata?: Record<string, string>;
};

export interface TwinMakerSceneMetadataModule {
  kgModule: TwinMakerKGQueryDataModule;

  getSceneId: () => string;
  getSceneInfo: () => Promise<GetSceneCommandOutput>;
  updateSceneInfo: (sceneInfo: SceneInfo) => Promise<void>;
  get3pConnectionList: (
    connectionTag: string
  ) => Promise<SecretListEntry[] | undefined> | null;

  getSceneEntity: (
    input: Omit<GetEntityCommandInput, 'workspaceId'>
  ) => Promise<GetEntityCommandOutput>;
  createSceneEntity: (
    input: Omit<CreateEntityCommandInput, 'workspaceId'>
  ) => Promise<CreateEntityCommandOutput>;
  updateSceneEntity: (
    input: Omit<UpdateEntityCommandInput, 'workspaceId'>
  ) => Promise<UpdateEntityCommandOutput>;
  deleteSceneEntity: (
    input: Omit<DeleteEntityCommandInput, 'workspaceId'>
  ) => Promise<DeleteEntityCommandOutput>;
}

export interface VideoData {
  getKvsStreamSrc: (
    playbackMode: VideoPlaybackMode,
    startTime?: Date,
    endTime?: Date
  ) => Promise<string | undefined>;
  getAvailableTimeRanges: (
    startTime: Date,
    endTime: Date
  ) => Promise<
    | [
        { start: number; end: number; src: string }[],
        { start: number; end: number }[]
      ]
    | undefined
  >;
  triggerLiveVideoUpload: () => Promise<void>;
  triggerOnDemandVideoUploadRequest: (
    startTimestamp: string,
    endTimestamp: string
  ) => Promise<void>;
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
export interface TwinMakerKGQueryDataModule {
  executeQuery: (
    params: executeQueryParams
  ) => Promise<ExecuteQueryCommandOutput>;
}
