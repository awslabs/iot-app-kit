import SpaceBetween from '@cloudscape-design/components/space-between';
import React from 'react';

import { ThresholdFormListItem } from './thresholdFormListItem';
import { type ComparisonOperators } from './comparisonOperators';
import { type StyledThreshold, type ThresholdWithId } from '~/customization/settings';

interface ThresholdsListProps {
  thresholds: (ThresholdWithId & StyledThreshold)[];
  comparisonOperators: ComparisonOperators;
  updateThresholds: (newValue: (ThresholdWithId & StyledThreshold)[] | undefined) => void;
}

export function ThresholdsList({ thresholds, comparisonOperators, updateThresholds }: ThresholdsListProps) {
  return (
    <SpaceBetween size='m' direction='vertical'>
      {thresholds.map((threshold) => (
        <ThresholdFormListItem
          key={threshold.id}
          threshold={threshold}
          thresholds={thresholds}
          updateThresholds={updateThresholds}
          comparisonOptions={comparisonOperators}
        />
      ))}
    </SpaceBetween>
  );
}
