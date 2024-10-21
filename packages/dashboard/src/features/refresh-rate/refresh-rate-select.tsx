import FormField from '@cloudscape-design/components/form-field';
import Select, { type SelectProps } from '@cloudscape-design/components/select';
import { SECOND_IN_MS } from '@iot-app-kit/core';
import React, { memo, useCallback, useState } from 'react';
import { useDashboardRefreshRate } from '~/store/dashboard/use-dashboard-refresh-rate';
import { ConfirmRefreshRateModal } from './confirm-refresh-rate-modal';
import { REFRESH_RATE_OPTIONS, REFRESH_RATE_OPTION_MAP } from './constants';
import type { RefreshRate, RefreshRateOption } from './types';

export const RefreshRateSelect = memo(function () {
  const [refreshRate, updateRefreshRate] = useDashboardRefreshRate();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<RefreshRateOption>(
    REFRESH_RATE_OPTION_MAP[refreshRate]
  );

  const handleChange = useCallback(
    ({
      detail: { selectedOption },
    }: Parameters<NonNullable<SelectProps['onChange']>>[0]) => {
      const refreshRateOption = selectedOption as RefreshRateOption;
      const updatedRefreshRate = parseInt(
        refreshRateOption.value,
        10
      ) as RefreshRate;

      setSelectedOption(refreshRateOption);
      if (updatedRefreshRate === SECOND_IN_MS) {
        setIsVisible(true);
      } else {
        updateRefreshRate(updatedRefreshRate);
      }
    },
    [updateRefreshRate]
  );

  const handleDismiss = useCallback(() => {
    setSelectedOption(REFRESH_RATE_OPTION_MAP[refreshRate]);
    setIsVisible(false);
  }, [refreshRate]);

  const handleConfirm = useCallback(() => {
    const updatedRefreshRate = parseInt(
      selectedOption.value,
      10
    ) as RefreshRate;

    updateRefreshRate(updatedRefreshRate);
    setIsVisible(false);
  }, [selectedOption.value, updateRefreshRate]);

  return (
    <>
      <FormField label='Refresh rate'>
        <Select
          selectedOption={selectedOption}
          onChange={handleChange}
          options={REFRESH_RATE_OPTIONS}
        />
      </FormField>

      <ConfirmRefreshRateModal
        visible={isVisible}
        onConfirm={handleConfirm}
        onCancel={handleDismiss}
      />
    </>
  );
});
