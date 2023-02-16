import React, { FC, useState } from 'react';
import {
  ExpandableSection,
  Grid,
  Input,
  Button,
  TokenGroup,
  InputProps,
  TokenGroupProps,
} from '@cloudscape-design/components';
import { NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';
import { useInputWidgetInput } from '../../utils';
import { DashboardMessages } from '~/messages';

export type InputComponentProps = {
  messageOverride: DashboardMessages;
};

const InputSettings: FC<InputComponentProps> = ({ messageOverride }) => {
  const {
    sidePanel: { inputSettings },
  } = messageOverride;
  const [options, setOptions] = useInputWidgetInput('options');
  const [label, setLabel] = useState<string>();

  const addOption: NonCancelableEventHandler<InputProps.ChangeDetail> = ({ detail: { value } }) => {
    setLabel(value);
  };

  const saveOption = () => {
    if (label) {
      setOptions([...options, { label }]);
      setLabel('');
    }
  };

  const removeOption: NonCancelableEventHandler<TokenGroupProps.DismissDetail> = ({ detail: { itemIndex } }) => {
    setOptions([...options.slice(0, itemIndex), ...options.slice(itemIndex + 1)]);
  };

  return (
    <ExpandableSection headerText={inputSettings.title} defaultExpanded>
      <Grid gridDefinition={[{ colspan: 9 }, { colspan: 3 }]}>
        <Input
          value={label || ''}
          placeholder={inputSettings.optionPlaceholder}
          onChange={addOption}
          data-test-id='input-widget-option-input'
        />
        <Button disabled={!label} onClick={saveOption} data-test-id='input-widget-add-option-btn'>
          {inputSettings.addOptionLabel}
        </Button>
      </Grid>
      <TokenGroup
        data-test-id='input-widget-token-list'
        alignment='vertical'
        onDismiss={removeOption}
        items={options}
      />
    </ExpandableSection>
  );
};

export default InputSettings;
