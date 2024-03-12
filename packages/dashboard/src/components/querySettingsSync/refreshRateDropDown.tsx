import { Alert, FormField, Modal, Select } from '@cloudscape-design/components';
import React, { useState } from 'react';
import {
  DEFAULT_REFRESH_RATE_OPTION,
  REFRESH_RATE_OPTIONS,
  REFRESH_RATE_OPTION_MAP,
} from './constants';
import { useRefreshRate } from '~/customization/hooks/useRefreshRate';
import { SECOND_IN_MS } from '@iot-app-kit/core';
import invariant from 'tiny-invariant';
import { type RefreshRate } from '@iot-app-kit/core';

export const RefreshRateDropDown = () => {
  const [refreshRate, updateRefreshRate] = useRefreshRate();
  const [visible, setVisible] = useState(refreshRate === SECOND_IN_MS);

  const currentOption =
    refreshRate != null
      ? REFRESH_RATE_OPTION_MAP[refreshRate]
      : DEFAULT_REFRESH_RATE_OPTION;

  return (
    <>
      <FormField label='Refresh rate'>
        <Select
          selectedOption={currentOption}
          onChange={({
            detail: {
              selectedOption: { value: refreshRateString },
            },
          }) => {
            invariant(
              refreshRateString != null,
              'Expected refresh rate to be defined.'
            );
            const refreshRate = parseInt(refreshRateString, 10) as RefreshRate;

            updateRefreshRate(refreshRate);
            setVisible(refreshRate === SECOND_IN_MS);
          }}
          options={REFRESH_RATE_OPTIONS}
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
