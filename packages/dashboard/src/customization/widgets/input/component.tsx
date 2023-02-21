import React from 'react';
import { useSelector } from 'react-redux';
import { NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';
import { Button, Select, SelectProps } from '@cloudscape-design/components';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { DashboardState } from '~/store/state';
import { InputWidget } from '../types';
import { useWidgetActions } from '../../hooks/useWidgetActions';

const InputWidgetComponent: React.FC<InputWidget> = (widget) => {
  const readOnly = useSelector((state: DashboardState) => state.readOnly);

  const { update } = useWidgetActions();

  const { options, selectedOption } = widget.properties;

  const disabled = !readOnly || options.length === 0;
  // const isSelectedOptionValid = options.filter(({ label }) => selectedOption?.label === label).length > 0;

  const changeOption: NonCancelableEventHandler<SelectProps.ChangeDetail> = ({ detail: { selectedOption } }) => {
    update({
      ...widget,
      properties: {
        ...widget.properties,
        selectedOption,
      },
    });
  };

  return (
    <SpaceBetween size='xs' direction='horizontal'>
      <Select
        data-test-id='input-widget-options'
        disabled={disabled}
        selectedOption={selectedOption || null}
        onChange={changeOption}
        options={options}
      />
      <Button disabled={disabled} data-test-id='input-widget-submit-btn'>
        Send
      </Button>
    </SpaceBetween>
  );
};

export default InputWidgetComponent;
