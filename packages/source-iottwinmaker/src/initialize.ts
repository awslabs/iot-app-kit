import { Credentials, CredentialProvider } from '@aws-sdk/types';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { KinesisVideoClient } from '@aws-sdk/client-kinesis-video';
import { KinesisVideoArchivedMediaClient } from '@aws-sdk/client-kinesis-video-archived-media';
import { S3Client } from '@aws-sdk/client-s3';

import { kinesisVideoArchivedMediaSdk, kinesisVideoSdk, s3Sdk, sitewiseSdk, twinMakerSdk } from './aws-sdks';
import { S3SceneLoader } from './scene-loader/S3SceneLoader';
import { VideoDataImpl } from './video-data/VideoData';
import { VideoDataProps } from './types';
import { TwinMakerQuery } from './time-series-data/types';
import { IotAppKitDataModule, TimeQuery, TimeSeriesData, TimeSeriesDataRequest } from '@iot-app-kit/core';
import { TwinMakerTimeSeriesDataProvider } from './time-series-data/provider';
import { createDataSource, TWINMAKER_DATA_SOURCE } from './time-series-data/data-source';
import { TwinMakerMetadataModule } from './metadata-module/TwinMakerMetadataModule';

type IoTAppKitInitAuthInputs = {
  iotSiteWiseClient: IoTSiteWiseClient;
  iotTwinMakerClient: IoTTwinMakerClient;
  kinesisVideoClient: KinesisVideoClient;
  kinesisVideoArchivedMediaClient: KinesisVideoArchivedMediaClient;
  s3Client: S3Client;
};
type IoTAppKitInitAuthInputsWithCred = {
  awsCredentials: Credentials | CredentialProvider;
  awsRegion: string;
  tmEndpoint?: string;
  iotSiteWiseClient?: IoTSiteWiseClient;
  iotTwinMakerClient?: IoTTwinMakerClient;
  kinesisVideoClient?: KinesisVideoClient;
  kinesisVideoArchivedMediaClient?: KinesisVideoArchivedMediaClient;
  s3Client?: S3Client;
};

/**
 * Initialize IoT App Kit
 *
 * @param awsCredentials - https://www.npmjs.com/package/@aws-sdk/credential-providers
 * @param awsRegion - Region for AWS based data sources to point towards, i.e. us-east-1
 * @param tmEndpoint - the endpoint to be used by the TwinMaker client
 */
export const initialize = (
  workspaceId: string,
  authInput: IoTAppKitInitAuthInputs | IoTAppKitInitAuthInputsWithCred
) => {
  const inputWithCred = authInput as IoTAppKitInitAuthInputsWithCred;

  const twinMakerClient: IoTTwinMakerClient =
    authInput.iotTwinMakerClient ??
    twinMakerSdk(inputWithCred.awsCredentials, inputWithCred.awsRegion, inputWithCred.tmEndpoint);
  const siteWiseClient: IoTSiteWiseClient =
    authInput.iotSiteWiseClient ?? sitewiseSdk(inputWithCred.awsCredentials, inputWithCred.awsRegion);
  const kinesisVideoClient: KinesisVideoClient =
    authInput.kinesisVideoClient ?? kinesisVideoSdk(inputWithCred.awsCredentials, inputWithCred.awsRegion);
  const kinesisVideoArchivedMediaClient: KinesisVideoArchivedMediaClient =
    authInput.kinesisVideoArchivedMediaClient ??
    kinesisVideoArchivedMediaSdk(inputWithCred.awsCredentials, inputWithCred.awsRegion);
  const s3Client: S3Client = authInput.s3Client ?? s3Sdk(inputWithCred.awsCredentials, inputWithCred.awsRegion);

  const twinMakerTimeSeriesModule = new IotAppKitDataModule();
  const twinMakerMetadataModule = new TwinMakerMetadataModule(workspaceId, twinMakerClient);
  twinMakerTimeSeriesModule.registerDataSource(createDataSource(twinMakerClient));

  return {
    query: {
      timeSeriesData: (query: TwinMakerQuery): TimeQuery<TimeSeriesData[], TimeSeriesDataRequest> => ({
        build: (sessionId: string, params: TimeSeriesDataRequest) =>
          new TwinMakerTimeSeriesDataProvider(twinMakerMetadataModule, twinMakerTimeSeriesModule, {
            queries: [
              {
                source: TWINMAKER_DATA_SOURCE,
                workspaceId,
                ...query,
              },
            ],
            request: params,
          }),
      }),
    },
    s3SceneLoader: (sceneId: string) => new S3SceneLoader({ workspaceId, sceneId, twinMakerClient, s3Client }),
    videoData: (videoDataProps: VideoDataProps) =>
      new VideoDataImpl({
        workspaceId: workspaceId,
        entityId: videoDataProps.entityId,
        componentName: videoDataProps.componentName,
        kvsStreamName: videoDataProps.kvsStreamName,
        sitewiseAssetId: videoDataProps.sitewiseAssetId,
        videoUploadRequestPropertyId: videoDataProps.videoUploadRequestPropertyId,
        kinesisVideoClient: kinesisVideoClient,
        kinesisVideoArchivedMediaClient: kinesisVideoArchivedMediaClient,
        siteWiseClient: siteWiseClient,
        twinMakerClient: twinMakerClient,
      }),
  };
};
