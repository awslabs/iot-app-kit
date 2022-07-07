import React from 'react';
import { render } from '@testing-library/react';
import wrapper from '@awsui/components-react/test-utils/dom';

import { TopBar } from '../../../src/components/panels/TopBar';
import { useStore } from '../../../src/store';
import { KnownComponentType } from '../../../src';

jest.mock('../../../src/assets/svgs/icons/CheckMarkIcons', () => ({
  UncheckedIcon: <div data-testid={'UncheckedIcon'}>UncheckedIcon</div>,
  CheckedIcon: <div data-testid={'CheckedIcon'}>CheckedIcon</div>,
}));

jest.mock('@awsui/components-react', () => ({
  ...jest.requireActual('@awsui/components-react'),
}));

const toggleMotionIndicatorVisibilityMock = jest.fn();
const baseState = {
  motionIndicatorVisible: true,
  toggleMotionIndicatorVisibility: toggleMotionIndicatorVisibilityMock,
};

describe('<TopBar />', () => {
  it('should render with motion indicator off option', () => {
    useStore('default').setState({ noHistoryStates: { ...baseState, motionIndicatorVisible: false } });

    const { container } = render(<TopBar />);
    const polarisWrapper = wrapper(container);

    const dropDown = polarisWrapper.findButtonDropdown('[data-testid="view-options"]');
    dropDown?.openDropdown();
    const item = dropDown?.findItemById(KnownComponentType.MotionIndicator);

    // has unchecked icon
    expect(item?.find('[data-testid="UncheckedIcon"]')).toBeDefined();
  });

  it('should toggle motion indicator visibility', () => {
    useStore('default').setState({ noHistoryStates: baseState });

    const { container } = render(<TopBar />);
    const polarisWrapper = wrapper(container);

    const dropDown = polarisWrapper.findButtonDropdown('[data-testid="view-options"]');
    dropDown?.openDropdown();
    let item = dropDown?.findItemById(KnownComponentType.MotionIndicator);

    // has checked icon
    expect(item?.find('[data-testid="CheckedIcon"]')).toBeDefined();

    item?.click();
    dropDown?.openDropdown();
    item = dropDown?.findItemById(KnownComponentType.MotionIndicator);

    expect(toggleMotionIndicatorVisibilityMock).toBeCalledTimes(1);
  });
});
