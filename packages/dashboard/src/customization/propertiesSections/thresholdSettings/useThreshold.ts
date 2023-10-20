import type { ThresholdWithId } from '~/customization/settings';

export function useThreshold({
  threshold,
  thresholds,
  updateThresholds,
}: {
  threshold: ThresholdWithId;
  thresholds: ThresholdWithId[];
  updateThresholds: (updatedThresholds: ThresholdWithId[]) => void;
}) {
  function onUpdateThreshold(updatedThreshold: ThresholdWithId) {
    const updatedThresholds = thresholds.map((threshold) => {
      const isMatchingThreshold = threshold.id === updatedThreshold.id;

      return isMatchingThreshold ? updatedThreshold : threshold;
    });

    updateThresholds(updatedThresholds);
  }

  function updateThresholdValue(value: ThresholdWithId['value']) {
    const updatedThreshold = { ...threshold, value };

    onUpdateThreshold(updatedThreshold);
  }

  function updateComparisonOperator(comparisonOperator: ThresholdWithId['comparisonOperator']) {
    const updatedThreshold = { ...threshold, comparisonOperator };

    onUpdateThreshold(updatedThreshold);
  }

  function updateThresholdColor(color: ThresholdWithId['color']) {
    const updatedThreshold = { ...threshold, color };

    onUpdateThreshold(updatedThreshold);
  }

  function deleteThreshold() {
    const updatedThresholds = thresholds.filter((t) => t.id !== threshold.id);

    updateThresholds(updatedThresholds);
  }

  return {
    updateThresholdValue,
    updateComparisonOperator,
    updateThresholdColor,
    deleteThreshold,
  };
}
