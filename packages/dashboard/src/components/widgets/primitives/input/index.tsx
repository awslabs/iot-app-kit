import React, { useState } from 'react';
import { Button, Select, SelectProps } from '@cloudscape-design/components';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { InputWidget as InputWidgetType } from '~/types';

export type InputWidgetProps = InputWidgetType & { readOnly: boolean };

const Input: React.FC<InputWidgetProps> = ({ readOnly, ...widget }) => {
  const [selectedOption, setSelectedOption] = useState<SelectProps.Option>(widget.options[0]);

  return (
    <SpaceBetween size='xs' direction='horizontal'>
      <Select
        disabled={!readOnly}
        selectedOption={selectedOption}
        onChange={({ detail }) => setSelectedOption(detail.selectedOption)}
        options={widget.options}
      />
      <Button disabled={!readOnly}>{widget.messageOverrides?.submitLabel}</Button>
    </SpaceBetween>
  );
};

export default Input;
