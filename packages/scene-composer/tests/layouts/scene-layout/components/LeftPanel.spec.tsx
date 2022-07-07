import React from 'react';
import renderer from 'react-test-renderer';

import LeftPanel from '../../../../src/layouts/scene-layout/components/LeftPanel';
import FoldableContainer from '../../../../src/layouts/scene-layout/components/FoldableContainer';
import TabbedPanelContainer from '../../../../src/layouts/scene-layout/components/TabbedPanelContainer';

jest.mock('../../../../src/layouts/scene-layout/components/FoldableContainer', () => (props) => (
  <div data-testid={'FoldableContainer'} {...props} />
));

jest.mock('../../../../src/layouts/scene-layout/components/TabbedPanelContainer', () => (props) => (
  <div data-testid={'TabbedPanelContainer'} {...props} />
));

describe('<LeftPanel />', () => {
  it('should render the expencted layout', () => {
    const container = renderer.create(<LeftPanel TestPanel={<div>TestPanel</div>} />);

    expect(container).toMatchSnapshot();
  });
});
