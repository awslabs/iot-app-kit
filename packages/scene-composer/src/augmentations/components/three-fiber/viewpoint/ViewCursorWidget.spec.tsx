/* eslint-disable import/first */
import * as THREE from 'three';
import React from 'react';
import renderer from 'react-test-renderer';
import { act } from '@testing-library/react';
import { useLoader, useThree } from '@react-three/fiber';
import { MockTransformControls } from '../../../../../tests/__mocks__/MockTransformControls';

import { ViewCursorWidget } from '../viewpoint/ViewCursorWidget';
import { Viewpoint } from '../../../../../src';
import { useStore } from '../../../../../src/store';
import SceneLayout from '../../../../../src/layouts/SceneLayout/SceneLayout';

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

const Layout: React.FC = () => {
  return (
    <SceneLayout
      onPointerMissed={() => { }}
      LoadingView={<div data-test-id={'Loading view'} />}
      isViewing={false}
      showMessageModal={false}
    >
      <ViewCursorWidget />
    </SceneLayout>
  )
};

describe('ViewCursorWidget', () => {
  const closestViewpoint = new Viewpoint();
  closestViewpoint.position.set(5, 5, 5);
  closestViewpoint.userData = { nodeRef: 'closest' };

  const furthestViewpoint = new Viewpoint();
  furthestViewpoint.position.set(15, 15, 15);
  furthestViewpoint.userData = { nodeRef: 'furthest' };

  const scene = new THREE.Scene();
  scene.add(closestViewpoint, furthestViewpoint);

  beforeEach(() => {
    (useLoader as unknown as jest.Mock).mockReturnValue(['TestSvgData']);
    (useThree as unknown as jest.Mock).mockReturnValue(scene);
  });

  it('should render correctly with move style', () => {
    useStore('default').setState({
      cursorVisible: true,
      cursorStyle: 'move',
    });
    const container = renderer.create(<Layout />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with edit style', () => {
    useStore('default').setState({
      cursorVisible: true,
      cursorStyle: 'edit',
    });
    const container = renderer.create(<Layout />);
    expect(container).toMatchSnapshot();
  });
});
