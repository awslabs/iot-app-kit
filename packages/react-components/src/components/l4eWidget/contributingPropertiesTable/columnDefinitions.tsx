import React from 'react';
import { AnomalyDiagnosticWithTimestamp } from '../types';
import { Value } from '../../shared-components';
import { colorChartsPaletteCategorical6 } from '@cloudscape-design/design-tokens';

export const getColumnDefinitions = (significantDigits?: number) => [
  {
    id: 'property',
    header: 'Property',
    cell: (item: AnomalyDiagnosticWithTimestamp) => item.name,
    sortingField: 'name',
    isRowHeader: true,
  },
  {
    id: 'contributingPercentage',
    header: 'Contributing percentage',
    sortingField: 'value',
    cell: (item: AnomalyDiagnosticWithTimestamp) => {
      const percentage = item.value * 100;
      return (
        <div style={{ display: 'grid', gridTemplateColumns: `75px 1fr` }}>
          <div>
            <Value precision={significantDigits} value={percentage} unit='%' />
          </div>
          <div
            style={{
              width: `${percentage}%`,
              backgroundColor: colorChartsPaletteCategorical6,
              borderRadius: '5px',
            }}
          />
        </div>
      );
    },
  },
  {
    id: 'time',
    sortingField: 'timestamp',
    header: 'Time',
    cell: (item: AnomalyDiagnosticWithTimestamp) =>
      new Date(item.timestamp).toLocaleString(),
  },
];
