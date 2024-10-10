import React from 'react';

import { render, waitFor } from '@testing-library/react';
import { ThresholdStyleSettings } from './thresholdStyle';
import wrapper from '@cloudscape-design/components/test-utils/dom';
import { ThresholdStyleType } from '@iot-app-kit/core';
import {
  convertOptionToThresholdStyle,
  convertThresholdStyleToOption,
  styledOptions,
} from './defaultThresholds';

const thresholdStyle: ThresholdStyleType = {
  visible: true,
};
const mockUpdateAllThresholdStyles = jest.fn();

const component = (
  <ThresholdStyleSettings
    thresholdStyle={thresholdStyle}
    updateAllThresholdStyles={mockUpdateAllThresholdStyles}
    convertOptionToThresholdStyle={convertOptionToThresholdStyle}
    convertThresholdStyleToOption={convertThresholdStyleToOption}
    styledOptions={styledOptions}
  />
);

describe('thresholdStyleSettings', () => {
  it('renders', () => {
    const result = render(component);
    const elem = result.baseElement;
    expect(elem);
  });

  it('calls update functions when option changes', async () => {
    const { container, getByText, queryAllByText } = render(component);
    const cloudscapeWrapper = await waitFor(() => wrapper(container));

    const select = await waitFor(() => cloudscapeWrapper.findSelect());

    await waitFor(() =>
      expect(getByText('Show thresholds')).toBeInTheDocument()
    );
    select?.openDropdown();
    await waitFor(() =>
      expect(queryAllByText('As lines').length).toBeGreaterThan(0)
    );
    select?.selectOptionByValue('2');
    await waitFor(() =>
      expect(queryAllByText('As filled region').length).toBeGreaterThan(0)
    );
    expect(mockUpdateAllThresholdStyles).toBeCalled();
  });
});
