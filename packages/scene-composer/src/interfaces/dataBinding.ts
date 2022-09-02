/************************************************
 * Data Input
 ************************************************/

import { IValueDataBinding } from './dataTypes';

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

/************************************************
 * Data Frame Editor
 ************************************************/

// The selection options for each attribe of data frame
export interface IDataFieldOption {
  label?: string;
  value?: string;
}

export type errorType = 'invalidEntityId';

export interface IDataFieldDefinition {
  fieldName: string;
  options: IDataFieldOption[];
  state: 'ready' | 'disabled' | 'loading';
}

export interface IValueDataBindingProviderState {
  definitions: IDataFieldDefinition[];
  selectedOptions: IDataFieldOption[];
  errors?: Partial<Record<errorType, boolean>>;
}

export type OnStateChangedListener = (state: IValueDataBindingProviderState) => void;

// TODO: this design does not decouple the state provider and the UI as they
// are highly dependent. Revisit this design later to decouple the data
// interface vs the UI state management.
// The interface allows the users to customize the data frame editor
// Note that the provider is the source of truth of the input states.
export interface IValueDataBindingStore {
  // Used to communicate back if any update happened within the Renderer to the binding,
  // i.e. switch to a different anchor, undo/redo, etc. The key is used to identify the
  // component and the binding is to identify if there is any diff compared to the internal
  // state of the provider.
  setBinding(
    key: string,
    dataBinding?: IValueDataBinding,
    dataBindingConfig?: IDataBindingConfig,
  ): IValueDataBindingProviderState;
  // Update selection to get the updated field definitions
  updateSelection(fieldName: string, selected: IDataFieldOption, dataBindingConfig: IDataBindingConfig): void;
  // Create the ValueDataBinding of the current selection or undefined if the selection is invalid
  createBinding(): Promise<IValueDataBinding | undefined>;
  // Set change listener when provider state changes so the UI can refresh accordingly
  setOnStateChangedListener(listener: OnStateChangedListener | undefined): void;
}

export interface IValueDataBindingProvider {
  useStore(isDataBindingTemplateProvider): IValueDataBindingStore;
}

/************************************************
 * Data Binding Template Definition
 ************************************************/

// IDataBindingTemplate is the data structure comes with dataInput for data frames
//
// Example:
// {
//   "sel_entity": 'Mixer0_abcdef',
//   "sel_comp": 'AlarmComponent'
// }
export type IDataBindingTemplate = Record<string, string>;

// IDataBindingConfig is the data binding configuration in scene file.
// Although TwinMaker V1 has only 1 set of data binding templates, this data structure is set to be an array for future extension
//
// Example:
// {
//   "fieldMapping": {
//     "entityId": ["sel_entity"],
//     "componentName": ["sel_comp"]
//   },
//   "template": {
//     "sel_entity": "room1",
//     "sel_comp": "temperatureSensor2"
//   }
// }
export type IDataBindingConfig = {
  fieldMapping: Record<string, string[]>;
  template?: IDataBindingTemplate;
};
