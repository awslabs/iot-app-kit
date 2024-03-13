import { Alert, FormField, Modal, Select } from '@cloudscape-design/components';
import React, { useState } from 'react';
import {
  DEFAULT_REFRESH_RATE,
  DEFAULT_OPTION,
  refreshRateOptionMap,
  refreshRateOptions,
} from './utils';
import { useRefreshRate } from '~/customization/hooks/useRefreshRate';
import { SECOND_IN_MS } from '@iot-app-kit/core';

export const RefreshRateDropDown = () => {
  const [refreshRate, updateRefreshRate] = useRefreshRate();
  const [visible, setVisible] = useState(refreshRate === SECOND_IN_MS);

  const currentOption =
    refreshRateOptionMap[refreshRate ?? DEFAULT_REFRESH_RATE];

  return (
    <>
      <FormField label='Refresh rate'>
        <Select
          selectedOption={currentOption ?? DEFAULT_OPTION}
          onChange={({ detail }) => {
            updateRefreshRate(
              parseInt(
                detail.selectedOption.value ?? DEFAULT_REFRESH_RATE.toString()
              )
            );
            setVisible(detail.selectedOption.value === SECOND_IN_MS.toString());
          }}
          options={refreshRateOptions}
        />
      </FormField>
      <Modal
        onDismiss={() => setVisible(false)}
        visible={visible}
        header='Potential Performance Impact'
      >
        <Alert statusIconAriaLabel='Warning' type='warning'>
          You may experience some lag by selecting the 1 second refresh rate.
        </Alert>
      </Modal>
    </>
  );
};
