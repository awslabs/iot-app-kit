import React from 'react';
import renderer from 'react-test-renderer';

import LeftPanel from './LeftPanel';

jest.mock('./FoldableContainer', () => (props) => <div data-testid={'FoldableContainer'} {...props} />);

jest.mock('./TabbedPanelContainer', () => (props) => <div data-testid={'TabbedPanelContainer'} {...props} />);

describe('<LeftPanel />', () => {
  it('should render the expencted layout', () => {
    const container = renderer.create(<LeftPanel TestPanel={<div>TestPanel</div>} />);

    expect(container).toMatchSnapshot();
  });
});
