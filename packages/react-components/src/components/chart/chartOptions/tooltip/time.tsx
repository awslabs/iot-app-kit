import React from 'react';
import { fontWeightHeadingS } from '@cloudscape-design/design-tokens';
import { FULL_DATE } from '../../../../utils/time';
import { DateTime } from '../../../timeZone';

export type XYPlotTooltipTimeOptions = {
  time?: number;
};
export const XYPlotTooltipTime = ({ time }: XYPlotTooltipTimeOptions) => (
  <span style={{ fontWeight: fontWeightHeadingS }}>
    {time ? <DateTime dateTime={time} pattern={FULL_DATE} /> : ''}
  </span>
);
