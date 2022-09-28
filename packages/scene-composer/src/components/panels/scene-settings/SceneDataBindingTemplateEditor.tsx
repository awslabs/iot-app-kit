import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { cloneDeep } from 'lodash';
import { FormField, Select } from '@awsui/components-react';

import useLifecycleLogging from '../../../logger/react-logger/hooks/useLifecycleLogging';
import { EMPTY_VALUE_DATA_BINDING_PROVIDER_STATE } from '../../../common/constants';
import { useStore } from '../../../store';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import {
  IDataBindingConfig,
  IDataFieldOption,
  IValueDataBinding,
  IValueDataBindingProvider,
  IValueDataBindingProviderState,
  KnownSceneProperty,
} from '../../../interfaces';
import { dataBindingConfigSelector } from '../../../utils/dataBindingTemplateUtils';

interface SceneDataBindingTemplateEditorProps {
  valueDataBindingProvider: IValueDataBindingProvider;
}

export const SceneDataBindingTemplateEditor: React.FC<SceneDataBindingTemplateEditorProps> = ({
  valueDataBindingProvider,
}) => {
  useLifecycleLogging('SceneDataBindingTemplateEditor');

  const sceneComposerId = useContext(sceneComposerIdContext);
  const intl = useIntl();
  const { setSceneProperty, clearTemplatizedDataBindings } = useStore(sceneComposerId)();
  const dataBindingConfig: IDataBindingConfig = useStore(sceneComposerId)(dataBindingConfigSelector);
  const valueDataBindingStore = valueDataBindingProvider.useStore(true);
  const [dirty, setDirty] = useState(false);
  const [builderState, setBuilderState] = useState<IValueDataBindingProviderState>(
    EMPTY_VALUE_DATA_BINDING_PROVIDER_STATE,
  );

  const filterBuilderState = useCallback(
    (state: IValueDataBindingProviderState) => {
      const bindingTemplateNumOfFields = Object.keys(dataBindingConfig.fieldMapping).length;
      return {
        definitions: state.definitions.slice(0, bindingTemplateNumOfFields),
        selectedOptions: state.selectedOptions.slice(0, bindingTemplateNumOfFields),
      };
    },
    [valueDataBindingProvider],
  );

  useEffect(() => {
    // Subscribe on changes
    valueDataBindingStore.setOnStateChangedListener((state) => {
      setBuilderState(filterBuilderState(state));
    });
    return () => valueDataBindingStore.setOnStateChangedListener(undefined);
  }, [valueDataBindingProvider]);

  const [dataBinding, fieldDisplayNames] = useMemo(() => {
    const fieldDisplayNames: Record<string, string> = {};
    const dataBindingContext = {};
    const dataBinding: IValueDataBinding = { dataBindingContext };

    Object.keys(dataBindingConfig.fieldMapping).forEach((key) => {
      // TwinMaker V1 only uses 1 data binding value
      const templateName = dataBindingConfig.fieldMapping[key][0];
      const templateReference = dataBindingConfig.template?.[templateName];
      fieldDisplayNames[key] = templateName;

      if (templateReference) {
        dataBindingContext[key] = templateReference;
      }
    });

    return [dataBinding, fieldDisplayNames];
  }, [dataBindingConfig]);

  // Save to template variables
  useEffect(() => {
    if (dirty) {
      const newDataBindingConfig: IDataBindingConfig = {
        fieldMapping: cloneDeep(dataBindingConfig.fieldMapping),
        template: {},
      };
      for (let i = 0; i < builderState.definitions.length; ++i) {
        if (!builderState.selectedOptions[i]?.value) {
          break;
        }

        const definition = builderState.definitions[i];
        // TODO: TwinMaker V1 only uses the first mapping
        const templateField = newDataBindingConfig.fieldMapping[definition.fieldName][0];
        newDataBindingConfig.template![templateField] = builderState.selectedOptions[i].value!;
      }

      setSceneProperty(KnownSceneProperty.DataBindingConfig, newDataBindingConfig);
      clearTemplatizedDataBindings();

      setDirty(false);
    }
  }, [dirty]);

  useEffect(() => {
    // Initiate the provider
    const state = valueDataBindingStore.setBinding('SceneDataBindingTemplateEditor', dataBinding, dataBindingConfig);
    setBuilderState(filterBuilderState(state));
  }, [dataBindingConfig, valueDataBindingProvider]);

  return (
    <React.Fragment>
      {builderState.definitions.map((definition, index) => {
        const { options, state } = definition;
        let selectedOption: IDataFieldOption | null = null;
        if (index < builderState.selectedOptions.length) {
          selectedOption = builderState.selectedOptions[index];
        }
        const disabled = state !== 'ready';
        const fieldDisplayName = fieldDisplayNames?.[definition.fieldName] ?? definition.fieldName;

        return (
          <FormField label={fieldDisplayName} key={definition.fieldName}>
            <Select
              selectedOption={selectedOption}
              onChange={async (e) => {
                valueDataBindingStore.updateSelection(definition.fieldName, e.detail.selectedOption, dataBindingConfig);
                setDirty(true);
              }}
              options={options}
              disabled={disabled}
              placeholder={intl.formatMessage({ defaultMessage: 'Select an option', description: 'Section title' })}
            />
          </FormField>
        );
      })}
    </React.Fragment>
  );
};
