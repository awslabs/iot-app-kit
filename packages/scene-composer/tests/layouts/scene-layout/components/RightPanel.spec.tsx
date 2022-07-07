import React from 'react';
import renderer from 'react-test-renderer';

import RightPanel from '../../../../src/layouts/scene-layout/components/RightPanel';
import FoldableContainer from '../../../../src/layouts/scene-layout/components/FoldableContainer';
import TabbedPanelContainer from '../../../../src/layouts/scene-layout/components/TabbedPanelContainer';

jest.mock('../../../../src/layouts/scene-layout/components/FoldableContainer', () => (props) => (
  <div data-testid={'FoldableContainer'} {...props} />
));

jest.mock('../../../../src/layouts/scene-layout/components/TabbedPanelContainer', () => (props) => (
  <div data-testid={'TabbedPanelContainer'} {...props} />
));

describe('<RightPanel />', () => {
  it('should render the expencted layout', () => {
    const container = renderer.create(<RightPanel TestPanel={<div>TestPanel</div>} />);

    expect(container).toMatchSnapshot();
  });
});
