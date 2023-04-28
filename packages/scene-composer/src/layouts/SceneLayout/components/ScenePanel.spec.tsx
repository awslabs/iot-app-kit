import React, { useState } from 'react';
import { render } from '@testing-library/react';

import ScenePanel from './ScenePanel';
import { Direction } from './utils';

const useStateMock = useState as jest.Mock;

jest.mock('./FoldableContainer', () => (props) => <div data-testid='FoldableContainer' {...props} />);
jest.mock('./TabbedPanelContainer', () => (props) => <div data-testid='TabbedPanelContainer' {...props} />);
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn((initial: boolean) => [initial, jest.fn()]),
}));

describe('<ScenePanel />', () => {
  [
    { direction: Direction.Left, panels: { [1]: <div>TestLeftPanel</div> } },
    { direction: Direction.Right, panels: { [1]: <div>TestRightPanel</div> } },
  ].forEach((props) => {
    it(`should render the ${props.direction} panel as closed by default`, () => {
      const { container } = render(<ScenePanel {...props} />);
      expect(container).toMatchSnapshot();
    });

    it(`should render the ${props.direction} panel as open when .open class is applied`, async () => {
      useStateMock.mockImplementationOnce(() => [true, jest.fn()]);
      const { container } = render(<ScenePanel {...props} />);
      expect(container).toMatchSnapshot();
    });
  });
});
