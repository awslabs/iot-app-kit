import React from 'react';
import { DecimalPlacesField } from '~/features/decimal-places';
import { useDashboardDecimalPlaces } from './use-dashboard-decimal-places';

export function DashboardDecimalPlacesSelect() {
  const [decimalPlaces, setDecimalPlaces] = useDashboardDecimalPlaces();

  return (
    <DecimalPlacesField
      decimalPlaces={decimalPlaces}
      onChange={(stringDecimalPlaces) => {
        setDecimalPlaces(parseInt(stringDecimalPlaces, 10));
      }}
      shouldClearErrors={false}
      showFormFieldLabel
    />
  );
}
