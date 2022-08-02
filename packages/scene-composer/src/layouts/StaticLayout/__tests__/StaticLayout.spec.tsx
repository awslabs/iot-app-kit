import renderer from 'react-test-renderer';
import React from 'react';

import { StaticLayout } from '..';

describe('StaticLayoutSnap', () => {
  it('should render correctly without modal', () => {
    const container = renderer.create(
      <StaticLayout
        header={'header'}
        footer={'footer'}
        leftPanel={'leftPanel'}
        rightPanel={'rightPanel'}
        modalContent={'modalContent'}
        mainContent={'mainContent'}
        showModal={false}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with modal', () => {
    const container = renderer.create(
      <StaticLayout
        header={'header'}
        footer={'footer'}
        leftPanel={'leftPanel'}
        rightPanel={'rightPanel'}
        modalContent={'modalContent'}
        mainContent={'mainContent'}
        showModal={true}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with topBar', () => {
    const container = renderer.create(
      <StaticLayout
        header={'header'}
        footer={'footer'}
        leftPanel={'leftPanel'}
        rightPanel={'rightPanel'}
        modalContent={'modalContent'}
        mainContent={'mainContent'}
        topBar={'topBar'}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
