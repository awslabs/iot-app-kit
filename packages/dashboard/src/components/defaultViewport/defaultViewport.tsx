import { DateRangePicker, FormField } from '@cloudscape-design/components';
import {
  relativeViewportOptions,
  viewportToDateRange,
  dateRangeToViewport,
  rangeValidator,
} from '@iot-app-kit/core-util';
import { Viewport } from '@iot-app-kit/core';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { messages } from './constants';
import { useDefaultViewport } from './useDefaultViewport';

export const DefaultViewport = () => {
  const { defaultViewport, onUpdateDefaultViewport } = useDefaultViewport();

  const { control, setValue, clearErrors } = useForm<{
    defaultViewport: Viewport | undefined;
  }>({
    mode: 'onChange',
  });

  useEffect(() => {
    setValue('defaultViewport', defaultViewport);
    clearErrors();
  }, [clearErrors, setValue, defaultViewport]);

  const { title, dateRangeIncompleteError, dateRangeInvalidError } = messages;

  return (
    <Controller
      control={control}
      name='defaultViewport'
      render={({ field, fieldState }) => {
        return (
          <FormField label={title} errorText={fieldState.error?.message}>
            <DateRangePicker
              expandToViewport={true}
              onChange={({ detail: { value } }) => {
                if (!value) return;
                field.onChange(value);
                onUpdateDefaultViewport(
                  JSON.stringify(dateRangeToViewport(value))
                );
              }}
              value={viewportToDateRange(defaultViewport)}
              showClearButton={false}
              relativeOptions={relativeViewportOptions}
              isValidRange={rangeValidator({
                dateRangeIncompleteError,
                dateRangeInvalidError,
              })}
            />
          </FormField>
        );
      }}
    />
  );
};
