/************************************************
 * Data Input
 ************************************************/

// Timestamp should be millisecond epoch time
export type Timestamp = number;

// Inherit the Grafana convention of this "valueType" for time
export const DataFieldTimeType = 'time';

export interface IDataInput {
  dataFrames: IDataFrame[];

  // The current time to show, if it's undefined, the last data points will be
  // used
  timeCursor?: Timestamp;

  // The total range of the data
  // NOTE: Grafana treat both from and to inclusive, but we don't define
  // the behavior explicitly here due to the fact that some data source
  // may not support it natively. It should not matter in most of the use
  // cases we handle.
  timeRange: {
    from: Timestamp;
    to: Timestamp;
  };
}

export interface IDataFrame {
  // This maps to the refId in grafana
  dataFrameId: string;
  // This maps to the fields in grafana, fields are like columns in table
  // fields are assumed to have the same length in a single data frame.
  // For time series data, the first field should be Time. (by convention)
  fields: IDataField[];
}

export interface IDataField {
  // This is the column name, by convention it should be mapped to property name
  name: string;

  // labels are used to identify an instance of a multi-dimentional query,
  // e.g. query all the instances of the servers and return each server's data
  // as a separate field, labels can be used to uniquely identify each
  // individual server instances.
  // see: https://grafana.com/docs/grafana/latest/developers/plugins/data-frames/
  labels?: Record<string, string>;

  // Data type of the values
  valueType: ValueType;

  // The actual data records
  values: any[];
}

// We'll support the following for now. We can extend the list in the future
// 'time' data should be the same format as Timestamp data type
export type ValueType = 'number' | 'string' | 'boolean' | 'time';

export type {
  IDataFieldOption,
  IDataBindingConfig,
  IDataBindingTemplate,
  IValueDataBindingStore,
  IValueDataBindingProvider,
  IValueDataBindingProviderState,
} from '@iot-app-kit/source-iottwinmaker';

export interface ISelectedDataBinding {
  entityId: string;
  componentName?: string;
}
