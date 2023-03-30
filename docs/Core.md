## [This documentation is deprecated: instead visit the IoT App Kit Docs](https://awslabs.github.io/iot-app-kit/)

# Core

The core package contains functionality and data types that are shared across all IoT App Kit sources. The core defines a common time series data structure and functionality, as well as utilities to help create a [custom time series data source](https://github.com/awslabs/iot-app-kit/tree/main/docs/CustomSources.md). 

You can download the core module from the following location:  https://npmjs.com/package/@iot-app-kit/core. 

### API

### TimeSeriesData

A time series data structure. 

`dataStreams`: Object[]
A collection of data streams. A data stream represents a single dataset.
When you define a data stream, you can specify the following information:

`id`
The ID of the data stream. 

Type: String

`data`
Raw data from the data stream, excluding aggregated values (for example, average, minimum, and maximum). 

Type: Array

**Note** 
If the value of `resolution` is greater than 0, IoT Application Kit retrieves data from the `aggregates` property instead of the `data` property.   

When you define a `data` property, you can specify the following information. 
`x`
The date the data point was measured, in Unix epoch time. 

Type: Number

`y`
The value of the data point. The value type depends on the value of `dataType`. For example, if the value of `dataType` is `NUMBER` , the `y` value is a number.

Type: Number, String, or Boolean 
 
Example `data`:

```
[
  [new Date(2000, 1, 1).getTime(), 'OK'],
  [new Date(2012, 1, 1).getTime(), 'CRITICAL']
]
```


`resolution`

The time interval, in milliseconds, over which to aggregate data. To retrieve raw data, set `resolution` to 0.

`dataType`

The data type of the `y` property. The value of `dataType` can be one of the following: 

* `NUMBER` - The `y` value is a number (for example, `12.0`).
* `STRING` - The `y` value is a string (for example, `"OK"` and `"WARNING"`). 
* `BOOLEAN` - The `y` value is a Boolean value that must be `true` or `false`.

Type: String

`name`
A friendly name that helps identify the data stream.

Type: String

`aggregates`: Object

(Optional) A map of `resolution`, in milliseconds, to its associated data points. The `resolution` in the `dataStreams` is a key in the `aggregates` object. To visualize the data stream, the `resolution` must match to one of the `aggregates`.

`resolution` (key): Number
The time interval, in milliseconds, over which to aggregate data. To retrieve raw data, set `resolution` to 0.

`dataPoint` (value): Object[]
The data points that are measured during the specified resolution.

`detailedName`
(Optional) A more detailed name for the data stream. You can use this property to specify features, such as detailed tooltip information.

Type: String

`unit`
(Optional) The unit of the `y` values that are retrieved from the associated data stream (for example, `"m/s"` and `"count"`).

Type: String.

`color`
(Optional) A CSS color string, e.g. "#5e87b5" or "red". In the context of being used with IoT App Kit components, will default to a color pallet as selected by the widget if color is applicable for the respective widget.

Type: String

`isLoading`
(Optional) Whether the data stream has never fetched data previously, and is currently fetching data. Defaults to `false`.

Type: Boolean

`isRefreshing`
(Optional) Whether the data stream is currently fetching data, regardless of whether it has fetched data previously. Defaults to `false`. 

Type: Boolean

`error`
(Optional) The error associated with the source from which the data stream is retrieved.

Type: String

`associatedDataStreams`
(Optional) Data streams that are associated with alarms. 

Type: Array

When you configure an associated data stream, you can specify the following information: 

 - `id` 
  
    The ID of the associated data stream. 

    Type: String

 - `streamType` 

    The data stream type for the associated data stream. 

    Type: String

    The `streamType` can be one of the following values:

    - `ALARM` - Alarm data stream type.
    - `ANOMALY` - Anomaly data stream type.
    - `ALARM_THRESHOLD` - Alarm threshold stream type.

`viewport`

Specifies the window over which to visualize data. For example, a scatter chart with the following `viewport` display data from 2000 to 2001. In addition, their `y` value must be greater than or equal to 0, and less than or equal to 100.

Type: Object

```
{ 
  start: new Date(2000, 0, 0), 
  end: new Date(2001, 0, 0), 
  yMin: 0, 
  yMax: 100
}
```

To configure the `viewport`, you can specify the following fields: 

 - `start`

   (Optional) The start date of the `viewport` from which to visualize data. You don’t need to specify a `start` if a `duration` is defined.

   Type: Date

 - `end`

   (Optional) The end date from the `viewport` from which to visualize data. You don’t need to specify an `end` if a `duration` is defined.

   Type: Date

 - `yMin`

   (Optional) The minimum `y` value. The visualization won’t display data points whose `y` values are less than `yMin`. Defaults to a value small enough to ensure all data within the viewport falls at or above the  `yMin`. Some components ignore this value.

    Type: Number

 - `yMax`

   (Optional) The maximum `y` value. The visualization won’t display data points whose `y` values are greater than `yMax`. Defaults to a value large enough to ensure all data within the viewport falls at or below the  `yMax`. Some components ignore this value.

   Type: Number

 - `duration`

   (Optional) The duration of the viewport over which to display data, in milliseconds. You use `duration` to specify a live time frame. Don’t specify a `duration` if you want to view only historical data. 

   Type: Number

### TimeSeriesDataSettings

Specifies how IoT Application Kit requests time series data.

Type: Object

`requestBuffer`

Number of additional days over which to request data beyond the specified `viewport.start` and `viewport.end`. For example, if the `requestBuffer` is 0, no additional data will be requested. If the `requestBuffer` is 1, IoT Application Kit will request data from `viewport.start-1` to `viewport.end+1` . The `requestBuffer` is linear. If the buffer doubles, the duration of which to request data roughly doubles. 

The request buffer won’t cause a precise amount of additional data to be requested. For example, if the `requestBuffer` is 1, it won’t necessarily cause exactly one day of data to be requested before and after the viewport. This behavior prevents panning and other gestures that occur at near 60fps from triggering data requests on every frame. 

Type: Number

`refreshRate`

(Optional) Specifies how often to request data again, in milliseconds. This applies to data whose time to live (TTL) has expired or to live streaming data when `viewport.duration` is specified. The default value is five seconds.

Type: Number

`resolution`

(Optional) The time interval over which to aggregate data (for example, average, minimum, and maximum). For example, if the resolution is `1d`, IoT Application Kit aggregates your data once every 24 hours (1 day). For more information about the supported units and format, see [parse-duration](https://github.com/jkroso/parse-duration) on GitHub.

The valid resolutions for AWS IoT SiteWise are the following:

  * `0` - Raw data (unaggregated data). IoT Application Kit uses the [GetAssetPropertyValueHistory](https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_GetAssetPropertyValueHistory.html) operation to fetch your data.
  * `1m` - Minute aggregated data. IoT Application Kit uses the [GetAssetPropertyAggregates](https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_GetAssetPropertyAggregates.html) operation to aggregate your data. 
  * `1h` - Hourly aggregated data. IoT Application Kit uses the [GetAssetPropertyAggregates](https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_GetAssetPropertyAggregates.html) operation to aggregate your data. 
  * `1d` - Daily aggregated data. IoT Application Kit uses the [GetAssetPropertyAggregates](https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_GetAssetPropertyAggregates.html) operation to aggregate your data.


When the resolution is an object, it contains a key that represents a viewport duration. The corresponding value of the key value pair has its resolution applied to.

Example resolution configuration:

```
{
  0: '0',
  1h: '1m',
  1d: '1h'
}
```

If the duration of the viewport is less than an hour, the visualization displays raw data. If the duration of the viewport is greater than an hour and less than a day, the visualization displays data that is aggregated once every minute. If the duration of the viewport is greater than a day, the visualization displays data that is aggregated once every 24 hours. 

`viewport duration (key)`

The size of the viewport that the corresponding resolution applies to. All viewport durations at this duration, but with a smaller duration than the next largest duration specified as a key, will have the corresponding resolution applied.

Type: String

`resolution (value)`

The aggregation level to be applied when the duration of the viewport matches the specified viewport duration by the rules specified in the viewport duration key. For more information about the supported units and format, see [parse-duration](https://github.com/jkroso/parse-duration) on GitHub.

Type: String or Object

`fetchFromStartToEnd`

(Optional) If `true`, all data that falls within the viewport is required and will be requested. Additional data outside of the viewport will also be requested based on the `requestBuffer`. The default value is dependent on which IoT App Component is being used.

Type: Boolean

`fetchMostRecentBeforeStart` 

(Optional) If `true`, the data point that is at or before `viewport.start` will be requested. For example, if you have a viewport that contains a time interval from May 1, 2021 to May 2, 2021, and there is no data between May 1, 2021 and May 2, 2021 but there is a single data point on April 1, 2021, the query returns the data point on April 1, 2021. The default value is dependent on which IoT App component is being used.

Type: Boolean

`fetchMostRecentBeforeEnd` 

(Optional) If `true`, the data point that is at or before `viewport.end` will be requested. For example, if you have a viewport that contains a time interval from May 1, 2021 to May 2, 2021, and there is no data between May 1, 2021 and May 2, 2021, but there is a single data point on April 1, 2021, the query returns the data point on April 1st. The default value is dependent on which IoT App component is being used.

Type: Boolean
