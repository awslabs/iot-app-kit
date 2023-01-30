import React from 'react';

import { round } from '../../../utils/number';
import { Primitive } from '../../../utils/dataTypes';
import { NO_VALUE_PRESENT } from '../terms';

/**
 * Display value of a data point, supports all data types
 */
export const Value = ({ isEnabled = true, value, unit }: { isEnabled?: boolean; value?: Primitive; unit?: string }) => {
  if (!isEnabled || value == null) {
    return <span data-testid="no-value-present">{NO_VALUE_PRESENT}</span>;
  }

  const finalValue = typeof value === 'number' ? round(value) : String(value);

  return (
    <>
      {[finalValue, unit && <span className="unit"> {unit}</span>]};
    </>
  )
};
