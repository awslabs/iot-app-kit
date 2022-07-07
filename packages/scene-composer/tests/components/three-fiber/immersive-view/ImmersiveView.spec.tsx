/* eslint-disable import/first */
/* eslint-disable import/order */
import * as THREE from 'three';
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { useThree } from '@react-three/fiber';

import { mockR3F } from '../../../__mocks__/MockR3F';
mockR3F();

import { ImmersiveView } from '../../../../src/components/three-fiber/immersive-view/ImmersiveView';
import { useStore } from '../../../../src/store';
import { KnownComponentType } from '../../../../src';
import Mock = jest.Mock;

jest.mock('three', () => {
  const originalModule = jest.requireActual('three');
  class MockTexture {}
  return {
    ...originalModule,
    Texture: MockTexture,
  };
});

jest.mock('../../../../src/components/three-fiber/LoadingProgress', () => ({
  LoadingProgress: 'LoadingProgress',
}));

jest.mock('../../../../src/hooks/usePreloadSkyboxImages', () => jest.fn());

jest.mock('@react-three/fiber', () => {
  const originalModule = jest.requireActual('@react-three/fiber');
  return {
    ...originalModule,
    useThree: jest.fn(),
    useFrame: jest.fn().mockImplementation((callback) => callback()),
  };
});

jest.mock('../../../../src/components/three-fiber/immersive-view/ImmersiveViewUtils', () => ({
  areAllImagesInCache: jest.fn(),
  generateSixSidedSkyboxTexture: jest.fn().mockImplementation((images, setter) => {
    setter([new THREE.Texture()]);
    return new Promise(jest.fn());
  }),
}));

describe('ImmersiveView', () => {
  const viewpointObject = new THREE.Object3D();
  const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
  const material = new THREE.MeshBasicMaterial();
  const mesh = new THREE.Mesh(boxGeometry, material);
  mesh.position.set(1, 1, 1);
  mesh.add(viewpointObject);
  const scene = new THREE.Scene();
  scene.add(mesh);

  const mockGetSceneNodeByRef = jest.fn();
  const mockSetCameraControlsType = jest.fn();
  const mockGetObject3DBySceneNodeRef = jest.fn().mockReturnValue(viewpointObject);

  const sixSidedViewpointNode = {
    ref: 'selected-viewpoint-ref',
    components: [
      {
        type: KnownComponentType.Viewpoint,
        skyboxImageFormat: 'SixSided',
        skyboxImages: ['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'],
        cameraPosition: [0, 1.5, 0],
        visibleObjectIds: [],
      },
    ],
  };

  const cubeMapViewpointNode = {
    ref: 'selected-viewpoint-ref',
    components: [
      {
        type: KnownComponentType.Viewpoint,
        skyboxImageFormat: 'CubeMap',
        skyboxImages: ['cubemap.png'],
        cameraPosition: [0, 1.5, 0],
        visibleObjectIds: [],
      },
    ],
  };

  const equirectangularViewpointNode = {
    ref: 'selected-viewpoint-ref',
    components: [
      {
        type: KnownComponentType.Viewpoint,
        skyboxImageFormat: 'Equirectangular',
        skyboxImages: ['equirectangular.png'],
        cameraPosition: [0, 1.5, 0],
        visibleObjectIds: [],
      },
    ],
  };

  const baseState: any = {
    getSceneNodeByRef: mockGetSceneNodeByRef,
    setCameraControlsType: mockSetCameraControlsType,
    getObject3DBySceneNodeRef: mockGetObject3DBySceneNodeRef,
    selectedSceneNodeRef: 'selected-ref',
    selectedViewpointNodeRef: ' selected-viewpoint-ref',
    cameraControlsType: 'immersive',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useStore('default').setState(baseState);
    (useThree as unknown as Mock).mockReturnValue({
      renderer: 'mockRenderer',
      camera: new THREE.PerspectiveCamera(),
    });
  });

  it('should render Loading state correctly', () => {
    useStore('default').setState(baseState);
    mockGetSceneNodeByRef.mockReturnValue(sixSidedViewpointNode);

    const container = renderer.create(<ImmersiveView />);
    expect(container).toMatchSnapshot();
  });

  it('should render six sided Viewpoint correctly', () => {
    mockGetSceneNodeByRef.mockReturnValue(sixSidedViewpointNode);
    jest.spyOn(THREE.Cache, 'get').mockReturnValue(new THREE.Texture());

    let container;
    act(() => {
      container = renderer.create(<ImmersiveView />);
    });
    expect(container).toMatchSnapshot();
  });

  it('should set uv mapping as expected.', () => {
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    jest.spyOn(React, 'useRef').mockImplementation(() => {
      return { current: { geometry: boxGeometry } };
    });

    act(() => {
      renderer.create(<ImmersiveView />);
    });

    expect(Math.abs(0.005 - boxGeometry.attributes.uv.array[0])).toBeLessThan(0.00001);
  });
});
