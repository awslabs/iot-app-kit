## [This documentation is deprecated: instead visit the IoT App Kit Docs](https://awslabs.github.io/iot-app-kit/)

# Video Player

The VideoPlayer component allows you to stream a video from the Kinesis Video Streams. It supports the following configuration:

- Simple Mode: Stream the video from the Kinesis Video Streams using the provided stream name
- AWS IoT TwinMaker Mode: Video player is provided with the `entityId` and `componentName` from an AWS IoT TwinMaker workspace. Video player determines the required information using provided inputs and streams the video. Details can be found at [AWS IoT TwinMaker video integration](https://docs.aws.amazon.com/iot-twinmaker/latest/guide/video-integration.html).

## Setup

There is sample code in [examples/react-app](https://github.com/awslabs/iot-app-kit/tree/main/examples/react-app) that shows how to use this component in detail.

### Basic React component example

```tsx
import { initialize } from '@iot-app-kit/source-iottwinmaker';
import { VideoPlayer } from '@iot-app-kit/react-components';

const videoData = initialize({ ... }).videoData({
    entityId: 'twinmakerEntityId',
    componentName: 'twinmakerComponentName',
    kvsStreamName: 'sample-kvs-stream',
});

// Video player for On-Demand playback mode with specified start and end time
<VideoPlayer
  videoData={videoData}
  viewport={{ start: startTime, end: endTime }}
/>

// Video player for Live playback mode
<VideoPlayer
  videoData={videoData}
  viewport={{ duration: '0' }}
/>
```

## Properties

The VideoPlayer component contains the following properties that you can customize.

### `videoData`

The class to fetch the video metadata and handle the video source related operations.

**Note: When a new instance of this object is passed in, the VideoPlayer will trigger a new loading of the video stream. Therefore, do not recreate this object when not needed.**

Type: `VideoData` defined in `@iot-app-kit/source-iottwinmaker`

### `viewport`

Specifies the time range for video playback.

Type: `Viewport` defined in `@iot-app-kit/core`

Example:

```tsx
// On-Demand mode with specific start and end times
const startTime = new Date(1661470165);
const endTime = new Date(1661471180);
const viewport = {{ start: startTime, end: endTime }};

// Live mode to play video from now
const viewport = {{ duration: '0' }};
```

---

# Video Upload Request

The RequestVideoUpload component allows you to send a request to upload video from edge to the Kinesis Video Streams. This is used in case of an Edge Video component from an AWS IoT TwinMaker workspace where the video can be available on the edge, but not available for streaming. The newly uploaded video can be streamed by the `VideoPlayer` component from Kinesis Video Streams once available. More details about the Edge Video component can be found [here](https://docs.aws.amazon.com/iot-twinmaker/latest/guide/video-integration.html).

## Setup

There is sample code in [examples/react-app](https://github.com/awslabs/iot-app-kit/tree/main/examples/react-app) that shows how to use this component in detail.

### Basic React component example

```tsx
import { initialize } from '@iot-app-kit/source-iottwinmaker';
import { RequestVideoUpload } from '@iot-app-kit/react-components';

const videoData = initialize({ ... }).videoData({
    entityId: 'twinmakerEntityId',
    componentName: 'twinmakerEdgeVideoComponentName',
    kvsStreamName: 'sample-kvs-stream',
});

<RequestVideoUpload
  videoData={videoData}
/>
```

## Properties

The RequestVideoUpload component contains the following properties that you can customize.

### `videoData`

The class to fetch the video metadata and handle the video source related operations.

Type: `VideoData` defined in `@iot-app-kit/source-iottwinmaker`
