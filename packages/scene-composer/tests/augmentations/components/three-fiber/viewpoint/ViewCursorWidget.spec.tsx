/* eslint-disable import/first */
import * as THREE from 'three';
import React from 'react';
import renderer from 'react-test-renderer';
import { useLoader, useThree } from '@react-three/fiber';

import { ViewCursorWidget } from '../../../../../src/augmentations/components/three-fiber/viewpoint/ViewCursorWidget';
import { Viewpoint } from '../../../../../src';
import { useStore } from '../../../../../src/store';

jest.mock('../../../../../src/augmentations/components/three-fiber/common/SvgIconToWidgetVisual', () =>
  jest.fn(((data, name, props) => <div data-test-id={'widgetVisual_' + name} {...props} />) as any),
);

jest.mock('@react-three/fiber', () => {
  const originalModule = jest.requireActual('@react-three/fiber');

  return {
    ...originalModule,
    useLoader: jest.fn(),
    useThree: jest.fn(),
    useFrame: jest.fn().mockImplementation((func) => {
      func();
    }),
  };
});

describe('ViewCursorWidget', () => {
  const closestViewpoint = new Viewpoint();
  closestViewpoint.position.set(5, 5, 5);
  closestViewpoint.userData = { nodeRef: 'closest' };

  const furthestViewpoint = new Viewpoint();
  furthestViewpoint.position.set(15, 15, 15);
  furthestViewpoint.userData = { nodeRef: 'furthest' };

  const scene = new THREE.Scene();
  scene.add(closestViewpoint, furthestViewpoint);

  const baseState: any = {
    cursorVisible: true,
    cursorStyle: 'move',
  };

  beforeEach(() => {
    (useLoader as unknown as jest.Mock).mockReturnValue(['TestSvgData']);
    (useThree as unknown as jest.Mock).mockReturnValue(scene);
  });

  it('should render correctly with move style', () => {
    useStore('default').setState({
      cursorVisible: true,
      cursorStyle: 'move',
    });
    const container = renderer.create(<ViewCursorWidget />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with edit style', () => {
    useStore('default').setState({
      cursorVisible: true,
      cursorStyle: 'edit',
    });
    const container = renderer.create(<ViewCursorWidget />);
    expect(container).toMatchSnapshot();
  });

  // TODO: Add tests to send onPointerDown and onPointerUp and verify closet is passed to setViewpointNodeRef
});
