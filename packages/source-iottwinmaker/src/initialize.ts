import { Credentials, CredentialProvider } from '@aws-sdk/types';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { KinesisVideoClient } from '@aws-sdk/client-kinesis-video';
import { KinesisVideoArchivedMediaClient } from '@aws-sdk/client-kinesis-video-archived-media';
import { S3Client } from '@aws-sdk/client-s3';
import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

import {
  kinesisVideoArchivedMediaSdk,
  kinesisVideoSdk,
  s3Sdk,
  secretsManagersdk,
  sitewiseSdk,
  twinMakerSdk,
} from './aws-sdks';
import { S3SceneLoader } from './scene-loader/S3SceneLoader';
import { VideoDataImpl } from './video-data/VideoData';
import { VideoDataProps } from './types';
import { TwinMakerDataStreamQuery, TwinMakerQuery } from './time-series-data/types';
import { TimeSeriesDataModule, TimeSeriesDataQuery, TimeSeriesDataRequest } from '@iot-app-kit/core';
import { TwinMakerTimeSeriesDataProvider } from './time-series-data/provider';
import { createDataSource } from './time-series-data/data-source';
import { TwinMakerMetadataModule } from './metadata-module/TwinMakerMetadataModule';

const SOURCE = 'iottwinmaker';

/**
 * The authInput interface with pre-configured aws client instances.
 */
type IoTAppKitInitAuthInputs = {
  /**
   * The pre-configured IoT SiteWise client
   */
  iotSiteWiseClient: IoTSiteWiseClient;
  /**
   * The pre-configured IoT TwinMaker client
   */
  iotTwinMakerClient: IoTTwinMakerClient;
  /**
   * The pre-configured KinesisVideo client
   */
  kinesisVideoClient: KinesisVideoClient;
  /**
   * The pre-configured KinesisVideoArchivedMedia client
   */
  kinesisVideoArchivedMediaClient: KinesisVideoArchivedMediaClient;
  /**
   * The pre-configured S3 client
   */
  s3Client: S3Client;
  /**
   * The pre-configured Secrets Manager client
   */
  secretsManagerClient: SecretsManagerClient;
};

/**
 * The authInput interface with credential/credentialProvider, region, and optional aws client instances.
 */
type IoTAppKitInitAuthInputsWithCred = {
  /**
   * AWS credentials or credential provider for creating aws clients that are not passed in
   */
  awsCredentials: Credentials | CredentialProvider;
  /**
   * AWS region for creating aws clients that are not passed in, i.e. us-east-1
   */
  awsRegion: string;
  /**
   * The endpoint to be used by the IoT TwinMaker client (https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-iottwinmaker/interfaces/iottwinmakerclientconfig.html#endpointhttps://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-iottwinmaker/interfaces/iottwinmakerclientconfig.html#endpoint)
   */
  tmEndpoint?: string;
  /**
   * The pre-configured IoT SiteWise client
   */
  iotSiteWiseClient?: IoTSiteWiseClient;
  /**
   * The pre-configured IoT TwinMaker client
   */
  iotTwinMakerClient?: IoTTwinMakerClient;
  /**
   * The pre-configured KinesisVideo client
   */
  kinesisVideoClient?: KinesisVideoClient;
  /**
   * The pre-configured KinesisVideoArchivedMedia client
   */
  kinesisVideoArchivedMediaClient?: KinesisVideoArchivedMediaClient;
  /**
   * The pre-configured S3 client
   */
  s3Client?: S3Client;
  /**
   * The pre-configured Secrets Manager client
   */
  secretsManagerClient?: SecretsManagerClient;
};

/**
 * Initialize IoT App Kit TwinMaker data source
 *
 * @param workspaceId - the workspaceId of a TwinMaker workspace that this data source will fetch data from
 * @param authInput - the set of inputs to get aws client instances ready
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
  const secretsManagerClient: SecretsManagerClient =
    authInput.secretsManagerClient ?? secretsManagersdk(inputWithCred.awsCredentials, inputWithCred.awsRegion);

  const twinMakerMetadataModule = new TwinMakerMetadataModule(workspaceId, twinMakerClient);
  const twinMakerTimeSeriesModule = new TimeSeriesDataModule<TwinMakerDataStreamQuery>(
    createDataSource(twinMakerMetadataModule, twinMakerClient)
  );

  return {
    query: {
      timeSeriesData: (query: TwinMakerQuery): TimeSeriesDataQuery => ({
        toQueryString: () =>
          JSON.stringify({
            source: SOURCE,
            queryType: 'time-series-data',
            query,
          }),
        build: (sessionId: string, params: TimeSeriesDataRequest) =>
          new TwinMakerTimeSeriesDataProvider(twinMakerMetadataModule, twinMakerTimeSeriesModule, {
            queries: [
              {
                workspaceId,
                ...query,
              },
            ],
            request: params,
          }),
      }),
    },
    s3SceneLoader: (sceneId: string) =>
      new S3SceneLoader({ workspaceId, sceneId, twinMakerClient, s3Client, secretsManagerClient }),
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
