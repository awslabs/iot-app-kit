/* eslint-disable */
import * as THREE from 'three';

jest.doMock('@react-three/drei/core/OrbitControls', () => {
  const originalModule = jest.requireActual('@react-three/drei/core/OrbitControls');
  return {
    ...originalModule,
    OrbitControls: 'OrbitControls',
  };
});

jest.doMock('@react-three/drei/core/PerspectiveCamera', () => {
  const originalModule = jest.requireActual('@react-three/drei/core/PerspectiveCamera');
  return {
    ...originalModule,
    PerspectiveCamera: 'PerspectiveCamera',
  };
});

jest.doMock('../../../src/components/three-fiber/controls/TripodControls', () => {
  const originalModule = jest.requireActual('../../../src/components/three-fiber/controls/TripodControls');
  return {
    ...originalModule,
    TripodControls: 'TripodControls',
  };
});

import * as React from 'react';
import renderer from 'react-test-renderer';

import { ImmersiveViewCamera } from '../../../src/components/three-fiber/ImmersiveViewCamera';
import { useStore } from '../../../src/store';
/* eslint-enable */

describe('ImmersiveViewCamera', () => {
  const viewpointObject = new THREE.Object3D();
  const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
  const material = new THREE.MeshBasicMaterial();
  const mesh = new THREE.Mesh(boxGeometry, material);
  mesh.position.set(1, 1, 1);
  mesh.add(viewpointObject);

  const mockGetObject3DBySceneNodeRef = jest.fn().mockReturnValue(viewpointObject);

  const baseState: any = {
    cameraCommand: undefined,
    cameraControlsType: 'immersive',
    getObject3DBySceneNodeRef: mockGetObject3DBySceneNodeRef,
  };

  describe('render', () => {
    it('should render ImmersiveViewControl', async () => {
      useStore('default').setState(baseState);

      const container = renderer.create(<ImmersiveViewCamera />);

      expect(container).toMatchSnapshot();
    });

    it('should not render OrbitControl', async () => {
      useStore('default').setState({ ...baseState, cameraControlsType: 'orbit' });

      const container = renderer.create(<ImmersiveViewCamera />);

      expect(container).toMatchSnapshot();
    });

    it('should not render MapControl', async () => {
      useStore('default').setState({ ...baseState, cameraControlsType: 'pan' });

      const container = renderer.create(<ImmersiveViewCamera />);

      expect(container).toMatchSnapshot();
    });
  });
});
