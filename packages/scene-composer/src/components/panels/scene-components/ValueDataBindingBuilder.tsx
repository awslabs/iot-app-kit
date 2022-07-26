import React, { useContext, useEffect, useState } from 'react';
import { Autosuggest, FormField, Select, SpaceBetween } from '@awsui/components-react';
import { useIntl, defineMessages } from 'react-intl';

import useLifecycleLogging from '../../../logger/react-logger/hooks/useLifecycleLogging';
import { EMPTY_VALUE_DATA_BINDING_PROVIDER_STATE } from '../../../common/constants';
import {
  IValueDataBindingProvider,
  IDataFieldOption,
  IValueDataBinding,
  IValueDataBindingProviderState,
} from '../../../interfaces';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { useStore } from '../../../store';
import { pascalCase } from '../../../utils/stringUtils';
import { dataBindingConfigSelector } from '../../../utils/dataBindingTemplateUtils';

export const ENTITY_ID_INDEX = 0;
export const COMPONENT_NAME_INDEX = 1;
export const PROPERTY_NAME_INDEX = 2;
export interface IValueDataBindingBuilderProps {
  componentRef: string;
  binding?: IValueDataBinding;
  valueDataBindingProvider: IValueDataBindingProvider;
  onChange: (valueDataBinding: IValueDataBinding) => void;
}

export const ValueDataBindingBuilder: React.FC<IValueDataBindingBuilderProps> = ({
  componentRef,
  binding,
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

  useEffect(() => {
    // Subscribe to the changes
    valueDataBindingStore.setOnStateChangedListener((state) => {
      setBuilderState(state);
    });
    return () => valueDataBindingStore.setOnStateChangedListener(undefined);
  }, [valueDataBindingProvider]);

  useEffect(() => {
    // Initiate the provider
    const state = valueDataBindingStore.setBinding(componentRef, binding, dataBindingConfig);
    setBuilderState(state);
    setAutoSuggestValue(builderState.selectedOptions[ENTITY_ID_INDEX]?.value || '');
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
                  options={options}
                  enteredTextLabel={(item) => `${item}`}
                  virtualScroll
                  value={autoSuggestValue}
                  invalid={builderState.errors?.invalidEntityId}
                  onChange={(event) => {
                    setAutoSuggestValue(event.detail.value);
                    valueDataBindingStore.updateSelection(
                      definition.fieldName,
                      { value: event.detail.value },
                      dataBindingConfig,
                    );
                  }}
                />
              </FormField>
            );
          }

          return (
            <FormField
              label={
                intl.formatMessage(i18nDataBindingLabelKeysStrings[definition.fieldName]) ||
                pascalCase(definition.fieldName)
              }
              key={definition.fieldName}
            >
              <Select
                data-testid={'value-data-binding-builder-select'}
                selectedOption={selectedOption}
                onChange={async (e) => {
                  valueDataBindingStore.updateSelection(
                    definition.fieldName,
                    e.detail.selectedOption,
                    dataBindingConfig,
                  );
                  // trigger data binding context creation if the selected option is in the last slot
                  if (index === builderState.definitions.length - 1) {
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
