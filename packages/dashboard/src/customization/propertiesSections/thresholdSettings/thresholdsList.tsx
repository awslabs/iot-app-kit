import React from 'react';

import { SpaceBetween, Box } from '@cloudscape-design/components';

import { StyledThreshold, ThresholdWithId } from '~/customization/settings';
import { ThresholdComponent } from './thresholdComponent';
import { ComparisonOperators } from './comparisonOperators';

const NoThresholds = () => <Box />;

type ThresholdsListProps = {
  thresholds: (ThresholdWithId & StyledThreshold)[];
  comparisonOperators: ComparisonOperators;
  updateThresholds?: (
    newValue: (ThresholdWithId & StyledThreshold)[] | undefined
  ) => void;
};
export const ThresholdsList: React.FC<ThresholdsListProps> = ({
  thresholds,
  comparisonOperators,
  updateThresholds,
}) => {
  const onUpdateThreshold = (updatedThreshold: ThresholdWithId) => {
    if (updateThresholds) {
      updateThresholds(
        thresholds.map((t) => {
          if (t.id === updatedThreshold.id) {
            return updatedThreshold;
          }
          return t;
        })
      );
    }
  };

  const handleDeleteThreshold = (threshold: ThresholdWithId) => () => {
    if (updateThresholds) {
      updateThresholds(thresholds.filter((t) => t.id !== threshold.id));
    }
  };

  const handleUpdateThresholdValue =
    (threshold: ThresholdWithId) => (value: ThresholdWithId['value']) => {
      onUpdateThreshold({
        ...threshold,
        value,
      });
    };

  const handleUpdateComparisonOperator =
    (threshold: ThresholdWithId) =>
    (comparisonOperator: ThresholdWithId['comparisonOperator']) => {
      onUpdateThreshold({
        ...threshold,
        comparisonOperator,
      });
    };

  const handleUpdateThresholdColor =
    (threshold: ThresholdWithId) => (color: ThresholdWithId['color']) => {
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
