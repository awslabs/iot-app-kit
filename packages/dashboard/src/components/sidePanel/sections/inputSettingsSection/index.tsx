import React, { FC, useState } from 'react';
import merge from 'lodash/merge';
import { nanoid } from '@reduxjs/toolkit';
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

import { InputWidget } from '~/customization/widgets/types';
import { useWidgetLense } from '../../utils/useWidgetLense';

const defaultMessages = {
  title: 'Input',
  addOptionLabel: 'Add',
  optionPlaceholder: 'Add option',
};

const InputSettings: FC<InputWidget> = (widget) => {
  const [options, setOptions] = useWidgetLense<InputWidget, { label: string; id: string }[]>(
    widget,
    (w) => w.properties.options,
    (w, options) => merge(w, { properties: { options } })
  );

  const [label, setLabel] = useState<string>();

  const addOption: NonCancelableEventHandler<InputProps.ChangeDetail> = ({ detail: { value } }) => {
    setLabel(value);
  };

  const saveOption = () => {
    if (label) {
      setOptions([...options, { label, id: nanoid() }]);
      setLabel('');
    }
  };

  const removeOption: NonCancelableEventHandler<TokenGroupProps.DismissDetail> = ({ detail: { itemIndex } }) => {
    setOptions([...options.slice(0, itemIndex), ...options.slice(itemIndex + 1)]);
  };

  return (
    <ExpandableSection headerText={defaultMessages.title} defaultExpanded>
      <Grid gridDefinition={[{ colspan: 9 }, { colspan: 3 }]}>
        <Input
          value={label || ''}
          placeholder={defaultMessages.optionPlaceholder}
          onChange={addOption}
          data-test-id='input-widget-option-input'
        />
        <Button disabled={!label} onClick={saveOption} data-test-id='input-widget-add-option-btn'>
          {defaultMessages.addOptionLabel}
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
