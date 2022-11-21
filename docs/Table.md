# Table
The table component provides a compact form for viewing one or more data streams from one or more time series data sources.

To migrate from previous API, check [Migrate from previous API](#migrate-from-previous-api)

**Note:**
Current version (v2.0.0), `iot-table` component does **NOT** support viewport groups. It will be added in a later version. 

## Examples

#### React component example

```
import { initialize, toId } from '@iot-app-kit/source-iotsitewise';
import { Table } from '@iot-app-kit/react-components';
const { IoTSiteWiseClient } = require('@aws-sdk/client-iotsitewise');
const iotSiteWiseClient = new IoTSiteWiseClient({ region: "REGION" });

const { query } = initialize({ iotSiteWiseClient });

// jsx
<Table
  viewport={{ duration: '5m' }}
  
  items={[
    {
      rpm: {
        $cellRef: {
          id: toId({ assetId: 'turbine-1', propertyId: 'rotation_per_minute' }),
          resolution: 0
        }
      },
      wind_speed: {
        $cellRef: {
          id: toId({ assetId: 'turbine-1', propertyId: 'wind_speed' }),
          resolution: 0
        }
      }
    },
    {
      rpm: {
        $cellRef: {
          id: toId({ assetId: 'turbine-2', propertyId: 'rotation_per_minute' }),
          resolution: 0
        }
      },
      wind_speed: {
        $cellRef: {
          id: toId({ assetId: 'turbine-2', propertyId: 'wind_speed' }),
          resolution: 0
        }
      }
    }
  ]}
  
  columnDefinitions={[
    {
      key: 'rpm',
      header: 'RPM'
    },
    {
      key: 'wind_speed',
      header: 'Wind Speed'
    }
  ]}
  
  queries={[
    query.timeSeriesData({
      assets: [
        { 
          assetId: 'turbine-1', 
          properties: [
            { propertyId: 'rotation_per_minute' },
            { propertyId: 'wind_speed' }
          ]
        },
        { 
          assetId: 'turbine-2', 
          properties: [
            { propertyId: 'rotation_per_minute' },
            { propertyId: 'wind_speed' }
          ]
        }
      ]
    })
  ]}
/>
```

#### Web component example

```
import { initialize, toId } from '@iot-app-kit/source-iotsitewise';
const { IoTSiteWiseClient } = require('@aws-sdk/client-iotsitewise');
const { defineCustomElements } = require('@iot-app-kit/components/loader');
defineCustomElements();
const iotSiteWiseClient = new IoTSiteWiseClient({ region: "REGION" });

const { query } = initialize({ iotSiteWiseClient });

// jsx
<iot-table
  viewport={{ duration: '5m' }}
  
  items={[
    {
      rpm: {
        $cellRef: {
          id: toId({ assetId: 'turbine-1', propertyId: 'rotation_per_minute' }),
          resolution: 0
        }
      },
      wind_speed: {
        $cellRef: {
          id: toId({ assetId: 'turbine-1', propertyId: 'wind_speed' }),
          resolution: 0
        }
      }
    },
    {
      rpm: {
        $cellRef: {
          id: toId({ assetId: 'turbine-2', propertyId: 'rotation_per_minute' }),
          resolution: 0
        }
      },
      wind_speed: {
        $cellRef: {
          id: toId({ assetId: 'turbine-2', propertyId: 'wind_speed' }),
          resolution: 0
        }
      }
    }
  ]}
  
  columnDefinitions={[
    {
      key: 'rpm',
      header: 'RPM'
    },
    {
      key: 'wind_speed',
      header: 'Wind Speed'
    }
  ]}
  
  queries={[
    query.timeSeriesData({
      assets: [
        { 
          assetId: 'turbine-1', 
          properties: [
            { propertyId: 'rotation_per_minute' },
            { propertyId: 'wind_speed' }
          ],
        }, 
        { 
          assetId: 'turbine-2', 
          properties: [
            { propertyId: 'rotation_per_minute' },
            { propertyId: 'wind_speed' }
          ]
        }
      ]
    })
  ]}
/>
```

## Properties

The table component contains the following customizable properties:

Note: The table component uses the table component from `@awsui/components-react`. Please refer to [AWS-UI/table](https://github.com/aws/awsui-documentation/blob/main/components/table.md) for all available properties. Differences are listed below.
### `items`
Specifies the data displayed in rows. Each item contains the data for one row. The display of a row is handled by the cell property of each column definition in the columnDefinitions property.

Type: Array of [Item](#item) objects

#### `item`
An item maps its own properties to dataStreams. A special property name [$cellRef](#cellref) can be used to refer to a datastream.
Other properties of an item will remain unchanged.
```typescript jsx
// If we have defined items like below
const items: Item[] = [{
  rpm: {
    $cellRef: {
      id: 'dataStream-1',
      resolution: 0
    }
  },
  wind_speed: {
    $cellRef: {
      id: 'dataStream-2',
      resolution: 0
    }
  },
  other: { static_value: 42 }
}]

// Table will receive the actual value of each $cellRef:
[{
  rpm: 15,
  wind_speed: 30,
  other: { static_value: 42 }
}]
```


#### (optional) `$cellRef`
$cellRef is a special keyword in Item. We use it to find the according dataStream. For the above example, 
the item has two properties. Both of them are using `$cellRef` to map properties to data stream.

Type: Object
- `id`
  A string representing the id of a time series data stream, which you can get by utilizing the time series data source of choices `toId` helper, for example, with AWS IoT SiteWise, you can refer to an id with the following code:
  - Type: String
- `resolution`
The resolution, in milliseconds, at which the data should be aggregated.
  - Type: Number

```typescript jsx
import { toId } from '@iot-app-kit/source-sitewise';
const item = [
  {
    wind_speed: {
      $cellRef: {
        id: toId({ assetId: 'engine-2', propertyId: 'temperature' }),
        resolution: 0
      }
    },
  }
] 
```


### `columnDefinitions`

Configures various column properties. The properties mirror [columnDefinitions](https://github.com/aws/awsui-documentation/blob/main/components/table.md#columnDefinitions)
with the following changes:

- `key`: string - Determines how each column looks up data from an `Item`.
- (Optional)`cell` (item) => React.ReactNode* - For overriding the default [cell](link-to-default-cell-function) function.
- (Optional)`formatter` (data:Primitive) => Primitive - Determines the display of a cell's content for formatting the data.

Type: Array of Object


### (optional)`sorting`

Specifies sorting configuration. If you want to use sorting with default settings, provide an empty object. This feature is only applicable for the table component.

- `defaultState` : Object - initial sorting state on the first render. This is an object with two properties:
  - `sortingColumn` [TableProps.ColumnDefinition]: currently sorted column.
  - `isDescending` [boolean, optional]: direction of sorting.

Type: Object


### (optional)`propertyFiltering`

Specifies property filtering configuration.

- `filteringProperties` : Array - Array of properties by which the data set is going to be filtered. Individual items have following properties:
  - key [string]: The identifier of this property. Refer to a property name in type T of the data item to enable built-in filtering.
  - groupValuesLabel [string]: Localized string to display for the 'Values' group label for a specific property. For example: EC2 instance values.
  - propertyLabel [string]: A human-readable string for the property.
  - (Optional) operators [ReadonlyArray<ComparisonOperator>, optional]: A list of all operators supported by this property. Equals operator should always be supported, even if you omit it in the list.
  - (Optional) group [string, optional]: Optional identifier of a custom group that this filtering option is assigned to. Use to create additional groups below the default one. Make sure to also define labels for the group in the customGroupsText property. Notice that only one level of options nesting is supported.
  - (Optional)`filteringFunction`: (item: TableItem, query: Query) => boolean; - Custom function to filter items. The default value is a function that takes values under the FilteringProperty['key'] in individual items, and matches them against current filteringText.
  - (Optional)`defaultQuery`: Query - Initial query on the first render.
  - (Optional)`empty` - React.ReactNode* - Content to display in the table/cards empty slot when there are no items initially provided.
  - (Optional)`noMatch` - React.ReactNode* - Content to display in the table/cards empty slot when filtering returns no matched items.

Type: Object


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


### (optional)`annotations`

Defines thresholds for the table. To view and interact with an annotation example, see [Annotation](https://synchrocharts.com/#/Features/Annotation) in the Synchro Charts documentation. For more information about the `annotations` API, see [Properties](https://synchrocharts.com/#/API/Properties) in the Synchro Charts documentation.

Type: Object
### `queries`

Selects what data to visualize. Learn more about queries, see [Core](https://github.com/awslabs/iot-app-kit/tree/main/docs/Core.md).

Type: Array


### (optional)`widgetId`  

The ID of the widget. A widget is a visualization that you use the table component to create.

Type: String

### (optional)`messageOverrides`

An object overrides messages for localization.

- `tableCellMessages`

  (Optional) override table cell labels.

  - Default:
  ``` typescript
  {
    loading: "Loading"
  }
  ``` 

- `propertyFilteringMessages`

  (Optional) override property filtering labels.

  - Default:
  ```typescript
  {
    filteringAriaLabel: 'your choice',
    dismissAriaLabel: 'Dismiss',
    filteringPlaceholder: 'Search',
    groupValuesText: 'Values',
    groupPropertiesText: 'Properties',
    operatorsText: 'Operators',
    operationAndText: 'and',
    operationOrText: 'or',
    operatorLessText: 'Less than',
    operatorLessOrEqualText: 'Less than or equal',
    operatorGreaterText: 'Greater than',
    operatorGreaterOrEqualText: 'Greater than or equal',
    operatorContainsText: 'Contains',
    operatorDoesNotContainText: 'Does not contain',
    operatorEqualsText: 'Equals',
    operatorDoesNotEqualText: 'Does not equal',
    editTokenHeader: 'Edit filter',
    propertyText: 'Property',
    operatorText: 'Operator',
    valueText: 'Value',
    cancelActionText: 'Cancel',
    applyActionText: 'Apply',
    allPropertiesLabel: 'All properties',
    tokenLimitShowMore: 'Show more',
    tokenLimitShowFewer: 'Show fewer',
    clearFiltersText: 'Clear filters',
    removeTokenButtonAriaLabel: () => 'Remove token',
    enteredTextLabel: (text) => `Use: "${text}"`,
  };
  ```

Type: Object



-----
## Migrate from previous API

Property `tableColumns` has been replaced by two new APIs, `items` and `columnDefinitions`, where `items` defines objects of each row, 
and `columnDefinitions` defines how table maps `items` to columns. For more details, check [Properties](#properties).

```typescript jsx
// previous
import { initialize, toId } from '@iot-app-kit/source-iotsitewise';
import { Table } from '@iot-app-kit/react-components';
const { IoTSiteWiseClient } = require('@aws-sdk/client-iotsitewise');
const iotSiteWiseClient = new IoTSiteWiseClient({ region: "REGION" });

const { query } = initialize({ iotSiteWiseClient });
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
```typescript jsx
// now
import { initialize, toId } from '@iot-app-kit/source-iotsitewise';
import { Table } from '@iot-app-kit/react-components';
const { IoTSiteWiseClient } = require('@aws-sdk/client-iotsitewise');
const iotSiteWiseClient = new IoTSiteWiseClient({ region: "REGION" });

const { query } = initialize({ iotSiteWiseClient });
<Table
  viewport={{ duration: '5m' }}
  items={[
    {
      temp: {
        $cellRef: {
          id: toId({ assetId: 'engine-1', propertyId: 'temperature' }),
          resolution: 0
        }
      },
      rpm: {
        $cellRef: {
          id: toId({ assetId: 'engine-1', propertyId: 'rpm' }),
          resolution: 0
        }
      }
    },
    {
      temp: {
        $cellRef: {
          id: toId({ assetId: 'engine-2', propertyId: 'temperature' }),
          resolution: 0
        }
      },
      rpm: {
        $cellRef: {
          id: toId({ assetId: 'engine-2', propertyId: 'rpm' }),
          resolution: 0
        }
      }
    },
  ]}
  columnDefintions={[
    {
      header: 'Temperature',
      key: 'temp'
    },
    {
      header: 'RPM',
      key: 'rpm'
    }
  ]}
  queries={[
    query.timeSeriesData({
      assets: [
        {
          assetId: 'engine-1',
          properties: [
            { propertyId: 'temperature' },
            { propertyId: 'rpm' }
          ],
        }, {
          assetId: 'engine-2',
          properties: [
            { propertyId: 'temperature' },
            { propertyId: 'rpm' }
          ],
        }
    ]})
  ]}
/>
```


***Note: Due to the difference between Stencil and React, providing JSX object from Web Component to React is not supported. Try to use string or number instead of ReactNode.***

