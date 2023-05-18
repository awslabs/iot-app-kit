import { Autosuggest, Box, FormField, Select, SpaceBetween } from '@awsui/components-react';
import React, { useContext, useEffect, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { EMPTY_VALUE_DATA_BINDING_PROVIDER_STATE } from '../../../../common/constants';
import { sceneComposerIdContext } from '../../../../common/sceneComposerIdContext';
import {
  IDataFieldOption,
  IValueDataBinding,
  IValueDataBindingProvider,
  IValueDataBindingProviderState,
} from '../../../../interfaces';
import useLifecycleLogging from '../../../../logger/react-logger/hooks/useLifecycleLogging';
import { useStore } from '../../../../store';
import { dataBindingConfigSelector } from '../../../../utils/dataBindingTemplateUtils';
import { pascalCase } from '../../../../utils/stringUtils';

export const ENTITY_ID_INDEX = 0;
export const COMPONENT_NAME_INDEX = 1;
export const PROPERTY_NAME_INDEX = 2;
export interface IValueDataBindingBuilderProps {
  componentRef: string;
  binding?: IValueDataBinding;
  allowPartialBinding?: boolean;
  numFields?: number;
  valueDataBindingProvider: IValueDataBindingProvider;
  onChange: (valueDataBinding: IValueDataBinding) => void;
}

export const ValueDataBindingBuilder: React.FC<IValueDataBindingBuilderProps> = ({
  componentRef,
  binding,
  allowPartialBinding,
  numFields,
  valueDataBindingProvider,
  onChange,
}: IValueDataBindingBuilderProps) => {
  useLifecycleLogging(`ValueDataBindingBuilder[${componentRef}]`);

  const sceneComposerId = useContext(sceneComposerIdContext);
  const dataBindingConfig = useStore(sceneComposerId)(dataBindingConfigSelector);
  const valueDataBindingStore = valueDataBindingProvider.useStore(false);
  const [builderState, setBuilderState] = useState<IValueDataBindingProviderState>(
    EMPTY_VALUE_DATA_BINDING_PROVIDER_STATE,
  );
  const [autoSuggestValue, setAutoSuggestValue] = useState('');

  const intl = useIntl();
  const i18nDataBindingLabelKeysStrings = defineMessages({
    entityId: {
      defaultMessage: 'Entity Id',
      description: 'Form Field label',
    },
    componentName: {
      defaultMessage: 'Component Name',
      description: 'Form Field label',
    },
    propertyName: {
      defaultMessage: 'Property Name',
      description: 'Form Field label',
    },
    entityPath: {
      defaultMessage: 'Entity Path',
      description: 'Form Field label',
    },
    componentTypeId: {
      defaultMessage: 'Component Type Id',
      description: 'Form Field label',
    },
  });

  const filterBuilderState = (state: IValueDataBindingProviderState) => {
    if (numFields) {
      return {
        definitions: state.definitions.slice(0, numFields),
        selectedOptions: state.selectedOptions.slice(0, numFields),
      };
    }
    return state;
  };

  useEffect(() => {
    // Subscribe to the changes
    valueDataBindingStore.setOnStateChangedListener((state) => {
      setBuilderState(filterBuilderState(state));
    });
    return () => valueDataBindingStore.setOnStateChangedListener(undefined);
  }, [valueDataBindingProvider]);

  useEffect(() => {
    // Initiate the provider
    const state = valueDataBindingStore.setBinding(componentRef, binding, dataBindingConfig);
    setBuilderState(filterBuilderState(state));
    setAutoSuggestValue(state.selectedOptions[ENTITY_ID_INDEX]?.value || '');
  }, [componentRef, binding, valueDataBindingProvider, dataBindingConfig]);

  return (
    <React.Fragment>
      <SpaceBetween size='s'>
        {builderState.definitions.map((definition, index) => {
          const { options, state } = definition;
          let selectedOption: IDataFieldOption | null = null;
          if (index < builderState.selectedOptions.length) {
            selectedOption = builderState.selectedOptions[index];
          }
          const disabled = state !== 'ready';
          if (definition.fieldName === 'entityId') {
            return (
              <FormField
                label={
                  intl.formatMessage(i18nDataBindingLabelKeysStrings[definition.fieldName]) ||
                  pascalCase(definition.fieldName)
                }
                key={definition.fieldName}
              >
                <Autosuggest
                  data-testid='select-entityId'
                  options={options}
                  enteredTextLabel={(item) => `${item}`}
                  virtualScroll
                  value={autoSuggestValue}
                  invalid={builderState.errors?.invalidEntityId}
                  onChange={async (event) => {
                    setAutoSuggestValue(event.detail.value);
                    await valueDataBindingStore.updateSelection(
                      definition.fieldName,
                      { value: event.detail.value },
                      dataBindingConfig,
                    );
                    if (allowPartialBinding) {
                      // take a snapshot of the callback in case the onChange function changed during
                      // the async processing.
                      const memorizedOnChange = onChange;
                      valueDataBindingStore.createBinding().then((value) => {
                        if (value) {
                          memorizedOnChange(value);
                        }
                      });
                    }
                  }}
                />
              </FormField>
            );
          }
          return (
            <FormField
              label={
                <Box>
                  {intl.formatMessage(i18nDataBindingLabelKeysStrings[definition.fieldName]) ||
                    pascalCase(definition.fieldName)}
                  {allowPartialBinding && (
                    <Box display='inline'>
                      <i>{` - ${intl.formatMessage({
                        defaultMessage: 'optional',
                        description: 'FormField label suffix',
                      })}`}</i>
                    </Box>
                  )}
                </Box>
              }
              key={definition.fieldName}
            >
              <Select
                data-testid='value-data-binding-builder-select'
                selectedOption={selectedOption}
                onChange={async (e) => {
                  await valueDataBindingStore.updateSelection(
                    definition.fieldName,
                    e.detail.selectedOption,
                    dataBindingConfig,
                  );
                  // trigger data binding context creation if the selected option is in the last slot or partial binding
                  // is allowed
                  if (index === builderState.definitions.length - 1 || allowPartialBinding) {
                    // take a snapshot of the callback in case the onChange function changed during
                    // the async processing.
                    const memorizedOnChange = onChange;
                    valueDataBindingStore.createBinding().then((value) => {
                      if (value) {
                        memorizedOnChange(value);
                      }
                    });
                  }
                }}
                options={options}
                disabled={disabled}
                placeholder={intl.formatMessage({ defaultMessage: 'Select an option', description: 'placeholder' })}
              />
            </FormField>
          );
        })}
      </SpaceBetween>
    </React.Fragment>
  );
};
