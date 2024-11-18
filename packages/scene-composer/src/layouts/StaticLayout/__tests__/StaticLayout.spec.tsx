import { create } from 'react-test-renderer';

import { StaticLayout } from '..';

describe('StaticLayoutSnap', () => {
  it('should render correctly without modal', () => {
    const container = create(
      <StaticLayout
        header='header'
        footer='footer'
        leftPanel='leftPanel'
        rightPanel='rightPanel'
        mainContent='mainContent'
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with modal', () => {
    const container = create(
      <StaticLayout
        header='header'
        footer='footer'
        leftPanel='leftPanel'
        rightPanel='rightPanel'
        modalContent='modalContent'
        mainContent='mainContent'
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with topBar', () => {
    const container = create(
      <StaticLayout
        header='header'
        footer='footer'
        leftPanel='leftPanel'
        rightPanel='rightPanel'
        mainContent='mainContent'
        topBar='topBar'
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
