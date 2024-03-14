import React from 'react';
import { format } from 'date-fns';
import { fontWeightHeadingS } from '@cloudscape-design/design-tokens';
import { FULL_DATE } from '../../../../utils/time';

export type XYPlotTooltipTimeOptions = {
  time?: number;
};
export const XYPlotTooltipTime = ({ time }: XYPlotTooltipTimeOptions) => (
  <span style={{ fontWeight: fontWeightHeadingS }}>
    {time ? format(new Date(time), FULL_DATE) : ''}
  </span>
);
