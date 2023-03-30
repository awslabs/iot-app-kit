## [This documentation is deprecated: instead visit the IoT App Kit Docs](https://awslabs.github.io/iot-app-kit/)

# Custom sources

IoT App Kit is extensible, this means that most IoT App Kit components can work with any data source which provides the correct type of data. These data-sources can be found within IoT App Kit itself, or custom data sources you implement.

**Example usage of a custom source**

```
import { LineChart } from '@iot-app-kit/react-components';
import { initialize } from 'my-custom-source';

const { query } = initialize({ // your custom initialize parameters })

// jsx
<LineChart
  queries={[query.timeSeriesData({ mqtt: 'some-topic' })]}
/>
```

## Creating a custom source

IoT App Kit is flexible in how you create a data-source. Creating a time series data source requires you to be consistent with the interfaces and implement the time series data settings in a way that obeys their contract.

The bare minimum to create a data-source which provides time series data, is to make a package which exposes a `query` object which contains the `timeSeriesData` field with the correct type:

```
import { TimeQuery, TimeSeriesData, TimeSeriesDataRequest, ProviderWithViewport } from '@iot-app-kit/core';

export {
  query: {
    timeSeriesData: (query: MyCustomQuery): TimeQuery<TimeSeriesData[], TimeSeriesDataRequest> => ({
      build: (sessionId: string, params: TimeSeriesDataRequest): ProviderWithViewport<TimeSeriesData[]> => /* your custom implementation here */
      toQueryString: () => JSON.stringify({ source: 'my-custom-source', query }),
    }),
  }
}
```

The code example should the top level export, which contains the `query` object. `timeSeriesData` field within the `query` object contains the standardized format for users of your data-source to construct queries that provide time series data. These queries will be able to be utilized in all of the
components which visualize time series data, such as the line chart, KPI, etc..

In the above code example, you will see the type `MyCustomQuery`, replace this with the query format your data source expects. Each data-source can define its own query format.

## Community supported sources

Community supported sources are sources that live within the official [IoT App Kit GitHub repository](https://github.com/awslabs/iot-app-kit/), and will have a npm package under the `@iot-app-kit` name space, with a name following the pattern `@iot-app-kit/source-$SOURCE_NAME`.

If you are interested in adding a community supported source, create an issue on the GitHub and our team will provide guidance and assistance on making that happen.
