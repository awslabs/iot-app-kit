# Status grid

A status grid is a good way to visualize data that has a small number of well-defined states, such as an alarm. For example, if you have a pressure indicator that can be high, medium, or low, you could display each state in a different color with a status grid. With the status grid, you can interact with IoT data from one or more data sources.

The status grid only supports showing the latest value. If the `viewport` is configured to visualize historical data, the status grid displays the disabled state. 

To view and interact with a status grid example, visit [StatusGrid](https://synchrocharts.com/#/Components/StatusGrid) in the Synchro Charts documentation. 

## Examples

#### React component example

```
import { initialize } from '@iot-app-kit/source-iotsitewise';
import { StatusGrid } from '@iot-app-kit/react-components';
const { IoTSiteWiseClient } = require('@aws-sdk/client-iotsitewise');
const iotSiteWiseClient = new IoTSiteWiseClient({ region: "REGION" });

const { query } = initialize({ iotSiteWiseClient });

// jsx
<StatusGrid
  viewport={{ duration: '5m' }}
  
  queries={[
    query.timeSeriesData({ 
        assets: [{
          assetId: 'sitewise-asset-id', 
          properties: [{ propertyId: 'some-property' }],
        }]
    })
  ]}
/>
```

#### Web component example

```
import { initialize } from '@iot-app-kit/source-iotsitewise';
const { IoTSiteWiseClient } = require('@aws-sdk/client-iotsitewise');
const { defineCustomElements } = require('@iot-app-kit/components/loader');
defineCustomElements();
const iotSiteWiseClient = new IoTSiteWiseClient({ region: "REGION" });

const { query } = initialize({ iotSiteWiseClient });

// jsx
<iot-status-grid
  viewport={{ duration: '5m' }}
  
  queries={[
    query.timeSeriesData({ 
        assets: [{
          assetId: 'sitewise-asset-id', 
          properties: [{ propertyId: 'some-property' }],
        }]
    })
  ]}
/>
```

## Properties

The status grid component contains the following properties that you can customize. 

### `viewport` 

Specifies a time range. The status grid only supports showing the latest value. If the `viewport` is configured to visualize historical data, the status grid displays the disabled state. 

Type: Object

A viewport contains the following fields:

- `start`

  (Optional) The start of the range from which to visualize data. If no `duration`, you must specify a `start` date.

  Type: Date

- `end`

  (Optional) The end of the range from which to visualize data. If no `duration`, you must specify an `end` date.

  Type: Date

- `duration`

  (Optional) The time interval over which to visualize data. If no `start` or `end`, you must specify a `duration`. You can use `m`, `h`, `d`, and `w` when you specify a duration. For example, `2m` represents 2 minutes, `2h` represents 2 hours, `2d` represents 2 days, and `2w` represents 2 weeks. For more information about the supported units and format, see [parse-duration](https://github.com/jkroso/parse-duration) on GitHub.

  Type: String

- `yMin`

  (Optional) The minimum `y` value. The line chart won’t display data points whose `y` values are less than `yMin`. Defaults to a value small enough to ensure all data within the viewport falls at or above the `yMin`.

  Type: Number

- `yMax`

  (Optional) The maximum `y` value. The line chart won’t display data points whose `y` values are greater than `yMax`. Defaults to a value large enough to ensure all data within the viewport falls at or below the `yMax`.

  Type: Number


### `annotations`

(Optional) Defines thresholds for the status grid. Note that annotations that are not thresholds will be ignored. To view and interact with an annotation example, see [Annotation](https://synchrocharts.com/#/Features/Annotation) in the Synchro Charts documentation. For more information about the `annotations` API, see [Properties](https://synchrocharts.com/#/API/Properties) in the Synchro Charts documentation. 

Type: Object

### `queries`

Selects what data to visualize. Learn more about queries, see [Core](https://github.com/awslabs/iot-app-kit/tree/main/docs/Core.md). 

Type: Array 

### `styleSettings`

(Optional) A map of `refId` to style settings for the status grid. Learn more about reference IDs, see [Core](https://github.com/awslabs/iot-app-kit/tree/main/docs/Core.md). 

Type: Object

The status grid chart provides the following style settings that you can customize:

`name`

(Optional) Specify a name to replace the name of the data set given by its source.  

Type: String

`unit` 

(Optional) The unit given to the data (for example, `"m/s"` and `"count"`).

Type: String

`detailedName`

(Optional) A detailed name that is presented in the tooltip.

Type: String

*Example code for `styleSettings`:*

```

<StatusGrid
  ...

  /** Specifying a query which provides a `refId` */
  queries={[
    query.timeSeriesData({ 
      assets: [{
        assetId: 'id', 
        properties: [{ propertyId: 'property', refId: 'my-property' }]
      }]
    })
 ]}
 
 /** Mapping the provided `refId` to the status grid style settings */
 styleSettings={{ 'my-property': { name: 'My Cool Property' }}}
/>

```

### `widgetId`

(Optional) The ID of the widget. A widget is a visualization that you use the status grid component to create.  

Type: String

