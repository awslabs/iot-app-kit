import React from 'react';
import { render } from '@testing-library/react';

import { LegendSection } from './legendSection';
import { YAxisSection } from './yAxis';

describe('YAxisSection', () => {
  test('should disable y axis options when visible is false', () => {
    const options = {
      visible: false,
      min: null,
      max: null,
      yLabel: null,
      setVisible: () => {},
      updateMin: () => {},
      updateMax: () => {},
      updateYLabel: () => {},
    };
    const { getByPlaceholderText, getAllByPlaceholderText } = render(
      <YAxisSection {...options} />
    );
    expect(getByPlaceholderText('Input Y-axis label')).toBeDisabled();
    expect(getAllByPlaceholderText('Auto')[0]).toBeDisabled();
    expect(getAllByPlaceholderText('Auto')[1]).toBeDisabled();
  });

  test('should not disable y axis options when visible is true', () => {
    const options = {
      visible: true,
      min: null,
      max: null,
      yLabel: null,
      setVisible: () => {},
      updateMin: () => {},
      updateMax: () => {},
      updateYLabel: () => {},
    };
    const { getByPlaceholderText, getAllByPlaceholderText } = render(
      <YAxisSection {...options} />
    );
    expect(getByPlaceholderText('Input Y-axis label')).not.toBeDisabled();
    expect(getAllByPlaceholderText('Auto')[0]).not.toBeDisabled();
    expect(getAllByPlaceholderText('Auto')[1]).not.toBeDisabled();
  });
});

describe('LegendSection', () => {
  test('should disable legend options when visible is false', () => {
    const options = {
      visible: false,
      position: 'left',
      setVisible: () => {},
      setAlignment: () => {},
    };
    const { getByLabelText } = render(<LegendSection {...options} />);
    expect(getByLabelText('Alignment')).toBeDisabled();
  });

  test('should not disable legend options when visible is true', () => {
    const options = {
      visible: true,
      position: 'left',
      setVisible: () => {},
      setAlignment: () => {},
    };
    const { getByLabelText } = render(<LegendSection {...options} />);
    expect(getByLabelText('Alignment')).not.toBeDisabled();
  });
});
