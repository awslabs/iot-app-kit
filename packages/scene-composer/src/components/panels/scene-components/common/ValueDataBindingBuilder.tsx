import {
  Autosuggest,
  Box,
  FormField,
  Select,
  SpaceBetween,
  Button,
  Popover,
  StatusIndicator,
} from '@cloudscape-design/components';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
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

import './ValueDataBindingBuilder.scss';

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
  const valueDataBindingStore = useMemo(
    () => valueDataBindingProvider.createStore(false),
    [valueDataBindingProvider, componentRef],
  );
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
        ...state,
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
  }, [valueDataBindingStore]);

  useEffect(() => {
    // Initiate the provider
    const state = valueDataBindingStore.setBinding(componentRef, binding, dataBindingConfig);
    setAutoSuggestValue(state.selectedOptions[ENTITY_ID_INDEX]?.value || '');
  }, [componentRef, binding, valueDataBindingStore, dataBindingConfig]);

  const onEntityIdChange = useCallback(
    (fieldName: string, fieldIndex: number) => async (event) => {
      setAutoSuggestValue(event.detail.value);

      const states = await valueDataBindingStore.updateSelection(fieldName, {
        value: event.detail.value,
      });

      // The partial binding is valid when the value is saved in selectedOptions. Save the binding
      // only when the partial binding is valid.
      if (
        allowPartialBinding &&
        states.selectedOptions.length > fieldIndex &&
        states.selectedOptions[fieldIndex]?.value === event.detail.value
      ) {
        // take a snapshot of the callback in case the onChange function changed during
        // the async processing.
        const memorizedOnChange = onChange;
        valueDataBindingStore.createBinding().then((value) => {
          if (value) {
            memorizedOnChange(value);
          }
        });
      }
    },
    [valueDataBindingStore, allowPartialBinding, onChange],
  );

  const onSelectChange = useCallback(
    (fieldName: string, fieldIndex: number) => async (e) => {
      const states = await valueDataBindingStore.updateSelection(fieldName, e.detail.selectedOption);
      // trigger data binding context creation if the selected option is in the last slot or partial binding
      // is allowed
      if (fieldIndex === states.definitions.length - 1 || allowPartialBinding) {
        // take a snapshot of the callback in case the onChange function changed during
        // the async processing.
        const memorizedOnChange = onChange;
        valueDataBindingStore.createBinding().then((value) => {
          if (value) {
            memorizedOnChange(value);
          }
        });
      }
    },
    [valueDataBindingStore, allowPartialBinding, onChange],
  );

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
                  onChange={onEntityIdChange(definition.fieldName, index)}
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
              <div className='tm-copy-select-flex'>
                {definition.fieldName === 'propertyName' && (
                  <Box>
                    {selectedOption && (
                      <Popover
                        size='small'
                        position='top'
                        triggerType='custom'
                        dismissButton={false}
                        content={<StatusIndicator type='success'>{selectedOption.label + ' copied'} </StatusIndicator>}
                      >
                        <Button
                          variant='icon'
                          iconName='copy'
                          ariaLabel={intl.formatMessage({
                            defaultMessage: 'Copy button',
                            description: 'Copies the property name',
                          })}
                          onClick={async () => {
                            await navigator.clipboard.writeText(selectedOption!.label ? selectedOption!.label : '');
                          }}
                        />
                      </Popover>
                    )}
                  </Box>
                )}
                <div className='tm-full-width'>
                  <Select
                    data-testid='value-data-binding-builder-select'
                    selectedOption={selectedOption}
                    onChange={onSelectChange(definition.fieldName, index)}
                    options={options}
                    disabled={disabled}
                    placeholder={intl.formatMessage({
                      defaultMessage: 'Select an option',
                      description: 'placeholder',
                    })}
                  />
                </div>
              </div>
            </FormField>
          );
        })}
      </SpaceBetween>
    </React.Fragment>
  );
};
