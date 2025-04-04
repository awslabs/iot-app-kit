import { render } from '@/tests/testing-library';
import { useState as useStateMock } from 'react';
import ScenePanel from './ScenePanel';
import { Direction } from './utils';

vi.mock('./FoldableContainer', () => ({ default: (props) => <div data-testid='FoldableContainer' {...props} /> }));
vi.mock('./TabbedPanelContainer', () => ({
  default: (props) => <div data-testid='TabbedPanelContainer' {...props} />,
}));
vi.mock('react', () => ({
  ...vi.importActual('react'),
  useState: vi.fn(),
}));
const setState = vi.fn();

describe('<ScenePanel />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // @ts-ignore
    useStateMock.mockImplementation((init: boolean) => [init, setState]);
  });

  const leftArgs = {
    direction: Direction.Left,
    panels: { [1]: <div>TestLeftPanel</div> },
  };
  const rightArgs = {
    direction: Direction.Right,
    panels: { [1]: <div>TestRightPanel</div> },
  };
  it('should render the left panel as closed by default', () => {
    const scenePanel = render(<ScenePanel {...leftArgs} />);
    expect(scenePanel).toMatchSnapshot();
  });
  it('should render the left panel as open when .open class is applied', async () => {
    // @ts-ignore
    useStateMock.mockImplementationOnce(() => [true, setState]);
    const scenePanel = render(<ScenePanel {...leftArgs} />);
    const container = scenePanel.findByTestId('FoldableContainer');
    const panel = (await container).getElementsByClassName('tm-collapse-panel');
    expect(scenePanel).toMatchSnapshot();
    expect(panel[0]).toHaveClass('open');
  });

  it('should render the right panel as closed by default', () => {
    const scenePanel = render(<ScenePanel {...rightArgs} />);
    expect(scenePanel).toMatchSnapshot();
  });
  it('should render the right panel as open when .open class is applied', async () => {
    // @ts-ignore
    useStateMock.mockImplementationOnce(() => [true, setState]);
    const scenePanel = render(<ScenePanel {...rightArgs} />);
    const container = scenePanel.findByTestId('FoldableContainer');
    const panel = (await container).getElementsByClassName('tm-collapse-panel');
    expect(scenePanel).toMatchSnapshot();
    expect(panel[0]).toHaveClass('open');
  });
});
