import React from 'react';
import { Value } from '../../shared-components';
import { colorChartsPaletteCategorical6 } from '@cloudscape-design/design-tokens';
import { AnomalyDiagnostic } from '../types';

type AnomalyDiagnosticWithTimestamp = AnomalyDiagnostic & { timestamp: Date };

export const getColumnDefinitions = (decimalPlaces?: number) => [
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
            <Value precision={decimalPlaces} value={percentage} unit='%' />
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
      item.timestamp.toLocaleString(),
  },
];
