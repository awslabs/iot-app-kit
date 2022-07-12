import { IValueDataBindingProviderState } from '../src/interfaces';

export interface MockedValueDataBindingProviderStore {
  state: IValueDataBindingProviderState;
  onStateChangedListener?: (state: IValueDataBindingProviderState) => void;
}

export type FIELD_NAME = 'entityId' | 'componentName' | 'propertyName';
