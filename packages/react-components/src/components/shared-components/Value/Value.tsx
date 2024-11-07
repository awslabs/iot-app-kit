import type { Primitive } from '@iot-app-kit/core';
import { round } from '@iot-app-kit/core-util';

export const Value: React.FC<{
  value?: Primitive;
  unit?: string;
  precision?: number;
}> = ({ value, unit, precision }) => {
  if (value == null) {
    return <span data-testid='no-value-present'>-</span>;
  }

  if (typeof value === 'number') {
    /** Display Number */
    return (
      <>
        {round(value, precision)} {unit && <small> {unit}</small>}
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
