import React from 'react';

import { render } from '@testing-library/react';
import { ThresholdStyleSettings } from './thresholdStyle';
import { ThresholdStyleType } from '~/customization/widgets/types';
import wrapper from '@cloudscape-design/components/test-utils/dom';

const thresholdStyle: ThresholdStyleType = {
  visible: true,
};
const mockUpdateAllThresholdStyles = jest.fn();

const component = (
  <ThresholdStyleSettings
    thresholdStyle={thresholdStyle}
    updateAllThresholdStyles={mockUpdateAllThresholdStyles}
  />
);

describe('thresholdStyleSettings', () => {
  it('renders', () => {
    const result = render(component);
    const elem = result.baseElement;
    expect(elem);
  });

  it('calls update functions when option changes', () => {
    const { container } = render(component);
    const cloudscapeWrapper = wrapper(container);

    const select = cloudscapeWrapper.findSelect();
    select?.openDropdown();
    select?.selectOptionByValue('2');
    expect(mockUpdateAllThresholdStyles).toBeCalled();
  });
});
