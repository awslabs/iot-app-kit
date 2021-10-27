import { h } from '@stencil/core';
import { Threshold } from '@synchro-charts/core';

const COMPARATOR_MAP = {
  GTE: '>=',
  GT: '>',
  LTE: '<=',
  LT: '<',
  EQ: '=',
};

export const ThresholdListItem = ({
  threshold,
  removeThreshold,
  thresholdId,
}: {
  threshold: Threshold;
  removeThreshold: (id: number) => void;
  thresholdId: number;
}) => {
  const { color, value, comparisonOperator } = threshold;
  return (
    <tr key={`${threshold.value}---${threshold.comparisonOperator}`} class="threshold-list-item-container">
      <td class="color-container">
        <div class="color-block" style={{ background: color }} />
      </td>
      <td>{value}</td>
      <td>{COMPARATOR_MAP[comparisonOperator]}</td>
      <td>
        <button onClick={() => removeThreshold(thresholdId)}>
          <strong>X</strong>
        </button>
      </td>
    </tr>
  );
};
