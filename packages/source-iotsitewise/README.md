## Licensing
Amazon is planning to release this code under an open source license to the general public in the future.  As a condition of accessing and using this code prior to its public open source release, you agree that until such public open source release (i) this code is considered as Amazon’s Confidential Information under your MNDA with Amazon and you may not disclose any information about this code or redistribute any portion of this code to any third party, and (ii) your rights to use, copy, and prepare Derivative Works of the code are limited to internal uses only.  If you do not agree with these terms, you may not access or use the code.  These terms must accompany all copies of the code that you distribute internally until the public open source release.  Subject to your compliance with the above terms, this code is provided to you under the terms of the Apache 2.0 license.

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
