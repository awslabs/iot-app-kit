# Getting started with IoT Application Kit 

Use the step-by-step tutorial in this section to learn how to set up IoT Application Kit. 

1. Install the required dependencies
    To install by using npm, run the following command.
    1. `npm install --save @iot-app-kit/source-iotsitewise`
    1. `npm install --save @iot-app-kit/components`
    1.  If you want to use React: `npm install --save @iot-app-kit/react-components`
2. To initialize the AWS IoT SiteWise source, choose one of the following. 
    1. To initialize an instance of [@aws-sdk/client-iotsitewise](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-iotsitewise/index.html), use the following sample code.

            import { initialize } from '@iot-app-kit/source-iotsitewise';

            const { IoTSiteWiseClient } = require("@aws-sdk/client-iotsitewise");

            const iotsitewiseClient = new IoTSiteWiseClient({ region: "REGION" });

            const { query } = initialize({ iotsitewiseClient });

    2. To initialize an instance of [@aws-sdk/credential-providers](https://www.npmjs.com/package/@aws-sdk/credential-providers), use the following sample code, but replace the credential provider with the one you wish to utilize: 

            import { initialize } from '@iot-app-kit/source-iotsitewise';
            import { fromCognitoIdentity } from "@aws-sdk/credential-providers";

            const { query } = initialize({ awsCredentials: fromCognitoIdentity(...) });


3. Include the style sheets somewhere in your application

```
import "@iot-app-kit/components/styles.css";
```

4. To mount the component, use the following sample code. 

        import { initialize } from '@iot-app-kit/source-iotsitewise';
        import { LineChart, WebglContext } from '@iot-app-kit/react-components';
        const { IoTSiteWiseClient } = require("@aws-sdk/client-iotsitewise");

        const iotsitewiseClient = new IoTSiteWiseClient({ region: "REGION" });
        const { query } = initialize({ iotsitewiseClient });

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

The IoT App Kit components are all supported broadly across all modern browsers, including IE11. Due to usage of WebGL, users with misconfigured or missing graphics drivers may face problems when utilizing IoT App Kit components which utilize WebGL. Components which require WebGL will specify in their components documentation.


