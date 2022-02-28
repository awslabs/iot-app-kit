# Getting started with IoT Application Kit 

Use the step-by-step tutorial in this section to learn how to set up IoT Application Kit. 

1. To install the `@iot-app-kit/source-iotsitewise` module, choose one of the following.
    1.  To install by using npm, run the following command. 
        1. `npm install --save @iot-app-kit/source-iotsitewise  `
    2. To install by using Yarn, run the following command. 
        1. `yarn add @iot-app-kit/source-iotsitewise `
2. To initialize the AWS IoT SiteWise source, choose one of the following. 
    1. To initialize an instance of [@aws-sdk/client-iotsitewise](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-iotsitewise/index.html), use the following sample code.

            import { initialize } from '@iot-app-kit/source-iotsitewise';

            const { IoTSiteWiseClient } = require("@aws-sdk/client-iotsitewise");

            const iotsitewiseClient = new IoTSiteWiseClient({ region: "REGION" });

            const { query } = initialize({ iotsitewiseClient });

    2. To initialize an instance of [@aws-sdk/credential-providers](https://www.npmjs.com/package/@aws-sdk/credential-providers), use the following sample code. 

            import { initialize } from '@iot-app-kit/source-iotsitewise';
            import { fromCognitoIdentity } from "@aws-sdk/credential-providers";

            const { query } = initialize({ awsCredentials: fromCognitoIdentity(...) });

    3. To set up a simple development environment, use the credential provider [fromEnv](https://www.npmjs.com/package/@aws-sdk/credential-providers#fromenv). 

            import { initialize } from '@iot-app-kit/source-iotsitewise';
            import { fromEnv } from "@aws-sdk/credential-providers";

            const { query } = initialize({ awsCredentials: fromEnv() });

3. To mount the component, use the following sample code. 

        import { initialize } from '@iot-app-kit/source-iotsitewise';
        import { LineChart, WebGLContext } from '@iot-app-kit/react-components';
        import { fromEnv } from "@aws-sdk/credential-providers";

        // initialize source-iotsitewise
        const { query } = initialize({
          awsCredentials: fromEnv()
        });

        // React component example
        <LineChart
          queries={[
            query.timeSeriesData([
              {
                // Replace sitewse-asset-id with the ID of your AWS IoT SiteWise asset. 
                assetId: 'sitewise-asset-id',
                // Replace property-id with the ID of your AWS IoT SiteWise asset property. 
                properties: [{ propertyId: 'property-id' }],
              }
            ])
          ]}
        />
        <WebGLContext />

        // Web component example
        <iot-line-chart
          queries={[
            query.timeSeriesData([
              {
                 // Replace sitewse-asset-id with the ID of your AWS IoT SiteWise asset. 
                assetId: 'sitewise-asset-id',
                // Replace property-id with the ID of your AWS IoT SiteWise asset property. 
                properties: [{ propertyId: 'some-property' }],
              }
            ])
          ]}
        />
        <iot-webgl-context />

The IoT App Kit components are all supported broadly across all modern browsers, including IE11. Due to usage of WebGL, users with misconfigured or missing graphics drivers may face problems when utilizing IoT App Kit components which utilize WebGL. Components which require WebGL will specify in their components documentation.


