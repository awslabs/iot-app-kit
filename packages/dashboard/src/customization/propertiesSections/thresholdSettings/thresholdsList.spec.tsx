import { render } from '@testing-library/react';
import { COMPARISON_OPERATOR, type StyledThreshold } from '@iot-app-kit/core';
import { ThresholdsList } from './thresholdsList';
import { type ThresholdWithId } from '~/customization/settings';

const comparisonOperator1 = COMPARISON_OPERATOR.EQ;
const mockComparisonOperator1 = { label: '=', value: comparisonOperator1 };
const mockThreshold1: ThresholdWithId & StyledThreshold = {
  id: '1',
  color: '#00ff00',
  comparisonOperator: comparisonOperator1,
  value: 10,
  visible: true,
};

const comparisonOperator2 = COMPARISON_OPERATOR.GTE;
const mockComparisonOperator2 = { label: '>=', value: comparisonOperator2 };
const mockThreshold2: ThresholdWithId & StyledThreshold = {
  id: '2',
  color: '#0000ff',
  comparisonOperator: comparisonOperator2,
  value: 15,
  visible: true,
};

const mockUpdateThresholds = vi.fn();

const component = (
  <ThresholdsList
    thresholds={[mockThreshold1, mockThreshold2]}
    comparisonOperators={[mockComparisonOperator1, mockComparisonOperator2]}
    updateThresholds={mockUpdateThresholds}
  />
);

describe('thresholdsList', () => {
  it('renders', () => {
    const elem = render(component).baseElement;
    expect(elem);
    expect(
      elem.querySelectorAll(
        '[data-test-id="threshold-component-operator-select"]'
      )
    ).toHaveLength(2);
    expect(
      elem.querySelectorAll('[data-test-id="threshold-component-value-input"]')
    ).toHaveLength(2);
    expect(
      elem.querySelectorAll('[data-test-id="threshold-component-color-picker"]')
    ).toHaveLength(2);
    expect(
      elem.querySelectorAll(
        '[data-test-id="threshold-component-delete-button"]'
      )
    ).toHaveLength(2);
  });
});
