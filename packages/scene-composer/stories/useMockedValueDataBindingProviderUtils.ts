import {
  ENTITY_ID_INDEX,
  COMPONENT_NAME_INDEX,
  PROPERTY_NAME_INDEX,
} from '../src/components/panels/scene-components/ValueDataBindingBuilder';
import { IDataFieldOption, IValueDataBindingProviderState, IDataBindingConfig } from '../src/interfaces';
import { createDataBindingTemplateOptions } from '../src/utils/dataBindingTemplateUtils';

import { componentNames, entityIds, entityNames, FIELDS, MOCK_DELAY, propertyNames, allEntityIds } from './constants';
import { MockedValueDataBindingProviderStore } from './types';

export function cloneStoreState(store: MockedValueDataBindingProviderStore): IValueDataBindingProviderState {
  return {
    definitions: [...store.state.definitions],
    selectedOptions: [...store.state.selectedOptions],
  };
}

export function createIdenticalLabelOption(value: string) {
  return { label: value, value };
}

export function createEmtpyStoreState(): IValueDataBindingProviderState {
  return {
    definitions: FIELDS.map((fieldName) => ({
      fieldName,
      state: 'disabled',
      options: [],
    })),
    selectedOptions: [],
  };
}

export async function asyncLoadEntityOptions(
  store: MockedValueDataBindingProviderStore,
  isDataBindingTemplateProvider: boolean,
  dataBindingConfig?: IDataBindingConfig,
  notifyStateChange?: () => void,
) {
  store.state.definitions[ENTITY_ID_INDEX].state = 'loading';
  store.state.definitions[COMPONENT_NAME_INDEX].state = 'disabled';
  store.state.definitions[PROPERTY_NAME_INDEX].state = 'disabled';
  notifyStateChange?.();

  const entityOptions = await new Promise<IDataFieldOption[]>((resolve) => {
    setTimeout(() => {
      resolve(
        entityIds.map((entityId, index) => {
          return { value: entityId, label: entityNames[index] };
        }),
      );
    }, MOCK_DELAY);
  });

  store.state.definitions[ENTITY_ID_INDEX].options = !isDataBindingTemplateProvider
    ? [...createDataBindingTemplateOptions('entityId', dataBindingConfig), ...entityOptions]
    : entityOptions;
  store.state.definitions[ENTITY_ID_INDEX].state = 'ready';

  // refresh selected entityName
  store.state.selectedOptions = store.state.selectedOptions.map((option) => ({
    value: option.value,
    label: entityOptions.find((o) => o.value === option.value)?.label ?? option.value,
  }));

  notifyStateChange?.();

  // chain loading componentNames if entity is already selected
  if (store.state.selectedOptions[ENTITY_ID_INDEX] !== undefined) {
    asyncLoadComponentNameOptions(store, isDataBindingTemplateProvider, dataBindingConfig, notifyStateChange);
  }
}

export async function asyncLoadComponentNameOptions(
  store: MockedValueDataBindingProviderStore,
  isDataBindingTemplateProvider: boolean,
  dataBindingConfig?: IDataBindingConfig,
  notifyStateChange?: () => void,
) {
  store.state.definitions[COMPONENT_NAME_INDEX].state = 'loading';
  store.state.definitions[PROPERTY_NAME_INDEX].state = 'disabled';
  notifyStateChange?.();

  const componentNameOptions = await new Promise<IDataFieldOption[]>((resolve) => {
    setTimeout(() => {
      resolve(
        componentNames.map((componentName, index) => {
          return { value: componentName, label: componentNames[index] };
        }),
      );
    }, MOCK_DELAY);
  });

  store.state.definitions[COMPONENT_NAME_INDEX].options = !isDataBindingTemplateProvider
    ? [
        ...createDataBindingTemplateOptions('componentName', dataBindingConfig, store.state.selectedOptions[0].value),
        ...componentNameOptions,
      ]
    : componentNameOptions;
  store.state.definitions[COMPONENT_NAME_INDEX].state = 'ready';

  notifyStateChange?.();

  // chain loading propertyNames if component is already selected
  if (store.state.selectedOptions[COMPONENT_NAME_INDEX] !== undefined) {
    asyncLoadPropertyNameOptions(store, dataBindingConfig, notifyStateChange);
  }
}

export async function validateEntityId(entityId = '') {
  if (allEntityIds.indexOf(entityId) > -1) {
    return Promise.resolve(entityId);
  }
  return Promise.reject(new Error('404'));
}

export async function asyncLoadPropertyNameOptions(
  store: MockedValueDataBindingProviderStore,
  dataBindingConfig?: IDataBindingConfig,
  notifyStateChange?: () => void,
) {
  store.state.definitions[PROPERTY_NAME_INDEX].state = 'loading';
  notifyStateChange?.();

  const propertyNameOptions = await new Promise<IDataFieldOption[]>((resolve) => {
    setTimeout(() => {
      resolve(
        propertyNames.map((propertyName, index) => {
          return { value: propertyName, label: propertyNames[index] };
        }),
      );
    }, MOCK_DELAY);
  });

  store.state.definitions[PROPERTY_NAME_INDEX].options = propertyNameOptions;
  store.state.definitions[PROPERTY_NAME_INDEX].state = 'ready';

  notifyStateChange?.();
}
