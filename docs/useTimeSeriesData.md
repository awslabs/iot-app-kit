## [This documentation is deprecated: instead visit the IoT App Kit Docs](https://awslabs.github.io/iot-app-kit/)

# useTimeSeriesData react hook (feature in development)

The `useTimeSeriesData` react hook is a function which allows you to easily utilize time series data within your react components from IoT App Kit datasources.

NOTE: This documentation assumes you are familiar with react and react-hooks. If you need to brush up, learn more at https://reactjs.org/docs/hooks-intro.html

## Basic example usage

The simplest use of the `useTimeSeriesData` is to provide a query for time series data, which will return you the time series data streams
for the queried data.

Learn more about viewport groups at the [Viewport Manager documentation](https://github.com/awslabs/iot-app-kit/tree/main/docs/ViewportManager.md).

```
    import { useTimeSeriesData } from '@iot-app-kit/react-components';
    const { dataStreams } = useTimeSeriesData({ query });
```

A common use case of this hook is to construct an IoT App Kit visualizaiton, which may look simillar to the below example:
```
//jsx
const CustomVisualization = () => {
    const { dataStreams } = useTimeSeriesData({ query });
    return <VisualizationComponent dataStreams={dataStreams} />
}
```

which will be used as shown below:

```
imoprt { ViewportManager } from '@iot-app-kit/react-components';
imoprt { initialize } from '@iot-app-kit/datasource-iotsitewise'; // Or any datasource that allows querying for time series data
const { IoTSiteWiseClient } = require('@aws-sdk/client-iotsitewise');
const iotsitewiseClient = new IoTSiteWiseClient({ region: "REGION" }); // And need to use a credential provider, learn more at https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_credential_providers.html

const { query } = initialize({ iotsitewiseClient });

// jsx
<ViewportManager initialViewport={{ duration: '5m' }}>
  <CustomVisualization 
    query={
      query.timeSeriesData({ 
        assets: [{ 
          assetId: 'windmill', 
          properties: [{ propertyId: 'rpm' }]
        }]
      })
    }
  />
  
  <CustomVisualization 
    query={
      query.timeSeriesData({ 
        assets: [{ 
          assetId: 'windmill', 
          properties: [{ propertyId: 'wattage' }]
        }]
      })
    }
  />
<ViewportManager />
```

This above example gives you two visualizations which will share a viewport group (so if )


Additionally, the hook can be used without a `<ViewportManager />` by explicitly passing in a viewport. This is useful for simple use cases where
you don't need to be able to synchronize a group of IoT App Kit components to display the same visualization. This is achieved as shown below:
```
//jsx
const CustomVisualization = ({ query, viewport }) => {
    const { dataStreams } = useTimeSeriesData({ query, viewport });
    return <VisualizationComponent dataStreams={dataStreams} />
}
```

And the utilization of this custom component will look as shown below:

```
// jsx
<CustomVisualization
  viewport={{ duration: '5m' }}}
  query={
    query.timeSeriesData({
    assets: [{
    assetId: 'windmill',
    properties: [{ propertyId: 'wattage' }]
    }]
  })
  }
/>
```

This will give you a single visualization displaying the last 5 minutes of data real time the SiteWise data source.

This same component can also be used without a viewport, as the `useTimeSeries` will still fallback to the viewport group if the `viewport` parameter passed into `useTimeSeriesData` is undefined. This is a best practice of IoT App Kit component, to support both viewport groups and explicitly passed in viewports, and `useTimeSeriesData` gives you this behavior without any additional effort.

## Kitchen sink example (utilization with all features)

```
// jsx
const MyVisualization = ({ query, viewport, styles }) => {
  const { datastreams } = useTimeSeriesData({
    // The timeseries data query from any data source of your choosing. Visualizations constructing with this hook will automatically work for any time series data source.
    query,
    
    // Optional explicit viewport when opting out of a viewport group, or not using a viewport group. Overrides any viewport group specified.
    viewport,
    
    // A specification of styles to associate to the returned data streams. useful for things such as specifying line colors to be associated with queried data.
    styles,
    
    // Configuration on what data is requested, and how its requested.
    settings: {
      // Higher buffer will lead to more off-viewport data to be requested. Useful for panning/zoom gestures
      requestBuffer: 0.2, // 20% buffer

      // refresh rate in milliseconds for how frequently to request data if applicable to the datasource
      refreshRate: 1000,
      
      // The 'resolution' which we want the data to be displayed at. For example, raw data, 1 minute aggregated, hourly aggregated, etc.
      // Must be a resolution supported by your datasource. Full options contained in the data sources documentation you are utilizing.
      // If left undefined, will automatically choose a supported resolution based on the duration of the viewport.
      resolution: '1m', 

      // Specifies that all the data points within the viewport are to be fetched
      fetchFromStartToEnd: true,
      
      // Specifies that the most recent data point before the viewport is fetched. Useful for some visualizations, such as a line chart to draw the connecting line between the first data point present on the chart.
      fetchMostRecentBeforeStart: true,
      
      // Specifies that the most recent data point contained within the viewport. Useful for visualizations that only need a single data point, like a KPI, or Status.
      fetchMostRecentBeforeEnd: true,
    },
  })
  
  return <VisualizationWidget dataStreams={dataStreams}} />
}
```