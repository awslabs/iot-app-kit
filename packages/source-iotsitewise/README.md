# `@iot-app-kit/source-iotsitewise`

The AWS IoT SiteWise source enables you to visualize and interact with your [AWS IoT SiteWise](https://docs.aws.amazon.com/iot-sitewise/latest/userguide/what-is-sitewise.html) data and assets. 

## Usage

```
import { initialize } from '@iot-app-kit/source-iotsitewise
import { fromEnv } from "@aws-sdk/credential-providers";

const { query } = initialize({
  awsCredentials: fromEnv()
});

// use sitewise queries in app kit components
<iot-line-chart
  viewport={{ duration: '10m' }}
  
  queries={[
    query.timeSeriesData({
      assets: [{ 
        assetId: 'engine-turbine', 
        properties: [
          { propertyId: 'temperature' }, 
          { propertyId: 'rpm', resolution: '0' }
        ]
      }]
    }, {
      refreshRate: 1000, // In milliseconds
    })
  ]}
/> 

```
