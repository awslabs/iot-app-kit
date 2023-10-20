import ExpandableSection from '@cloudscape-design/components/expandable-section';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import { isNumeric } from '@iot-app-kit/core/dist/es/common/number';
import React from 'react';

export function NumberSettings({
  significantDigits,
  updateSignificantDigits,
}: {
  significantDigits?: number;
  updateSignificantDigits: (newValue: number | undefined) => void;
}) {
  return (
    <ExpandableSection headerText='Numbers' defaultExpanded>
      <FormField label='Decimal places'>
        <Input
          placeholder='Auto'
          type='number'
          value={significantDigits?.toFixed() ?? ''}
          onChange={(event) => {
            updateSignificantDigits(isNumeric(event.detail.value) ? parseInt(event.detail.value, 10) : undefined);
          }}
        />
      </FormField>
    </ExpandableSection>
  );
}
