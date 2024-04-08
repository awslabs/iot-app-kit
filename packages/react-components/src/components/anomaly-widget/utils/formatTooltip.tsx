import React from 'react';
import { Value } from '../../shared-components';
import { renderToString } from 'react-dom/server';

export type TooltipData = {
  componentSubType: string;
  axisValueLabel: string;
  seriesName: string;
  seriesId: string; // used to figure out the dimension
  color: string;
  dimensionNames: string[];
  value: Record<string, number> | Array<number>;
}[];

const getDiagnosticValue = ({
  value,
  dimensionNames,
  seriesId,
}: TooltipData[number]) => {
  if (Array.isArray(value)) {
    const dimensionIndex = dimensionNames.findIndex(
      (name) => name === seriesId
    );
    return value[dimensionIndex];
  }
  return value[seriesId];
};

export const formatTooltip = (
  data: TooltipData,
  decimalPlaces?: number,
  tooltipSort: 'value' | 'alphabetical' = 'alphabetical'
) => {
  const div = document.createElement('div');

  let date = '';
  const diagnosticString = data
    // filter data so we only se the diagnostic values
    .filter(({ componentSubType }) => componentSubType !== 'bar')
    // sort diagnostics by value or alphabetical order
    .sort((a, b) => {
      if (tooltipSort === 'alphabetical')
        return a.seriesName.localeCompare(b.seriesName);

      // sort largest -> smallest
      return getDiagnosticValue(b) - getDiagnosticValue(a);
    })
    // convert each diagostic into a line containing its color, name, and value
    .map((d, index: number) => {
      const { seriesName, color, axisValueLabel } = d;
      if (index === 0) date = `<div><b>${axisValueLabel}</b></div>`;

      const valueString = renderToString(
        <Value
          value={getDiagnosticValue(d) * 100}
          unit='%'
          precision={decimalPlaces}
        />
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
