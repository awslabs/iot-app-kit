import { render } from '@testing-library/react';
import React from 'react';

import { KnownComponentType } from '../../../interfaces';
import { useStore } from '../../../store';

import { MotionIndicatorVisibilityToggle } from './MotionIndicatorVisibilityToggle';

describe('MotionIndicatorVisibilityToggle', () => {
  const getComponentRefByType = jest.fn();

  const createState = (visible: boolean) => ({
    noHistoryStates: {
      ...useStore('default').getState().noHistoryStates,
      motionIndicatorVisible: visible,
      toggleMotionIndicatorVisibility: jest.fn(),
    },
    getComponentRefByType,
  });

  it('should render correctly', async () => {
    getComponentRefByType.mockReturnValue({ type: KnownComponentType.MotionIndicator });
    useStore('default').setState(createState(true));
    const { container } = render(<MotionIndicatorVisibilityToggle />);

    expect(container).toMatchSnapshot();
  });
});
