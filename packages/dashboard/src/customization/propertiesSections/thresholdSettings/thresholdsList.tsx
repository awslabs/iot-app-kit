import React from 'react';

import { SpaceBetween, Box } from '@cloudscape-design/components';

import { ThresholdWithId } from '~/customization/settings';
import { ThresholdComponent } from './thresholdComponent';
import { ComparisonOperators } from './comparisonOperators';

const NoThresholds = () => <Box variant='p'>No thresholds found</Box>;

type ThresholdsListProps = {
  thresholds: ThresholdWithId[];
  comparisonOperators: ComparisonOperators;
  updateThresholds: (newValue: ThresholdWithId[] | undefined) => void;
};
export const ThresholdsList: React.FC<ThresholdsListProps> = ({
  thresholds,
  updateThresholds,
  comparisonOperators,
}) => {
  const onUpdateThreshold = (updatedThreshold: ThresholdWithId) => {
    updateThresholds(
      thresholds.map((t) => {
        if (t.id === updatedThreshold.id) {
          return updatedThreshold;
        }
        return t;
      })
    );
  };

  const handleDeleteThreshold = (threshold: ThresholdWithId) => () => {
    updateThresholds(thresholds.filter((t) => t.id !== threshold.id));
  };

  const handleUpdateThresholdValue = (threshold: ThresholdWithId) => (value: ThresholdWithId['value']) => {
    onUpdateThreshold({
      ...threshold,
      value,
    });
  };
  const handleUpdateComparisonOperator =
    (threshold: ThresholdWithId) => (comparisonOperator: ThresholdWithId['comparisonOperator']) => {
      onUpdateThreshold({
        ...threshold,
        comparisonOperator,
      });
    };

  const handleUpdateThresholdColor = (threshold: ThresholdWithId) => (color: ThresholdWithId['color']) => {
    onUpdateThreshold({
      ...threshold,
      color,
    });
  };

  const thresholdsComponents = thresholds.map((threshold) => {
    return (
      <ThresholdComponent
        key={threshold.id}
        threshold={threshold}
        comparisonOptions={comparisonOperators}
        onDelete={handleDeleteThreshold(threshold)}
        onUpdateValue={handleUpdateThresholdValue(threshold)}
        onUpdateComparisonOperator={handleUpdateComparisonOperator(threshold)}
        onUpdateColor={handleUpdateThresholdColor(threshold)}
      />
    );
  });

  return (
    <SpaceBetween size='m' direction='vertical'>
      {thresholdsComponents.length ? thresholdsComponents : <NoThresholds />}
    </SpaceBetween>
  );
};
