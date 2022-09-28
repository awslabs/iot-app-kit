import React from 'react';
import renderer from 'react-test-renderer';

import RightPanel from './RightPanel';

jest.mock('./FoldableContainer', () => (props) => <div data-testid={'FoldableContainer'} {...props} />);

jest.mock('./TabbedPanelContainer', () => (props) => <div data-testid={'TabbedPanelContainer'} {...props} />);

describe('<RightPanel />', () => {
  it('should render the expencted layout', () => {
    const container = renderer.create(<RightPanel TestPanel={<div>TestPanel</div>} />);

    expect(container).toMatchSnapshot();
  });
});
