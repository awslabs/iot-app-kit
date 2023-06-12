import { TwinMakerQuery, VideoDataProps, initialize } from "@iot-app-kit/source-iottwinmaker";
import { useMemo } from "react";
import useAWSCredentials from "./useAWSCredentials";
import { TimeSeriesDataQuery } from "@iot-app-kit/core";
import { S3SceneLoader } from "@iot-app-kit/source-iottwinmaker/dist/es/scene-module/S3SceneLoader";
import { SceneMetadataModule } from "@iot-app-kit/source-iottwinmaker/dist/es/scene-module/SceneMetadataModule";
import { VideoDataImpl } from "@iot-app-kit/source-iottwinmaker/dist/es/video-data/VideoData";

import awsConfig from '../aws-exports';

export interface TwinMakerDataSource {
  query: {
      timeSeriesData: (query: TwinMakerQuery) => TimeSeriesDataQuery;
  };
  s3SceneLoader: (sceneId: string) => S3SceneLoader;
  sceneMetadataModule: (sceneId: string) => SceneMetadataModule;
  videoData: (videoDataProps: VideoDataProps) => VideoDataImpl;
}

const useTwinMakerDataSource = (workspaceId: string, region: string = awsConfig.aws_project_region || 'us-east-1') => {
  const credentials = useAWSCredentials();

  const dataSource: TwinMakerDataSource | null = useMemo(() => {
    if (credentials) {
      return initialize(workspaceId, {
        awsCredentials: credentials,
        awsRegion: region,
      })
    }

    return null;
  }, [credentials, region, workspaceId]);

  return dataSource;
}

export default useTwinMakerDataSource;
