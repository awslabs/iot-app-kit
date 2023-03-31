import React from 'react';
import { round } from '@iot-app-kit/core';
import type { Primitive } from '@iot-app-kit/core';

export const Value: React.FC<{ value?: Primitive; unit?: string }> = ({ value, unit }) => {
  if (value == null) {
    return <span data-testid='no-value-present'>-</span>;
  }

  if (typeof value === 'number') {
    /** Display Number */
    return (
      <>
        {round(value)} {unit && <small> {unit}</small>}
      </>
    );
  }

  /** Display String or Booleans */
  return (
    <>
      {String(value)} {unit && <small> {unit}</small>}
    </>
  );
};
