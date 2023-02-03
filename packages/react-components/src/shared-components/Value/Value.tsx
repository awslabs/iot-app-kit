import React from 'react';
import { Primitive } from '../../common/dataTypes';
import { round } from '@iot-app-kit/core';

export const Value: React.FC<{ isEnabled?: boolean; value?: Primitive; unit?: string }> = ({
  isEnabled = true,
  value,
  unit,
}) => {
  if (!isEnabled || value == null) {
    return <span data-testid="no-value-present">-</span>;
  }

  if (typeof value === 'number') {
    /** Display Number */
    return (
      <>
        {round(value)} {unit && <span className="unit"> {unit}</span>}
      </>
    );
  }

  /** Display String or Booleans */
  return (
    <>
      {String(value)} {unit && <span className="unit"> {unit}</span>}
    </>
  );
};
