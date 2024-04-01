import React from 'react';
import { Value } from '../../shared-components';
import { renderToString } from 'react-dom/server';

export type TooltipData = {
  componentSubType: string;
  axisValueLabel: string;
  seriesName: string;
  color: string;
  value: [Date, number];
}[];

export const formatTooltip = (data: TooltipData, decimalPlaces?: number) => {
  const div = document.createElement('div');

  let date = '';
  const diagnosticString = data
    .filter(({ componentSubType }) => componentSubType !== 'bar')
    .map(({ seriesName, color, axisValueLabel, value }, index: number) => {
      if (index === 0) date = `<div><b>${axisValueLabel}</b></div>`;

      const valueString = renderToString(
        <Value value={value[1]} unit='%' precision={decimalPlaces} />
      );

      return `<div style="display:flex;flex-wrap:nowrap;align-items:center;gap:4px">
          <div style="height:15px;width:15px;background-color:${color};border-radius:3px"></div>
          <span>${seriesName}</span>
        </div>
        <div style="align-self:end">${valueString}</div>`;
    })
    .join('');

  div.innerHTML = `${date}<div style="display:grid;grid-template-columns:1fr max-content;gap:8px">${diagnosticString}</div>`;
  return div;
};
