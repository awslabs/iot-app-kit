# Custom sources

IoT App Kit components can accept time-series data from your own custom data sources.

**Example custom source**

```
import { LineChart } from '@iot-app-kit/react-components';
import { initialize } from 'my-custom-source';

const { query } = initialize({ // your custom initialize parameters })

// jsx
<LineChart
  queries={[query.timeSeriesData({ mqtt: 'some-topic' })]}
/>
```

### Requirements

To use custom sources, you must provide components with a `query` that contains the `timeSeriesData` method and the interface. An example of an implementation can be found in the [AWS IoT SiteWise source](https://github.com/awslabs/iot-app-kit/blob/main/packages/source-iotsitewise/src/initalize.ts).

Custom sources manage their own authentication in the way that fits their source, and can export additional source specific methods, as well as other non-query based methods to help work with the source which are source specific.

### Community supported sources

Community supported sources are sources that live within the official [IoT App Kit GitHub repository](https://github.com/awslabs/iot-app-kit/), and will have a npm package under the `@iot-app-kit` name space, with a name following the pattern `@iot-app-kit/source-$SOURCE_NAME`.

If you are interested in adding a community supported source, create an issue on the GitHub and our team will provide guidance and assistance on making that happen.
