/* eslint-disable import/first */
import React from 'react';
import renderer from 'react-test-renderer';
import { useLoader } from '@react-three/fiber';

import { ViewpointWidget } from '../../../../../src/augmentations/components/three-fiber/viewpoint/ViewpointWidget';

jest.mock('../../../../../src/augmentations/components/three-fiber/common/SvgIconToWidgetVisual', () =>
  jest.fn(((data, name, alwaysVisible, props) => <div data-test-id={'widgetVisual_' + name} {...props} />) as any),
);

jest.mock('@react-three/fiber', () => {
  const originalModule = jest.requireActual('@react-three/fiber');
  return {
    ...originalModule,
    useLoader: jest.fn(),
  };
});

describe('ViewpointWidget', () => {
  const node = {
    ref: 'viewpoint-node-ref',
    properties: {},
  };

  beforeEach(() => {
    (useLoader as unknown as jest.Mock).mockReturnValue(['TestSvgData']);
  });

  it('should render correctly', () => {
    const container = renderer.create(<ViewpointWidget node={node as any} />);
    expect(container).toMatchSnapshot();
  });
});
