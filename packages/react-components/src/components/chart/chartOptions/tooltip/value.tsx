import React from 'react';
import { Primitive } from '@iot-app-kit/core';
import { isNumeric, round } from '@iot-app-kit/core-util';

export const formatValue =
  (significantDigits = 4) =>
  (value: Primitive) =>
    isNumeric(value) ? `${round(value, significantDigits)}` : value.toString();

export type XYPlotTooltipValueOptions = {
  value?: Primitive;
  significantDigits?: number;
};

export const XYPlotTooltipValue = ({
  value,
  significantDigits,
}: XYPlotTooltipValueOptions) => {
  return (
    <div style={{ alignSelf: 'end' }}>
      {formatValue(significantDigits)(value ?? '')}
    </div>
  );
};
