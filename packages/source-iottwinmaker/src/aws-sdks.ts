import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { KinesisVideoClient } from '@aws-sdk/client-kinesis-video';
import { KinesisVideoArchivedMediaClient } from '@aws-sdk/client-kinesis-video-archived-media';
import { S3Client } from '@aws-sdk/client-s3';
import { Credentials, Provider } from '@aws-sdk/types';

const DEFAULT_REGION = 'us-east-1';

export const twinMakerSdk = (credentials: Credentials | Provider<Credentials>, awsRegion?: string, endpoint?: string) =>
  new IoTTwinMakerClient({
    region: awsRegion || DEFAULT_REGION,
    endpoint,
    credentials,
  });

export const sitewiseSdk = (credentials: Credentials | Provider<Credentials>, awsRegion?: string) =>
  new IoTSiteWiseClient({
    region: awsRegion || DEFAULT_REGION,
    endpoint: `https://iotsitewise.${awsRegion || DEFAULT_REGION}.amazonaws.com/`,
    credentials,
  });

export const kinesisVideoSdk = (credentials: Credentials | Provider<Credentials>, awsRegion?: string) =>
  new KinesisVideoClient({
    region: awsRegion || DEFAULT_REGION,
    credentials,
  });

export const kinesisVideoArchivedMediaSdk = (credentials: Credentials | Provider<Credentials>, awsRegion?: string) =>
  new KinesisVideoArchivedMediaClient({
    region: awsRegion || DEFAULT_REGION,
    credentials,
  });

export const s3Sdk = (credentials: Credentials | Provider<Credentials>, awsRegion?: string) =>
  new S3Client({
    region: awsRegion || DEFAULT_REGION,
    credentials,
  });
