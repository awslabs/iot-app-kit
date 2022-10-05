/* eslint-disable import/first */
import * as THREE from 'three';
import React from 'react';
import renderer from 'react-test-renderer';
import { act } from '@testing-library/react';
import { useLoader, useThree } from '@react-three/fiber';
import { MockTransformControls } from '../../../../../tests/__mocks__/MockTransformControls';

import { ViewCursorWidget } from '../viewpoint/ViewCursorWidget';
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
  const scene = new THREE.Scene();

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
