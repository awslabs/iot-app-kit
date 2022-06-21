import { Credentials, CredentialProvider } from '@aws-sdk/types';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { KinesisVideoClient } from '@aws-sdk/client-kinesis-video';
import { KinesisVideoArchivedMediaClient } from '@aws-sdk/client-kinesis-video-archived-media';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { kinesisVideoArchivedMediaSdk, kinesisVideoSdk, s3Sdk, sitewiseSdk, twinMakerSdk } from './aws-sdks';
import { getS3BucketAndKey } from './utils/s3Utils';

type IoTAppKitInitAuthInputs = {
  // registerDataSources?: boolean; // TODO
  iotSiteWiseClient: IoTSiteWiseClient;
  iotTwinMakerClient: IoTTwinMakerClient;
  kinesisVideoClient: KinesisVideoClient;
  kinesisVideoArchivedMediaClient: KinesisVideoArchivedMediaClient;
  s3Client: S3Client;
};
type IoTAppKitInitAuthInputsWithCred = {
  // registerDataSources?: boolean; // TODO
  awsCredentials: Credentials | CredentialProvider;
  awsRegion: string;
  tmEndpoint?: string;
  iotSiteWiseClient?: IoTSiteWiseClient;
  iotTwinMakerClient?: IoTTwinMakerClient;
  kinesisVideoClient?: KinesisVideoClient;
  kinesisVideoArchivedMediaClient?: KinesisVideoArchivedMediaClient;
  s3Client?: S3Client;
};

// TODO: remove next line after adding real implementation
/*eslint-disable @typescript-eslint/no-unused-vars */

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

  // TODO: initialize dataSource for query.
  // const tmDataSource: TwinMakerDataSource = createTwinMakerDataSource(twinMakerClient);
  // if (input.registerDataSources !== false) {
  //   /** Automatically registered data sources */
  //   twinMakerTimeSeriesModule.registerDataSource(createDataSource(twinMakerClient));
  // }

  return {
    s3SceneLoader: (sceneId: string) => ({
      getSceneObject: (uri: string): Promise<ArrayBuffer> | null => {
        const s3BucketAndKey = getS3BucketAndKey(uri);
        if (!s3BucketAndKey) return null;

        return new Promise((resolve, reject) => {
          s3Client
            .send(new GetObjectCommand(s3BucketAndKey))
            .then(async (data) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const res = await new Response(data.Body as any).arrayBuffer();
              resolve(res);
            })
            .catch((error) => {
              reject(error);
            });
        });
      },
    }),
  };
};
