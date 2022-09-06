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

IoT App Kit is flexible in how you create a data-source. The bare minimum to create a data-source which provides time series data, is to make a package which exposes a `query` object which contains the `timeSeriesData` field with the correct type:

```
import { TimeQuery, TimeSeriesData, TimeSeriesDataRequest, ProviderWithViewport } from '@iot-app-kit/core';

export {
  query: {
    timeSeriesData: (query: MyCustomQuery): TimeQuery<TimeSeriesData[], TimeSeriesDataRequest> => ({
      build: (sessionId: string, params: TimeSeriesDataRequest): ProviderWithViewport<TimeSeriesData[]> => /* your custom implementation here */
    }),
  }
}
```

The code example should the top level export, which contains the `query` object. `timeSeriesData` field within the `query` object contains the standardized format for users of your data-source to construct queries that provide time series data. These queries will be able to be utilized in all of the
components which visualize time series data, such as the line chart, KPI, etc..

In the above code example, you will see the type `MyCustomQuery`, replace this with the query format your data source expects. Each data-source can define its own query format.

## Utilizing TimeSeriesDataModule
the `@iot-app-kit/core` contains a `TimeSeriesDataModule` which you can choose to utilize to help construct your `timeSeresData` queries. It is not mandatory to utilize `TimeSeiesDataModule` to build out a time series data module - and only makes sense for certain data sources. If you choose not to use it, you can simply create an implementation
which adheres to the interface and respects the expectations around how the `DataStream`s are constructed.

### What does the TimeSeriesDataModule do for me?

The TimeSeriesDataModule handles features such as caching, TTL, reoccurring data-requests, etc. Some of this is outlined within the [time series features section](./TimeSeriesDataFeatures.md).

The TimeSeriesDataModule allows you to only specify how to interpret a query, and how to initiate a request - and leaves the management of all the details of caching, when to request, etc. to the TimeSeriesDataModule

### Should I use the TimeSeriesDataModule

TimeSeriesDataModule only makes sense for data-sources which are polling based. If you have a push based data-source, then you should not use the TimeSeriesDataModule.

### How to utilize the TimeSeriesDataModule

To utilize the `TimeSeriesDataModule`, you must pass in at a minimum, the information on how to interpret a query, and how to initiate a request based on `RequestInformation`s.

```
import { TimeSeriesDataModule } from '@iot-app-kit/core';

const timeSeriesDataModule = new TimeSeriesDataModule({
  intiateRequest: ({ request, query, onSuccess, onError }, requestInformations) => { /** Perform your either async, or synchronous processes and construct the time series in the correct format and pass back to `onSuccess` when ready **/}
  getRequestsFromQuery: ({ query, request }) => /* return requestInformations which specifies what information is expected to be returned based on the query provided */
});
```

You can see an example of the TimeSeriesDataProvider being used to construct a time series data source within https://github.com/awslabs/iot-app-kit/blob/6481ec2c037577ef16d57bf821d6dea421f79df0/packages/source-iotsitewise/src/time-series-data/provider.ts.

## Community supported sources

Community supported sources are sources that live within the official [IoT App Kit GitHub repository](https://github.com/awslabs/iot-app-kit/), and will have a npm package under the `@iot-app-kit` name space, with a name following the pattern `@iot-app-kit/source-$SOURCE_NAME`.

If you are interested in adding a community supported source, create an issue on the GitHub and our team will provide guidance and assistance on making that happen.
