import DateRangePicker from '@cloudscape-design/components/date-range-picker';
import FormField from '@cloudscape-design/components/form-field';
import { type Viewport } from '@iot-app-kit/core';
import {
  relativeViewportOptions,
  viewportToDateRange,
  dateRangeToViewport,
  rangeValidator,
} from '@iot-app-kit/core-util';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

export interface DefaultViewportFieldProps {
  defaultViewport?: Viewport;
  onViewportChange: (viewport: Viewport) => void;
}

export const DefaultViewportField = ({
  defaultViewport,
  onViewportChange,
}: DefaultViewportFieldProps) => {
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
          <FormField
            label='Default viewport'
            errorText={fieldState.error?.message}
          >
            <DateRangePicker
              expandToViewport={true}
              onChange={({ detail: { value } }) => {
                if (!value) return;
                onViewportChange(dateRangeToViewport(value));
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
          </FormField>
        );
      }}
    />
  );
};
