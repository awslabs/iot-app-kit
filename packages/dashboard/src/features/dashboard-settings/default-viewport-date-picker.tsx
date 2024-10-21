import CloudscapeDateRangePicker from '@cloudscape-design/components/date-range-picker';
import CloudscapeFormField from '@cloudscape-design/components/form-field';
import { type Viewport } from '@iot-app-kit/core';
import {
  dateRangeToViewport,
  rangeValidator,
  relativeViewportOptions,
  viewportToDateRange,
} from '@iot-app-kit/core-util';
import React, { memo, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDefaultViewport } from './use-default-viewport';

export const DefaultViewportDatePicker = memo(function () {
  const [defaultViewport, setDefaultViewport] = useDefaultViewport();
  const { control, setValue, clearErrors } = useForm<{
    defaultViewport: Viewport | undefined;
  }>({
    mode: 'onChange',
  });

  useEffect(() => {
    setValue('defaultViewport', defaultViewport);
    clearErrors();
  }, [clearErrors, setValue, defaultViewport]);

  return (
    <Controller
      control={control}
      name='defaultViewport'
      render={({ field, fieldState }) => {
        return (
          <CloudscapeFormField
            label='Default viewport'
            errorText={fieldState.error?.message}
          >
            <CloudscapeDateRangePicker
              expandToViewport
              onChange={({ detail: { value } }) => {
                if (!value) return;
                setDefaultViewport(dateRangeToViewport(value));
                field.onChange(value);
              }}
              value={viewportToDateRange(defaultViewport)}
              showClearButton={false}
              relativeOptions={relativeViewportOptions}
              isValidRange={rangeValidator({
                dateRangeIncompleteError:
                  'The selected date range is incomplete. Select a start and end date for the date range.',
                dateRangeInvalidError:
                  'The selected date range is invalid. The start date must be before the end date.',
              })}
            />
          </CloudscapeFormField>
        );
      }}
    />
  );
});
