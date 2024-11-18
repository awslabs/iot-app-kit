import { type IValueDataBindingProviderState } from './types';

export enum DataField {
  ENTITY_ID,
  COMPONENT_NAME,
  PROPERTY_NAME,
}

export const DATA_FIELD_NAMES = ['entityId', 'componentName', 'propertyName'];

export enum DATA_BINDING_CONTEXT_KEYS {
  entityId = 'entityId',
  componentName = 'componentName',
  propertyName = 'propertyName',
}

export const EMPTY_STORE_STATE: IValueDataBindingProviderState = {
  definitions: DATA_FIELD_NAMES.map((fieldName) => ({
    fieldName,
    state:
      fieldName === DATA_BINDING_CONTEXT_KEYS.entityId ? 'loading' : 'disabled',
    options: [],
  })),
  selectedOptions: [],
};
