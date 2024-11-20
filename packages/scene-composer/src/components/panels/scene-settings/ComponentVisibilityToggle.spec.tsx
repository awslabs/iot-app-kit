import { render } from '@testing-library/react';

import { KnownComponentType } from '../../../interfaces';
import { accessStore } from '../../../store';

import { ComponentVisibilityToggle } from './ComponentVisibilityToggle';

describe('ComponentVisibilityToggle', () => {
  const getComponentRefByType = vi.fn();

  const createState = (visible: boolean) => ({
    noHistoryStates: {
      ...accessStore('default').getState().noHistoryStates,
      componentVisibilities: { [KnownComponentType.MotionIndicator]: visible },
      toggleComponentVisibility: vi.fn(),
    },
    getComponentRefByType,
  });

  it('should render correctly for motion indicator', async () => {
    getComponentRefByType.mockReturnValue({ type: KnownComponentType.MotionIndicator });
    accessStore('default').setState(createState(true));
    const { container } = render(
      <ComponentVisibilityToggle componentType={KnownComponentType.MotionIndicator} label='Motion indicator label' />,
    );

    expect(container).toMatchSnapshot();
  });
});
