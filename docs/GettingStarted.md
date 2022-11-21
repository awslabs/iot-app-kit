# Getting started with IoT Application Kit 

Use the step-by-step tutorial in this section to learn how to set up IoT Application Kit. 

1. Install the required dependencies
    To install by using npm, run the following command.
    1. `npm install --save @iot-app-kit/source-iotsitewise`
    1. `npm install --save @iot-app-kit/source-iottwinmaker`
    1. `npm install --save @iot-app-kit/components`
    1.  If you want to use React: `npm install --save @iot-app-kit/react-components`
    1. `npm install --save @iot-app-kit/scene-composer`
2. To initialize the AWS IoT SiteWise source, choose one of the following. 
    1. To initialize an instance of [@aws-sdk/client-iotsitewise](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-iotsitewise/index.html), use the following sample code.

    ```ts
    import { initialize } from '@iot-app-kit/source-iotsitewise';

    const { IoTSiteWiseClient } = require("@aws-sdk/client-iotsitewise");

    const iotSiteWiseClient = new IoTSiteWiseClient({ region: "REGION" });

    const { query } = initialize({ iotSiteWiseClient });
    ```

    2. To initialize an instance of [@aws-sdk/credential-providers](https://www.npmjs.com/package/@aws-sdk/credential-providers), use the following sample code, but replace the credential provider with the one you wish to utilize: 

    ```ts
    import { initialize } from '@iot-app-kit/source-iotsitewise';
    import { fromCognitoIdentity } from "@aws-sdk/credential-providers";

    const { query } = initialize({ awsCredentials: fromCognitoIdentity(...) });
    ```

3. Include the style sheets somewhere in your application

```ts
import "@iot-app-kit/components/styles.css";
```

4. To mount the component, use the following sample code. 

```tsx
import { initialize } from '@iot-app-kit/source-iotsitewise';
import { LineChart, WebglContext } from '@iot-app-kit/react-components';
const { IoTSiteWiseClient } = require("@aws-sdk/client-iotsitewise");

const iotSiteWiseClient = new IoTSiteWiseClient({ region: "REGION" });
const { query } = initialize({ iotSiteWiseClient });

// React component example
<LineChart
  queries={[
    query.timeSeriesData(
      {
        assets: [{
          // Replace sitewse-asset-id with the ID of your AWS IoT SiteWise asset. 
          assetId: 'sitewise-asset-id',
          // Replace property-id with the ID of your AWS IoT SiteWise asset property. 
          properties: [{ propertyId: 'property-id' }],
        }]
      }
    )
  ]}
/>
<WebglContext />

// Web component example
const { defineCustomElements } = require('@iot-app-kit/components/loader');
defineCustomElements();

<iot-line-chart
  queries={[
    query.timeSeriesData(
      {
        assets: [{
          // Replace sitewse-asset-id with the ID of your AWS IoT SiteWise asset. 
          assetId: 'sitewise-asset-id',
          // Replace property-id with the ID of your AWS IoT SiteWise asset property. 
          properties: [{ propertyId: 'property-id' }],
        }]
      }
    )
  ]}
/>
<iot-webgl-context />
```
The IoT App Kit components are all supported broadly across all modern browsers, including IE11. Due to usage of WebGL, users with misconfigured or missing graphics drivers may face problems when utilizing IoT App Kit components which utilize WebGL. Components which require WebGL will specify in their components documentation.


5. To initialize the AWS IoT TwinMaker source with [@aws-sdk/credential-providers](https://www.npmjs.com/package/@aws-sdk/credential-providers), use the following sample code, but replace the credential provider with the one you wish to utilize: 

```ts
import { initialize } from '@iot-app-kit/source-iottwinmaker';
import { fromCognitoIdentity } from "@aws-sdk/credential-providers";

// Replace twin-maker-workspace-id with the ID of your AWS IoT TwinMaker workspace, and replace
// REGION with the region of your workspace.
const { query } = initialize('twin-maker-workspace-id', { awsCredentials: fromCognitoIdentity(...), awsRegion: 'REGION' });
```

6. To mount the SceneViewer component, use the following sample code. 

```tsx
import { initialize, TwinMakerQuery } from '@iot-app-kit/source-iottwinmaker';
import { SceneViewer } from '@iot-app-kit/scene-composer';

const { query, s3SceneLoader } = initialize( ... );
// Replace scene-id with the ID of your AWS IoT TwinMaker scene in the workspace.
const sceneLoader = s3SceneLoader('scene-id');
const queries: TwinMakerQuery[] = [
  {
    // Replace entity-id with the ID of your AWS IoT TwinMaker entity in the workspace.
    entityId: 'entity-id',
    // Replace component-name with the name of the component for your entity.
    componentName: 'component-name',
    // Replace property-name with the name of the property for your component.
    properties: [{ propertyName: 'property-name' }],
  },
  {
    // Replace component-type-id with the ID of your concrete AWS IoT TwinMaker component type in the workspace.
    componentTypeId: 'component-type-id',
    // Replace property-name with the name of the property for your component type.
    properties: [{ propertyName: 'property-name' }],
  },
];
const viewport = {
  // Replace start-time with the start time to query data from your workspace.
  start: new Date('start-time'),
  // Replace end-time with the end time to query data from your workspace.
  end: new Date('end-time'),
};

// React component example
<SceneViewer 
  sceneLoader={sceneLoader}
  queries={queries}
  viewport={viewport}
/>
```

7. To mount the VideoPlayer component, use the following sample code. 
```tsx
import { initialize } from '@iot-app-kit/source-iottwinmaker';
import { VideoPlayer } from '@iot-app-kit/react-components';

const videoData = initialize( ... ).videoData({
  // Replace entity-id with your AWS IoT TwinMaker entity that has KinesisVideoStream component
  entityId: 'entity-id',
  // Replace component-name with the name of the component for your entity that has KinesisVideoStreamName property
  componentName: 'component-name',
});
// or
const videoData = initialize( ... ).videoData({
  // Replace kvs-stream-name with your KinesisVideo stream name
  kvsStreamName: 'kvs-stream-name',
});

// Video player for On-Demand playback mode with specified start and end time
<VideoPlayer
  videoData={videoData}
  // Replace start-time and end-time with the correct time to play the video.
  viewport={{ start: new Date('start-time'), end: new Date('end-time') }}
/>

// Video player for Live playback mode
<VideoPlayer
  videoData={videoData}
  viewport={{ duration: '0' }}
/>
```
