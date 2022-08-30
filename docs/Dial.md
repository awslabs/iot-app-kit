# Dial

The Dial component is used for visualizing single values. It is optimized for percentages, but can handle other units. With the Dial, you can interact with IoT data from one or more data sources.

To view and interact with a dial example, visit [Dial](https://synchrocharts.com/#/Components/Dial) in the Synchro Charts documentation.

## Examples

#### React component example

```
import { initialize } from '@iot-app-kit/source-iotsitewise';
import { Dial } from '@iot-app-kit/react-components';
const { IoTSiteWiseClient } = require('@aws-sdk/client-iotsitewise');
const iotsitewiseClient = new IoTSiteWiseClient({ region: "REGION" });

const { query } = initialize({ iotsitewiseClient });

// jsx
<Dial
  viewport={{ duration: '5m', yMin: 0, yMax: 2000 }}
  
  queries={[
    query.timeSeriesData({ 
        assets: [{
          assetId: 'sitewise-asset-id', 
          properties: [{ propertyId: 'some-property' }],
        }]
    })
  ]}
  size="L"
/>
```

#### Web component example

```
import { initialize } from '@iot-app-kit/source-iotsitewise';
const { IoTSiteWiseClient } = require('@aws-sdk/client-iotsitewise');
const { defineCustomElements } = require('@iot-app-kit/components/loader');

defineCustomElements();
const iotsitewiseClient = new IoTSiteWiseClient({ region: "REGION" });

const { query } = initialize({ iotsitewiseClient });

// jsx
<iot-dial
  viewport={{ duration: '5m', yMin: 0, yMax: 2000 }}
  
  queries={[
    query.timeSeriesData({ 
        assets: [{
          assetId: 'sitewise-asset-id', 
          properties: [{ propertyId: 'some-property' }],
        }]
    })
  ]}
  size="L"
/>
```

## Properties

The Dial component contains the following properties that you can customize. 

### `viewport` 

Specifies a time range. The Dial only supports showing the latest value.

Type: Object

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

    (Optional) The minimum `y` value. The minimum value of the data stream, that is, if the value of the data stream is `yMin`, then the meter shows 0%. The default value is 0.

    Type: Number

 - `yMax`

    (Optional) The maximum `y` value. The maximum value of the data stream, that is, if the value of the data stream is `yMax`, the gauge will show 100%

    Type: Number

### `annotations`

(Optional) Defines thresholds for the Dial. Annotations that aren't also thresholds will be ignored. To view and interact with an annotation example, see [Annotation](https://synchrocharts.com/#/Features/Annotation) in the Synchro Charts documentation. For more information about the `annotations` API, see [Properties](https://synchrocharts.com/#/API/Properties) in the Synchro Charts documentation. 

In addition to the existing attributes, an additional attribute is added to represent the offset x of the icon for `Dial`.

Type: Object

The Dial provides the following style settings that you can customize:

* `offsetX`

    (Optional) The offset of the icon with respect to the center X of the circle.  

    Type: Number

### `queries`

Selects what data to visualize. Learn more about queries, see [Core](https://github.com/awslabs/iot-app-kit/tree/main/docs/Core.md). 

Type: Array

### `styleSettings`

(Optional) A map of `refId` to style settings for the Dial. Learn more about reference IDs, see [Core](https://github.com/awslabs/iot-app-kit/tree/main/docs/Core.md). 

The Dial provides the following style settings that you can customize:

* `name`

    (Optional) Specify a name to replace the name of the data set given by its source.  

    Type: String

* `unit`

    (Optional) The unit associated with the displayed dataset. Only on tooltips.

    Type: String

* `detailedName`

    (Optional) A detailed name that is presented in the tooltip. 

    Type: String

* `color`
   
   (Optional) The color of the "filled" section of the meter.

* `yMin`

   (Optional) Overrides the data stream level of `viewport.yMin`.

* `yMax`

   (Optional) Overrides the data stream level of `viewport.yMax`. 

### `size`

Configure the overall line thickness and relative font size. It providers six styles `'XS'` `'S'` `'M'` `'L'` `'XL'` `'XXL'`.

Type: String

### `significantDigits`

Displays the number of significant digits for the primary value of percent.

### `widgetId`

(Optional) The ID of the widget. A widget is a visualization that you use the KPI component to create.

Type: String

