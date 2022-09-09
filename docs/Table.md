# Table
The table component allows for a compact form to view one or more data streams from one or more time series data sources.

To view and interact with a table example, visit [Table](https://synchrocharts.com/#/Components/Table) in the Synchro Charts documentation. 

## Examples

#### React component example

```
import { initialize, toId } from '@iot-app-kit/source-iotsitewise';
import { Table } from '@iot-app-kit/react-components';
const { IoTSiteWiseClient } = require('@aws-sdk/client-iotsitewise');
const iotsitewiseClient = new IoTSiteWiseClient({ region: "REGION" });

const { query } = initialize({ iotsitewiseClient });

// jsx
<Table
  viewport={{ duration: '5m' }}
  
  tableColumns={[
    {
      header: 'Tempature',
      rows: [
        toId({ assetId: 'engine-1', propertyId: 'tempature' }),
        toId({ assetId: 'engine-2', propertyId: 'tempature' }),
      ]
    },
    {
      header: 'RPM',
      rows: [
        toId({ assetId: 'engine-1', propertyId: 'rpm' }),
        toId({ assetId: 'engine-2', propertyId: 'rpm' }),
      ]
    }
  ]}
  
  queries={[
    query.timeSeriesData({
      assets: [
        { 
          assetId: 'engine-1', 
          properties: [
            { propertyId: 'tempature' },
            { propertyId: 'rpm' }
          ],
        }, { 
          assetId: 'engine-2', 
          properties: [
            { propertyId: 'tempature' },
            { propertyId: 'rpm' }
          ],
        }
    ])
  ]}}
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
<iot-table
  viewport={{ duration: '5m' }}
  
  tableColumns={[
    {
      header: 'Tempature',
      rows: [
        toId({ assetId: 'engine-1', propertyId: 'tempature' }),
        toId({ assetId: 'engine-2', propertyId: 'tempature' }),
      ]
    },
    {
      header: 'RPM',
      rows: [
        toId({ assetId: 'engine-1', propertyId: 'rpm' }),
        toId({ assetId: 'engine-2', propertyId: 'rpm' }),
      ]
    }
  ]}
  
  queries={[
    query.timeSeriesData({
      assets: [
        { 
          assetId: 'engine-1', 
          properties: [
            { propertyId: 'tempature' },
            { propertyId: 'rpm' }
          ],
        }, { 
          assetId: 'engine-2', 
          properties: [
            { propertyId: 'tempature' },
            { propertyId: 'rpm' }
          ],
        }
    ])
  ]}}
/>
```

## Properties

The table component contains the following properties that you can customize.

### `tableColumns`

Specifies the row and column structure for the table, provides a mechanism to map the time series data queried for, into the cells of your choice
Type: Array

Each table column contains the following properties

`header`

The text to be displays as the column header, the first row of the table

Type: string

`rows`

Array of content of each cell within the respective column. Rows are defined in order, the first row item corresponds to the first row on the table that doesn't represent column headers.


Type: string or undefined

Each item must be one of the following:

* A string representing the id of a time series data stream, which you can get by utilizing the time series data source of choices `toId` helper, for example, with AWS IoT SiteWise, you can refer to an id with the following code:
```
import { toId } from '@iot-app-kit/source-sitewise';
const column = {
  header: 'some-header',
  rows: [toId({ assetId: 'my-asset', propertyId: 'property-id' })]
}
```

* `undefined`, which will cause the corresponding table cell to be empty.

### `viewport`

Specifies a time range. The table only supports showing the latest value. If the `viewport` is configured to visualize historical data, the table displays the disabled state.

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


### `annotations`

(Optional) Defines thresholds for the table. To view and interact with an annotation example, see [Annotation](https://synchrocharts.com/#/Features/Annotation) in the Synchro Charts documentation. For more information about the `annotations` API, see [Properties](https://synchrocharts.com/#/API/Properties) in the Synchro Charts documentation.
Type: Object

### `queries`

Selects what data to visualize. Learn more about queries, see [Core](https://github.com/awslabs/iot-app-kit/tree/main/docs/Core.md).
Type: Array

### `styleSettings`

(Optional) A map of `refId` to style settings for the table. Learn more about reference IDs, see [Core](https://github.com/awslabs/iot-app-kit/tree/main/docs/Core.md).

The table chart provides the following style settings that you can customize:

* `name` string
  (Optional) Specify a name to replace the name of the data set given by its source.
* `unit` string
  (Optional) The unit given to the data (for example, `"m/s"` and `"count"`).
* `detailedName` string
  (Optional) A detailed name that is presented in the tooltip.

### `widgetId`  string

(Optional) The ID of the widget. A widget is a visualization that you use the table component to create.

-----

***NOTE: Table currently only supports raw data***
