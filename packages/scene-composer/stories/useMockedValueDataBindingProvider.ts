import { isEqual } from 'lodash';

import {
  type IValueDataBindingProvider,
  type IDataFieldOption,
  type IDataBindingConfig,
  type IValueDataBinding,
  type IValueDataBindingStore,
  type IValueDataBindingProviderState,
} from '../src/interfaces';
import {
  ENTITY_ID_INDEX,
  COMPONENT_NAME_INDEX,
  PROPERTY_NAME_INDEX,
} from '../src/components/panels/scene-components/common/ValueDataBindingBuilder';

import {
  asyncLoadEntityOptions,
  asyncLoadComponentNameOptions,
  asyncLoadPropertyNameOptions,
  cloneStoreState,
  createEmtpyStoreState,
  createIdenticalLabelOption,
  validateEntityId,
} from './useMockedValueDataBindingProviderUtils';
import { type FIELD_NAME, type MockedValueDataBindingProviderStore } from './types';
import { FIELDS, MOCK_DELAY } from './constants';

export const propertyNames = Object.seal(['temperature']);

export function useMockedValueDataBindingProvider(): IValueDataBindingProvider {
  return {
    createStore: (isDataBindingTemplateProvider: boolean): IValueDataBindingStore => {
      const storeRef: MockedValueDataBindingProviderStore = {
        state: createEmtpyStoreState(),
        onStateChangedListener: undefined,
      };
      let lastKey: string | undefined = undefined;
      let lastBinding: IValueDataBinding | undefined = undefined;

      const notifyStateChange = () => {
        if (storeRef.onStateChangedListener) {
          storeRef.onStateChangedListener(cloneStoreState(storeRef));
        }
      };

      return {
        setBinding(
          key: string,
          binding?: IValueDataBinding,
          dataBindingConfig?: IDataBindingConfig,
        ): IValueDataBindingProviderState {
          // this is an optimization to avoid reinitialize if the state the provider is already synced
          if (lastKey !== key || !isEqual(binding, lastBinding)) {
            lastKey = key;
            lastBinding = binding;

            storeRef.state = createEmtpyStoreState();

            if (binding) {
              // parse the binding and set to the state storeRef
              const { dataBindingContext } = binding;
              const dataBindingPairs = dataBindingContext;
              if (dataBindingPairs) {
                FIELDS.forEach((field) => {
                  if (field in dataBindingPairs) {
                    // TODO: entityId is special as we use the entityName as the label
                    // maybe we should consider put entityName as part of the dataBindingContext
                    // so the select can be initialized with the proper label.
                    // for now, we'll only return the value, and rely on the client to
                    // properly handle the rendering when label is fetched.
                    storeRef.state.selectedOptions.push(createIdenticalLabelOption(dataBindingPairs[field]));
                  }
                });
              }
            }

            // initiate loading of entities
            asyncLoadEntityOptions(storeRef, isDataBindingTemplateProvider, dataBindingConfig, notifyStateChange);
          }

          return cloneStoreState(storeRef);
        },

        async updateSelection(
          fieldName: FIELD_NAME,
          selected: IDataFieldOption,
          dataBindingConfig?: IDataBindingConfig,
        ) {
          if (fieldName === 'entityId') {
            try {
              await validateEntityId(selected.value);
              if (storeRef.state.errors?.invalidEntityId) {
                storeRef.state.errors.invalidEntityId = false;
              }

              storeRef.state.selectedOptions[ENTITY_ID_INDEX] = selected;
              // clear rest of the selections
              storeRef.state.selectedOptions[COMPONENT_NAME_INDEX] = null;
              storeRef.state.selectedOptions[PROPERTY_NAME_INDEX] = null;

              // load component
              asyncLoadComponentNameOptions(
                storeRef,
                isDataBindingTemplateProvider,
                dataBindingConfig,
                notifyStateChange,
              );
            } catch (e) {
              if (storeRef.state.errors === undefined) {
                storeRef.state.errors = {};
              }
              storeRef.state.errors.invalidEntityId = true;
              notifyStateChange();
            }
          } else if (fieldName === 'componentName') {
            storeRef.state.selectedOptions[COMPONENT_NAME_INDEX] = selected;
            // clear rest of the selections
            storeRef.state.selectedOptions[PROPERTY_NAME_INDEX] = null;

            // load property
            asyncLoadPropertyNameOptions(storeRef, notifyStateChange);
          } else if (fieldName === 'propertyName') {
            storeRef.state.selectedOptions[PROPERTY_NAME_INDEX] = selected;
            notifyStateChange();
          } else {
            // TODO: Match template varialbes
            // const a = 20;
          }
          return cloneStoreState(storeRef);
        },

        createBinding(): Promise<IValueDataBinding> {
          return new Promise((resolve) => {
            setTimeout(() => {
              const map = {};
              FIELDS.forEach((field, index) => {
                const selectedOption = storeRef.state.selectedOptions[index];
                if (selectedOption) {
                  map[field] = selectedOption?.value;
                }
              });

              const result = {
                dataBindingContext: map,
              };

              lastBinding = result as IValueDataBinding;

              resolve(lastBinding);
            }, MOCK_DELAY);
          });
        },

        setOnStateChangedListener(listener: (state: IValueDataBindingProviderState) => void | undefined) {
          storeRef.onStateChangedListener = listener;
        },
      };
    },
    createQuery: (dataBinding: IValueDataBinding) => ({
      build: () => {
        throw new Error('not implemented testing code');
      },
      toQueryString: () => JSON.stringify(dataBinding),
    }),
  };
}
