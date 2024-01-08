import {
  DataBase,
  DataRequest,
  Query,
  TimeSeriesData,
} from '@iot-app-kit/core';

export interface ITwinMakerEntityDataBindingContext {
  entityId: string;
  componentName: string;
  propertyName: string;
}

export interface ITwinMakerEntityBinding {
  entityId: string;
}

export type ITwinMakerDataBindingContext =
  | ITwinMakerEntityDataBindingContext
  | ITwinMakerEntityBinding;
export interface IValueDataBinding {
  dataBindingContext?: ITwinMakerDataBindingContext;
  isStaticData?: boolean;
}

export type errorType = 'invalidEntityId';

/**
 * The selection options for each attribe of data frame
 */
export interface IDataFieldOption {
  label?: string;
  value?: string;
}

export interface IDataFieldDefinition {
  fieldName: string;
  options: IDataFieldOption[];
  state: 'ready' | 'disabled' | 'loading';
}

export interface IValueDataBindingProviderState {
  definitions: IDataFieldDefinition[];
  selectedOptions: Array<IDataFieldOption | null>;
  errors?: Partial<Record<errorType, boolean>>;
}

export type OnStateChangedListener = (
  state: IValueDataBindingProviderState
) => void;

/**
 * TODO: this design does not decouple the state provider and the UI as they
 * are highly dependent. Revisit this design later to decouple the data
 * interface vs the UI state management.
 * The interface allows the users to customize the data binding editor
 * Note that the provider is the source of truth of the input states.
 */
export interface IValueDataBindingStore {
  /**
   * Used to communicate back if any update happened within the Renderer to the binding,
   * i.e. switch to a different anchor, undo/redo, etc. The key is used to identify the
   * component and the binding is to identify if there is any diff compared to the internal
   * state of the provider.
   */
  setBinding(
    key: string,
    dataBinding?: IValueDataBinding,
    dataBindingConfig?: IDataBindingConfig
  ): IValueDataBindingProviderState;
  /**
   * Update selection to get the updated field definitions
   */
  updateSelection(
    fieldName: string,
    selected: IDataFieldOption
  ): Promise<IValueDataBindingProviderState>;
  /**
   * Create the ValueDataBinding of the current selection or undefined if the selection is invalid
   */
  createBinding(): Promise<IValueDataBinding | undefined>;
  /**
   * Set change listener when provider state changes so the UI can refresh accordingly
   */
  setOnStateChangedListener(listener?: OnStateChangedListener): void;
}

export interface IValueDataBindingProvider {
  createStore(isDataBindingTemplateProvider: boolean): IValueDataBindingStore;
  createQuery(
    dataBinding: IValueDataBinding
  ): Query<TimeSeriesData[] | DataBase[], DataRequest> | undefined;
}

/************************************************
 * Data Binding Template Definition
 ************************************************/

/**
 * IDataBindingTemplate is the data structure comes with dataInput for data frames
 *
 * Example:
 * {
 *   "sel_entity": 'Mixer0_abcdef',
 *   "sel_comp": 'AlarmComponent'
 * }
 */
export type IDataBindingTemplate = Record<string, string>;

/**
 * IDataBindingConfig is the data binding configuration in scene file.
 * Although TwinMaker V1 has only 1 set of data binding templates, this data structure is set to be an array for future extension
 *
 * Example:
 * {
 *   "fieldMapping": {
 *     "entityId": ["sel_entity"],
 *     "componentName": ["sel_comp"]
 *   },
 *   "template": {
 *     "sel_entity": "room1",
 *     "sel_comp": "temperatureSensor2"
 *   }
 * }
 */
export type IDataBindingConfig = {
  fieldMapping: Record<string, string[]>;
  template?: IDataBindingTemplate;
};
