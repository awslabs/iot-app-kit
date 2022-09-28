/* eslint-disable import/first */
import renderer from 'react-test-renderer';
import React from 'react';

import TabbedPanelContainer from './TabbedPanelContainer';

describe('TabbedPanelContainerSnap', () => {
  it('should render correctly', () => {
    const container = renderer.create(
      <TabbedPanelContainer panels={{ test1: <div> Panel 1 </div>, test2: <div> Panel 2 </div> }} />,
    );
    expect(container).toMatchSnapshot();
  });
});
