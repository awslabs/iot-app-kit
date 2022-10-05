# AWS IoT TwinMaker source

The AWS IoT TwinMaker source enables you to visualize your [AWS IoT TwinMaker](https://docs.aws.amazon.com/iot-twinmaker/latest/guide/what-is-twinmaker.html) data and digital twins.

You can follow [AWS IoT TwinMaker Getting Started](https://github.com/aws-samples/aws-iot-twinmaker-samples) to setup a sample TwinMaker workspace.

## Setting up the AWS IoT TwinMaker source

1. Install the dependency using npm:

```sh
npm install --save @iot-app-kit/source-iottwinmaker
```

2. Choose one of the following to initialize the AWS IoT TwinMaker source:

   1. Initialize with aws client instances.

      - Required aws clients:

        [@aws-sdk/client-iottwinmaker](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-iottwinmaker/index.html)

        [@aws-sdk/client-iotsitewise](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-iotsitewise/index.html)

        [@aws-sdk/client-kinesis-video](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-kinesis-video/index.html)

        [@aws-sdk/client-kinesis-video-archived-media](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-kinesis-video-archived-media/index.html)

        [@aws-sdk/client-s3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/index.html)

      - Sample code:

        ```ts
        import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
        import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
        import { KinesisVideoClient } from '@aws-sdk/client-kinesis-video';
        import { KinesisVideoArchivedMediaClient } from '@aws-sdk/client-kinesis-video-archived-media';
        import { S3Client } from '@aws-sdk/client-s3';

        import { initialize } from '@iot-app-kit/source-iottwinmaker';

        const iotTwinMakerClient = new IoTTwinMakerClient({ ... });
        const iotSiteWiseClient = new IoTSiteWiseClient({ ... });
        const kinesisVideoClient = new KinesisVideoClient({ ... });
        const kinesisVideoArchivedMediaClient = new KinesisVideoArchivedMediaClient({ ... });
        const s3Client = new S3Client({ ... });

        const { query } = initialize('twin-maker-workspace-id', {
          iotSiteWiseClient,
          iotTwinMakerClient,
          kinesisVideoClient,
          kinesisVideoArchivedMediaClient,
          s3Client,
        });
        ```

   2. Initialize with aws region and [Credentials](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/interfaces/_aws_sdk_types.credentials-1.html) or [CredentialProvider](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_types.html#credentialprovider-1)

      - [@aws-sdk/credential-providers](https://www.npmjs.com/package/@aws-sdk/credential-providers) can be used to create credential providers.

      - Sample code:

        ```ts
        import { fromCognitoIdentity } from "@aws-sdk/credential-providers";
        import { initialize } from '@iot-app-kit/source-iottwinmaker';

        const { query } = initialize('twin-maker-workspace-id', { awsCredentials: fromCognitoIdentity(...), awsRegion: 'REGION' });
        ```

   3. Initialize with a combination of previous options:

      - Sample code:

        ```ts
        import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
        import { fromCognitoIdentity } from "@aws-sdk/credential-providers";

        import { initialize } from '@iot-app-kit/source-iottwinmaker';

        const iotTwinMakerClient = new IoTTwinMakerClient({ ... });

        const { query } = initialize('twin-maker-workspace-id', {
          awsCredentials: fromCognitoIdentity(...),
          awsRegion: 'REGION',
          iotTwinMakerClient,
        });
        ```

---

## `query`

The queries that you can use to fetch AWS IoT TwinMaker data.

Queries are available upon initialization of the AWS IoT TwinMaker source.

```ts
import { initialize } from '@iot-app-kit/source-iottwinMaker';

const { query } = initialize( ... );
```

### `timeSeriesData`

A method that is used to construct the query to process AWS IoT TwinMaker time series data.

Type: Function
- Parameter: `TwinMakerEntityHistoryQuery` | `TwinMakerComponentHistoryQuery` - the inputs used to send request
- ReturnType: `TimeQuery`

#### `TwinMakerEntityHistoryQuery`

The query parameters to get the history data for an entity from AWS IoT TwinMaker.

`entityId`

The `entityId` field of the AWS IoT TwinMaker entity to be queried

Type: String

`componentName`

The `componentName` field of one of the components of the requested entity to be queried

Type: String

`properties`

One or more properties of the requested component to be queried

Type: Array

Each property contains the following fields:

- `propertyName`

  The name of the property to be queried.

  Type: String

- `refId`

  (Optional) The reference ID of the style settings. IoT App Kit applies the style settings to the property associated with the reference ID. Every component has different style settings.

  Type: String

**Query construction example**

```ts
query.timeSeriesData({
  entityId: 'entity-id',
  componentName: 'component-name',
  properties: [{ propertyName: 'property-name', refId: 'my-property-ref' }],
});
```

#### `TwinMakerComponentHistoryQuery`

The query parameters to get the history data for a component type from AWS IoT TwinMaker.

`componentTypeId`

The ID of the AWS IoT TwinMaker component type to be queried

Type: String

`properties`

One or more properties of the requested component to be queried

Type: Array

Each property contains the following fields:

- `propertyName`

  The name of the property to be queried.

  Type: String

- `refId`

  (Optional) The reference ID of the style settings. IoT App Kit applies the style settings to the property associated with the reference ID. Every component has different style settings.

  Type: String

**Query construction example**

```ts
query.timeSeriesData({
  componentTypeId: 'component-type-id',
  properties: [{ propertyName: 'property-name', refId: 'my-property-ref' }],
});
```

---

## `s3SceneLoader`

The loader class to fetch the AWS IoT TwinMaker scene metadata and content that's stored in S3.

This class is primarily to be utilized by the `SceneView` component from `iot-app-kit/scene-composer` package, and is available upon initialization of the AWS IoT TwinMaker source.

```ts
import { initialize } from '@iot-app-kit/source-iottwinMaker';

const { s3SceneLoader } = initialize( ... );
```

Type: Function
- Parameter: `sceneId` - the ID of the AWS IoT TwinMaker scene to be loaded
- ReturnType: `SceneLoader`

### `SceneLoader`

The interface of the class to load scene metadata and content.

#### `getSceneUri`

The function to fetch the scene metadata, generate the uri for the scene file and return.

Type: Function
- ReturnType: `Promise<string | null>`
  - Resolves with `null` when data is missing to generate a proper uri
  - Example output: `s3://bucket-name/scene.json`

#### `getSceneObject`

The function to download scene file or objects specified by the `uri` from S3.

Type: Function
- Parameter: `uri` - the uri of the object to be downloaded from S3.
- ReturnType: `Promise<ArrayBuffer> | null`
  - Returns `null` when the `uri` is invalids

---

## `videoData`

The class to fetch the metadata for the video stream coming directly from the Kinesis Video Streams or as defined in the AWS IoT TwinMaker entity.

This class is primarily to be utilized by the `VideoPlayer` component from `iot-app-kit/react-components` package, and is available upon initialization of the AWS IoT TwinMaker source.

```ts
import { initialize } from '@iot-app-kit/source-iottwinMaker';

const { videoData } = initialize( ... );
```

Type: Function
- Parameter: `videoDataProps` - this is of type `VideoDataProps` which provides information about the video stream and related AWS IoT TwinMaker component
- ReturnType: `VideoData`

### `VideoDataProps`

`kvsStreamName`

The video stream name of the desired Kinesis Video Streams

Type: String

`entityId`

The `entityId` field of the AWS IoT TwinMaker entity having the video component

Type: String

`componentName`

The `componentName` field of one of the video components of the referenced entity

Type: String

`sitewiseAssetId`

The value of the property `sitewiseAssetId` of the AWS IoT SiteWise asset associated with the AWS IoT TwinMaker video component

Type: String

`videoUploadRequestPropertyId`

The value of the property `VideoUploadRequest` of the AWS IoT SiteWise asset associated with the AWS IoT TwinMaker video component

Type: String

### `VideoData`

The interface of the class to fetch the video metadata and handle the video source related operations.

#### `getKvsStreamSrc`

The function to fetch the the HTTP Live Streaming (HLS) URL for the video stream.

Type: Function
- ReturnType: `Promise<string | undefined>`
  - Resolves with `undefined` when video stream information is not found
  - Example output: `https://example.com/sample-video.m3u8`

#### `getAvailableTimeRanges`

The function to get the list of available time ranges for the video streams.

Type: Function
- Parameter:
  - `startTime` - intended start time for the video playback
    Type: Date
  - `endTime` - intended end time for the video playback
    Type: Date
- ReturnType: `Promise<[{ start: number; end: number; src: string }[], { start: number; end: number }[]] | undefined>`
  - Returns two arrays
    - First with the information of all the video sources available in Kinesis Video Streams for playback
    - Second with the list of start and end times when the video is captured and is available on the edge
  - Returns `undefined` when an invalid AWS IoT TwinMaker component is referenced in the VideoData

#### `triggerLiveVideoUpload`

The function to trigger the video upload request from edge to Kinesis Video Streams for `LIVE` playback.

Type: Function
- ReturnType: `Promise<void>`

#### `triggerOnDemandVideoUploadRequest`

The function to trigger the video upload request from edge to Kinesis Video Streams for a specified time range.

Type: Function
- Parameter:
  - `startTimestamp` - intended start timestamp for the video upload request
    Type: String
  - `endTimestamp` - intended end timestamp for the video upload request
    Type: String
- ReturnType: `Promise<void>`

---
