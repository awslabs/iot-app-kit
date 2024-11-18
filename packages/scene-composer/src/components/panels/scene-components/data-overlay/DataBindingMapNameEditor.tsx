import { FormField } from '@cloudscape-design/components';
import { isEmpty } from 'lodash';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';

import { type Component } from '../../../../models/SceneModels';
import { TextInput } from '../../CommonPanelComponents';

interface IDataBindingMapNameEditorProps {
  bindingName: string;
  valueDataBindings: Component.ValueDataBindingNamedMap[];
  onBindingNameChange: (bindingName: string) => void;
}

// eslint-disable-next-line no-useless-escape
const INVALID_BINDING_NAME_CHARACTERS = /[\$\{\}\.\[\]]/g;

export const DataBindingMapNameEditor: React.FC<IDataBindingMapNameEditorProps> = ({
  bindingName,
  valueDataBindings,
  onBindingNameChange,
}) => {
  const { formatMessage } = useIntl();

  const bindingNameError = useCallback(
    (name: string) => {
      if (isEmpty(name)) {
        return formatMessage({ defaultMessage: 'Invalid name', description: 'Input error message' });
      }
      if (valueDataBindings.filter((v) => v.bindingName === name).length > 1) {
        return formatMessage({ defaultMessage: 'Duplicate name', description: 'Input error message' });
      }
      if (name.search(INVALID_BINDING_NAME_CHARACTERS) >= 0) {
        return formatMessage({ defaultMessage: 'Invalid character in the name', description: 'Input error message' });
      }
      return null;
    },
    [valueDataBindings, formatMessage],
  );

  const onNameChange = useCallback(
    (e: string | null) => {
      onBindingNameChange(e || '');
    },
    [onBindingNameChange],
  );

  return (
    <FormField
      errorText={bindingNameError(bindingName)}
      label={formatMessage({ defaultMessage: 'Binding Name', description: 'FormField label' })}
    >
      <TextInput data-testid='binding-name-input' value={bindingName} setValue={onNameChange} />
    </FormField>
  );
};
