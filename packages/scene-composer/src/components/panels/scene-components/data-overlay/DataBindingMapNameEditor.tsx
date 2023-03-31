import React, { useCallback } from 'react';
import { FormField, Input } from '@awsui/components-react';
import { useIntl } from 'react-intl';
import { isEmpty } from 'lodash';

import { IDataOverlayComponentInternal } from '../../../../store';
import { Component } from '../../../../models/SceneModels';

interface IDataBindingMapNameEditorProps {
  bindingName: string;
  index: number;
  valueDataBindings: Component.ValueDataBindingNamedMap[];
  onUpdateCallback: (componentPartial: Partial<IDataOverlayComponentInternal>, replace?: boolean | undefined) => void;
}

export const DataBindingMapNameEditor: React.FC<IDataBindingMapNameEditorProps> = ({
  bindingName,
  index,
  valueDataBindings,
  onUpdateCallback,
}) => {
  const { formatMessage } = useIntl();

  const bindingNameError = useCallback(
    (bindingName) => {
      if (isEmpty(bindingName)) {
        return formatMessage({ defaultMessage: 'Invalid name', description: 'Input error message' });
      }
      if (valueDataBindings.filter((v) => v.bindingName === bindingName).length > 1) {
        return formatMessage({ defaultMessage: 'Duplicate name', description: 'Input error message' });
      }
      return null;
    },
    [valueDataBindings, formatMessage],
  );

  const onBindingNameChange = useCallback(
    (e, index) => {
      const newBindings = [...valueDataBindings];
      newBindings[index] = { ...newBindings[index], bindingName: e.detail.value };
      onUpdateCallback({ valueDataBindings: newBindings });
    },
    [valueDataBindings, onUpdateCallback],
  );

  return (
    <FormField
      errorText={bindingNameError(bindingName)}
      label={formatMessage({ defaultMessage: 'Binding Name', description: 'FormField label' })}
    >
      <Input data-test-id='binding-name-input' value={bindingName} onChange={(e) => onBindingNameChange(e, index)} />
    </FormField>
  );
};
