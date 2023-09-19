import React, { useState } from 'react';

import { SpaceBetween, Box, Toggle } from '@cloudscape-design/components';

import { StyledThreshold, ThresholdWithId } from '~/customization/settings';
import { ThresholdComponent } from './thresholdComponent';
import { ComparisonOperators } from './comparisonOperators';
import { ThresholdStyleType } from '~/customization/widgets/types';

const NoThresholds = () => <Box />;

type ThresholdsListProps = {
  thresholds: (ThresholdWithId & StyledThreshold)[];
  comparisonOperators: ComparisonOperators;
  updateThresholds?: (newValue: (ThresholdWithId & StyledThreshold)[] | undefined) => void;
  thresholdStyle?: ThresholdStyleType;
};
export const ThresholdsList: React.FC<ThresholdsListProps> = ({
  thresholds,
  updateThresholds,
  comparisonOperators,
  thresholdStyle,
}) => {

  const onUpdateThreshold = (updatedThreshold: ThresholdWithId) => {
    if (!!updateThresholds) {
      updateThresholds(
        thresholds.map((t) => {
          if (t.id === updatedThreshold.id) {
            return updatedThreshold;
          }
          return t;
        })
      );
    };
  }

  const handleDeleteThreshold = (threshold: ThresholdWithId) => () => {
    if (!!updateThresholds) {
      updateThresholds(thresholds.filter((t) => t.id !== threshold.id));
    }
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

  const [shouldHideThresholds, setShouldHideThresholds] = useState<boolean>(false);

  const handleUpdateHideAllThresholds = (checked: boolean) => {
    setShouldHideThresholds(checked)
    if (!!thresholdStyle && !!updateThresholds) {
      const newThresholds = thresholds.map((threshold) => ({
        ...threshold,
        visible: checked ? false : thresholdStyle.visible,
        fill: checked ? undefined : thresholdStyle.fill,
      }));
      updateThresholds(newThresholds);
    }
  }

  const hideThresholdsToggle = (
    <Toggle onChange={({ detail }) => handleUpdateHideAllThresholds(detail.checked)} checked={shouldHideThresholds}>
      Hide all thresholds
    </Toggle>
  );

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
    <SpaceBetween size='xs' direction='vertical'>
      {!!thresholdStyle && hideThresholdsToggle}
      <SpaceBetween size='m' direction='vertical'>
        {thresholdsComponents.length ? thresholdsComponents : <NoThresholds />}
      </SpaceBetween>
    </SpaceBetween>
  );
};
