import React from 'react';
import renderer from 'react-test-renderer';

import { ViewpointComponent } from '../../../src/components/three-fiber/ViewpointComponent';

jest.mock('../../../src/augmentations/components/three-fiber/viewpoint/ViewpointWidget', () => {
  return {
    ViewpointWidget: 'ViewpointWidget',
  };
});

describe('ViewpointComponent', () => {
  const node = {
    ref: 'viewpoint-node-ref',
  };

  it('should render', () => {
    const container = renderer.create(<ViewpointComponent node={node as any} />);
    expect(container).toMatchSnapshot();
  });
});
