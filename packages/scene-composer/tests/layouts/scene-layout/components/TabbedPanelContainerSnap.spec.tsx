/* eslint-disable import/first */
import renderer from 'react-test-renderer';
import React from 'react';

// eslint-disable-next-line import/order
import { mockPolaris } from '../../../__mocks__/MockPolaris';

mockPolaris();

import TabbedPanelContainer from '../../../../src/layouts/scene-layout/components/TabbedPanelContainer';

describe('TabbedPanelContainerSnap', () => {
  it('should render correctly', () => {
    const container = renderer.create(
      <TabbedPanelContainer panels={{ test1: <div> Panel 1 </div>, test2: <div> Panel 2 </div> }} />,
    );
    expect(container).toMatchSnapshot();
  });
});
