import React, { useContext } from 'react';
import { FormField, Select, SpaceBetween } from '@awsui/components-react';
import { useIntl } from 'react-intl';

import { IValueDataBinding, IValueDataBindingProvider } from '../../../../interfaces';
import { IMotionIndicatorComponentInternal, useSceneDocument } from '../../../../store';
import { sceneComposerIdContext } from '../../../../common/sceneComposerIdContext';
import { Component } from '../../../../models/SceneModels';
import { ValueDataBindingBuilder } from '../ValueDataBindingBuilder';

interface IDataBindingEditorProps {
  valueDataBindingProvider: IValueDataBindingProvider | undefined;
  component: IMotionIndicatorComponentInternal;
  onUpdateCallback: (componentPartial: any, replace?: boolean | undefined) => void;
  dataBindingName: Component.MotionIndicatorDataBindingName;
}

export const DataBindingEditor: React.FC<IDataBindingEditorProps> = ({
  valueDataBindingProvider,
  component,
  onUpdateCallback,
  dataBindingName,
}) => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const { listSceneRuleMapIds } = useSceneDocument(sceneComposerId);
  const intl = useIntl();

  const ruleMapIds = listSceneRuleMapIds();
  const selectedRuleId =
    component.valueDataBindings[dataBindingName]?.ruleBasedMapId &&
    ruleMapIds.includes(component.valueDataBindings[dataBindingName]?.ruleBasedMapId || '')
      ? component.valueDataBindings[dataBindingName]?.ruleBasedMapId
      : null;
  const ruleOptions = ruleMapIds
    .concat(selectedRuleId ? 'No Rule' : [])
    .map((ruleMapId) => ({ label: ruleMapId, value: ruleMapId }));

  return (
    <SpaceBetween size='s'>
      {valueDataBindingProvider && (
        <ValueDataBindingBuilder
          componentRef={component.ref}
          binding={component.valueDataBindings[dataBindingName]?.valueDataBinding}
          valueDataBindingProvider={valueDataBindingProvider}
          onChange={(valueDataBinding: IValueDataBinding) => {
            // we don't want to merge the dataBindingContext, so we'll need to manually replace it
            const updatedComponent = {
              ...component,
              valueDataBindings: {
                ...component.valueDataBindings,
                [dataBindingName]: {
                  ...component.valueDataBindings[dataBindingName],

                  valueDataBinding,
                },
              },
            };
            onUpdateCallback(updatedComponent, true);
          }}
        />
      )}

      <FormField label={intl.formatMessage({ defaultMessage: 'Rule Id', description: 'FormField label' })}>
        <Select
          data-testid={`motion-indicator-${dataBindingName}-rule-id-select`}
          selectedOption={selectedRuleId ? { label: selectedRuleId, value: selectedRuleId } : null}
          onChange={(e) => {
            let ruleMapId = e.detail.selectedOption.value;
            if (ruleMapId && !ruleMapIds.includes(ruleMapId)) {
              ruleMapId = undefined;
            }
            const updatedComponent = {
              ...component,
              valueDataBindings: {
                ...component.valueDataBindings,
                [dataBindingName]: {
                  ...component.valueDataBindings[dataBindingName],
                  ruleBasedMapId: ruleMapId,
                },
              },
            };

            onUpdateCallback(updatedComponent, true);
          }}
          options={ruleOptions}
          selectedAriaLabel={intl.formatMessage({
            defaultMessage: 'Selected',
            description:
              'Specifies the localized string that describes an option as being selected. This is required to provide a good screen reader experience',
          })}
          disabled={ruleMapIds.length === 0}
          placeholder={intl.formatMessage({ defaultMessage: 'Choose a rule', description: 'Placeholder' })}
        />
      </FormField>
    </SpaceBetween>
  );
};
