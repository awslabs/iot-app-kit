import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { KinesisVideoClient } from '@aws-sdk/client-kinesis-video';
import { KinesisVideoArchivedMediaClient } from '@aws-sdk/client-kinesis-video-archived-media';
import { S3Client } from '@aws-sdk/client-s3';
import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { QueryClient } from '@tanstack/query-core';

import {
  kinesisVideoArchivedMediaSdk,
  kinesisVideoSdk,
  s3Sdk,
  secretsManagersdk,
  sitewiseSdk,
  twinMakerSdk,
} from './aws-sdks';
import { S3SceneLoader } from './scene-module/S3SceneLoader';
import { SceneMetadataModule } from './scene-module/SceneMetadataModule';
import { KGDataModule } from './knowledgeGraph-module/KGDataModule';
import { VideoDataImpl } from './video-data/VideoData';
import {
  DataBase,
  ErrorDetails,
  Query,
  TimeSeriesDataModule,
  DataRequest,
} from '@iot-app-kit/core';
import { TwinMakerTimeSeriesDataProvider } from './time-series-data/provider';
import { createDataSource } from './time-series-data/data-source';
import { TwinMakerMetadataModule } from './metadata-module/TwinMakerMetadataModule';
import type { Credentials, CredentialProvider } from '@aws-sdk/types';
import type { VideoDataProps } from './types';
import type { TwinMakerDataStreamQuery } from './time-series-data/types';
import type {
  TimeSeriesDataQuery,
  TimeSeriesDataRequest,
} from '@iot-app-kit/core';
import { TwinMakerErrorCode } from './common/error';
import { createEntityPropertyBindingProvider } from './data-binding-provider/createEntityPropertyBindingProvider';
import {
  TwinMakerHistoryQuery,
  TwinMakerPropertyValueQuery,
} from './common/queryTypes';
import { TwinMakerPropertyValueDataProvider } from './property-value/provider';

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
  secretsManagerClient?: SecretsManagerClient;
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
    twinMakerSdk(
      inputWithCred.awsCredentials,
      inputWithCred.awsRegion,
      inputWithCred.tmEndpoint
    );
  const siteWiseClient: IoTSiteWiseClient =
    authInput.iotSiteWiseClient ??
    sitewiseSdk(inputWithCred.awsCredentials, inputWithCred.awsRegion);
  const kinesisVideoClient: KinesisVideoClient =
    authInput.kinesisVideoClient ??
    kinesisVideoSdk(inputWithCred.awsCredentials, inputWithCred.awsRegion);
  const kinesisVideoArchivedMediaClient: KinesisVideoArchivedMediaClient =
    authInput.kinesisVideoArchivedMediaClient ??
    kinesisVideoArchivedMediaSdk(
      inputWithCred.awsCredentials,
      inputWithCred.awsRegion
    );
  const s3Client: S3Client =
    authInput.s3Client ??
    s3Sdk(inputWithCred.awsCredentials, inputWithCred.awsRegion);
  const secretsManagerClient: SecretsManagerClient =
    authInput.secretsManagerClient ??
    secretsManagersdk(inputWithCred.awsCredentials, inputWithCred.awsRegion);

  // For caching TwinMaker metadata API calls
  const cachedQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  });

  // For refreshing TwinMaker property value API calls
  const refreshingQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000,
      },
    },
  });

  const twinMakerMetadataModule = new TwinMakerMetadataModule(
    workspaceId,
    twinMakerClient,
    cachedQueryClient
  );
  const twinMakerTimeSeriesModule =
    new TimeSeriesDataModule<TwinMakerDataStreamQuery>(
      createDataSource(twinMakerMetadataModule, twinMakerClient)
    );

  const timeSeriesDataQuery: (
    query: TwinMakerHistoryQuery
  ) => TimeSeriesDataQuery = (query: TwinMakerHistoryQuery) => ({
    toQueryString: () =>
      JSON.stringify({
        source: SOURCE,
        queryType: 'time-series-data',
        query,
      }),
    build: (_sessionId: string, params: TimeSeriesDataRequest) =>
      new TwinMakerTimeSeriesDataProvider(
        twinMakerMetadataModule,
        twinMakerTimeSeriesModule,
        {
          queries: [
            {
              workspaceId,
              ...query,
            },
          ],
          request: params,
        }
      ),
  });

  const propertyValueQuery = (
    query: TwinMakerPropertyValueQuery
  ): Query<DataBase[], DataRequest> => ({
    toQueryString: () =>
      JSON.stringify({
        source: SOURCE,
        queryType: 'property-value',
        query,
      }),
    build: (_sessionId: string, params: DataRequest) =>
      new TwinMakerPropertyValueDataProvider(
        refreshingQueryClient,
        twinMakerClient,
        {
          queries: [
            {
              workspaceId,
              ...query,
            },
          ],
          request: params,
        }
      ),
  });
  const kgModule = new KGDataModule({ workspaceId, twinMakerClient });

  return {
    query: {
      timeSeriesData: timeSeriesDataQuery,
      propertyValue: propertyValueQuery,
    },
    s3SceneLoader: (sceneId: string) =>
      new S3SceneLoader({ workspaceId, sceneId, twinMakerClient, s3Client }),
    valueDataBindingProviders: (
      onError?: (
        errorCode: TwinMakerErrorCode,
        errorDetails?: ErrorDetails
      ) => void
    ) => ({
      TwinMakerEntityProperty: createEntityPropertyBindingProvider({
        metadataModule: twinMakerMetadataModule,
        timeSeriesDataQuery,
        propertyValueQuery,
        onError,
      }),
    }),
    sceneMetadataModule: (sceneId: string) =>
      new SceneMetadataModule({
        workspaceId,
        sceneId,
        twinMakerClient,
        secretsManagerClient,
        kgModule,
      }),
    kGDatamodule: () => kgModule,
    videoData: (videoDataProps: VideoDataProps) =>
      new VideoDataImpl({
        workspaceId: workspaceId,
        entityId: videoDataProps.entityId,
        componentName: videoDataProps.componentName,
        kvsStreamName: videoDataProps.kvsStreamName,
        sitewiseAssetId: videoDataProps.sitewiseAssetId,
        videoUploadRequestPropertyId:
          videoDataProps.videoUploadRequestPropertyId,
        kinesisVideoClient: kinesisVideoClient,
        kinesisVideoArchivedMediaClient: kinesisVideoArchivedMediaClient,
        siteWiseClient: siteWiseClient,
        twinMakerClient: twinMakerClient,
      }),
  };
};
