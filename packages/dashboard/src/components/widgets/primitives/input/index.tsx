import React, { useState, useEffect } from 'react';
import { NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';
import { Button, Select, SelectProps } from '@cloudscape-design/components';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { InputWidget as InputWidgetType } from '~/types';

export type InputWidgetProps = InputWidgetType & { readOnly: boolean };

const Input: React.FC<InputWidgetProps> = ({ readOnly, ...widget }) => {
  const options = widget.options.map(({ label }) => ({ label, value: label }));
  const [selectedOption, setSelectedOption] = useState<SelectProps.Option | null>(options[0]);
  const disabled = !readOnly || options.length === 0;
  const isSelectedOptionValid = options.filter(({ label }) => selectedOption?.label === label).length > 0;

  const changeOption: NonCancelableEventHandler<SelectProps.ChangeDetail> = ({ detail: { selectedOption } }) => {
    setSelectedOption(selectedOption);
  };

  useEffect(() => {
    if (options.length === 0) {
      setSelectedOption(null);
    } else if (!isSelectedOptionValid) {
      setSelectedOption(options[0]);
    }
  }, [options]);

  return (
    <SpaceBetween size='xs' direction='horizontal'>
      <Select
        data-test-id='input-widget-options'
        disabled={disabled}
        selectedOption={selectedOption}
        onChange={changeOption}
        options={options}
      />
      <Button disabled={disabled} data-test-id='input-widget-submit-btn'>
        {widget.messageOverrides?.submitLabel}
      </Button>
    </SpaceBetween>
  );
};

export default Input;
