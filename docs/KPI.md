# KPI

The Key Performance Indicator (KPI) component provides a compact representation when you need an overview of your asset properties. This overview gives you the most critical insights into the overall performance of your devices, equipment, or processes. With the KPI, you can interact with IoT data from one or more data sources.

The status grid only supports showing the latest value. If the `viewport` is configured to visualize historical data, the KPI displays the disabled state.

To view and interact with a KPI example, visit [KPI](https://synchrocharts.com/#/Components/KPI) in the Synchro Charts documentation.

## Examples

#### React component example

```
import { initialize } from '@iot-app-kit/source-iotsitewise';
import { KPI } from '@iot-app-kit/react-components';
import { fromEnv } from "@aws-sdk/credential-providers";

const { query } = initialize({
  awsCredentials: fromEnv()
});

// jsx
<KPI
  queries={[
    query.timeSeriesData([
      { 
        assetId: 'sitewise-asset-id', 
        properties: [{ propertyId: 'some-property' }],
      }
    ])
  ]}
/>
```

#### Web component example

```
import { initialize } from '@iot-app-kit/source-iotsitewise';
import { fromEnv } from "@aws-sdk/credential-providers";

const { query } = initialize({
  awsCredentials: fromEnv()
});

// jsx
<iot-kpi
  queries={[
    sitewiseQuery.timeSeriesData([
      { 
        assetId: 'sitewise-asset-id', 
        properties: [{ propertyId: 'some-property' }],
      }
    ])
  ]}
/>
```

## Properties

The KPI component contains the following properties that you can customize. 

### `viewport` 

Specifies a time range. The KPI only supports showing the latest value. If the `viewport` is configured to visualize historical data, the KPI displays the disabled state. 

Type: Object 

`start` 

(Optional) The start of the range from which to visualize data. If no `duration`, you must specify a `start` date.

Type: Date

`end`

(Optional) The end of the range from which to visualize data. If no `duration`, you must specify an `end` date. 

Type: Date

`duration`

(Optional) The time interval over which to visualize data. If no `start` or `end`, you must specify a `duration`. You can use `m`, `h`, `d`, and `w` when you specify a duration. For example, `2m` represents 2 minutes, `2h` represents 2 hours, `2d` represents 2 days, and `2w` represents 2 weeks. For more information about the supported units and format, see [parse-duration](https://github.com/jkroso/parse-duration) on GitHub.

Type: String

### `annotations` 

(Optional) Defines thresholds for the line chart. To view and interact with an annotation example, see [Annotation](https://synchrocharts.com/#/Features/Annotation) in the Synchro Charts documentation. For more information about the `annotations` API, see [Properties](https://synchrocharts.com/#/API/Properties) in the Synchro Charts documentation. 

Type: Object

### `queries`

Selects what data to visualize. Learn more about queries, see [Core](https://github.com/awslabs/iot-app-kit/tree/main/docs/Core.md). 

Type: Array 

### `styleSettings`

(Optional) A map of `refId` to style settings for the KPI. Learn more about reference IDs, see [Core](https://github.com/awslabs/iot-app-kit/tree/main/docs/Core.md). 

The KPI provides the following style settings that you can customize:

* `name` string
    (Optional) Specify a name to replace the name of the data set given by its source.  
* `unit`

    (Optional) The unit given to the data (for example, `"m/s"` and `"count"`).

    Type: String

* `detailedName`

    (Optional) A detailed name that is presented in the tooltip. 
    

*Example code for `styleSettings`:*

```

<KPI
  ...

  /** Specifying a query which provides a `refId` */
  queries={[query.timeSeriesData([{ 
    assetId: 'id', 
    properties: [{ propertyId: 'property', refId: 'my-property' }]
  }])
 ]}
 
 /** Mapping the provided `refId` to the KP style settings */
 styleSettings={{ 'my-property': { name: 'My Cool Property' }}}
/>

```

### `widgetId`

(Optional) The ID of the widget. A widget is a visualization that you use the KPI component to create.

Type: String
