import { useCallback, useRef } from 'react';
import { isEqual } from 'lodash';

import {
  IValueDataBindingProvider,
  IDataFieldOption,
  IDataBindingConfig,
  IValueDataBinding,
  IValueDataBindingStore,
  IValueDataBindingProviderState,
} from '../src/interfaces';
import { createDataFrameLabel } from '../src/utils/dataFrameLabelUtils';
import {
  ENTITY_ID_INDEX,
  COMPONENT_NAME_INDEX,
  PROPERTY_NAME_INDEX,
} from '../src/components/panels/scene-components/ValueDataBindingBuilder';

import {
  asyncLoadEntityOptions,
  asyncLoadComponentNameOptions,
  asyncLoadPropertyNameOptions,
  cloneStoreState,
  createEmtpyStoreState,
  createIdenticalLabelOption,
  validateEntityId,
} from './useMockedValueDataBindingProviderUtils';
import { FIELD_NAME, MockedValueDataBindingProviderStore } from './types';
import { FIELDS, MOCK_DELAY } from './constants';

export const propertyNames = Object.seal(['temperature']);

export function useMockedValueDataBindingProvider(): IValueDataBindingProvider {
  return {
    useStore: (isDataBindingTemplateProvider: boolean): IValueDataBindingStore => {
      const storeRef = useRef<MockedValueDataBindingProviderStore>({
        state: createEmtpyStoreState(),
        onStateChangedListener: undefined,
      });
      const lastKey = useRef<string>();
      const lastBinding = useRef<IValueDataBinding>();

      const notifyStateChange = useCallback(() => {
        if (storeRef.current.onStateChangedListener) {
          storeRef.current.onStateChangedListener(cloneStoreState(storeRef.current));
        }
      }, []);

      return {
        setBinding(
          key: string,
          binding?: IValueDataBinding,
          dataBindingConfig?: IDataBindingConfig,
        ): IValueDataBindingProviderState {
          // this is an optimization to avoid reinitialize if the state the provider is already synced
          if (lastKey.current !== key || !isEqual(binding, lastBinding.current)) {
            lastKey.current = key;
            lastBinding.current = binding;

            storeRef.current.state = createEmtpyStoreState();

            if (binding) {
              // parse the binding and set to the state storeRef
              const { dataBindingContext } = binding;
              const dataBindingPairs = dataBindingContext as Record<string, string>;
              if (dataBindingPairs) {
                FIELDS.forEach((field) => {
                  if (field in dataBindingPairs) {
                    // TODO: entityId is special as we use the entityName as the label
                    // maybe we should consider put entityName as part of the dataBindingContext
                    // so the select can be initialized with the proper label.
                    // for now, we'll only return the value, and rely on the client to
                    // properly handle the rendering when label is fetched.
                    storeRef.current.state.selectedOptions.push(createIdenticalLabelOption(dataBindingPairs[field]));
                  }
                });
              }
            }

            // initiate loading of entities
            asyncLoadEntityOptions(
              storeRef.current,
              isDataBindingTemplateProvider,
              dataBindingConfig,
              notifyStateChange,
            );
          }

          return cloneStoreState(storeRef.current);
        },

        async updateSelection(
          fieldName: FIELD_NAME,
          selected: IDataFieldOption,
          dataBindingConfig?: IDataBindingConfig,
        ) {
          if (fieldName === 'entityId') {
            try {
              await validateEntityId(selected.value);
              if (storeRef.current.state.errors?.invalidEntityId) {
                storeRef.current.state.errors.invalidEntityId = false;
              }

              storeRef.current.state.selectedOptions[ENTITY_ID_INDEX] = selected;
              // clear component selection
              storeRef.current.state.selectedOptions[COMPONENT_NAME_INDEX] = undefined as any;
              storeRef.current.state.selectedOptions[PROPERTY_NAME_INDEX] = undefined as any;

              // load component
              asyncLoadComponentNameOptions(
                storeRef.current,
                isDataBindingTemplateProvider,
                dataBindingConfig,
                notifyStateChange,
              );
            } catch (e) {
              if (storeRef.current.state.errors === undefined) {
                storeRef.current.state.errors = {};
              }
              storeRef.current.state.errors.invalidEntityId = true;
              notifyStateChange();
            }
          } else if (fieldName === 'componentName') {
            storeRef.current.state.selectedOptions[COMPONENT_NAME_INDEX] = selected;
            // clear propertyName selection
            storeRef.current.state.selectedOptions[PROPERTY_NAME_INDEX] = undefined as any;

            // load property
            asyncLoadPropertyNameOptions(storeRef.current, dataBindingConfig, notifyStateChange);
          } else if (fieldName === 'propertyName') {
            storeRef.current.state.selectedOptions[PROPERTY_NAME_INDEX] = selected;
            notifyStateChange();
          } else {
            // TODO: Match template varialbes
            // const a = 20;
          }
        },

        createBinding(): Promise<IValueDataBinding> {
          return new Promise((resolve) => {
            setTimeout(() => {
              const map = {};
              FIELDS.forEach((field, index) => {
                const selectedOption = storeRef.current.state.selectedOptions[index];
                map[field] = selectedOption.value;
              });

              const result = {
                dataBindingContext: map,
                dataFrameLabel: createDataFrameLabel([map]),
              };

              resolve(result);
            }, MOCK_DELAY);
          });
        },

        setOnStateChangedListener(listener: (state: IValueDataBindingProviderState) => void | undefined) {
          storeRef.current.onStateChangedListener = listener;
        },
      };
    },
  };
}
