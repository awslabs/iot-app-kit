/* eslint-disable */
import * as THREE from 'three';
import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
jest.useFakeTimers();

import Mock = jest.Mock;

const mockThreeStates = {
  gl: {
    capabilities: {
      getMaxAnisotropy: jest.fn(),
    },
  },
  scene: new THREE.Scene(),
  camera: new THREE.PerspectiveCamera(),
};

const mockUseFrame = jest.fn();
jest.doMock('@react-three/fiber', () => {
  const originalModule = jest.requireActual('@react-three/fiber');
  return {
    ...originalModule,
    useThree: jest.fn(),
    useFrame: mockUseFrame,
  };
});

const mockUseGLTF = jest.fn();
jest.doMock('../GLTFLoader', () => {
  const originalModule = jest.requireActual('../GLTFLoader');
  return {
    ...originalModule,
    useGLTF: mockUseGLTF,
  };
});

const mockEnableShadow = jest.fn();
jest.doMock('../../../../utils/objectThreeUtils', () => {
  const originalModule = jest.requireActual('../../../../utils/objectThreeUtils');
  return {
    ...originalModule,
    acceleratedRaycasting: jest.fn(),
    deepClonedeepClone: jest.fn(),
    enableShadow: mockEnableShadow,
  };
});

import { useThree } from '@react-three/fiber';
import { IModelRefComponentInternal, useStore } from '../../../../store';
import { GLTFModelComponent } from '../GLTFModelComponent';
import { KnownComponentType } from '../../../..';
import { getScaleFactor } from '../../../../utils/mathUtils';

// @ts-ignore
jest.mock('scheduler', () => require('scheduler/unstable_mock'));

/* eslint-enable */

describe('GLTFLoader', () => {
  const mockStoreUriModifier = jest.fn();
  const mockSetLoadingModelState = jest.fn();

  const baseState: any = {
    getEditorConfig: () => ({ uriModifier: mockStoreUriModifier }),
    setLoadingModelState: mockSetLoadingModelState,
  };
  const baseNode: any = {
    ref: 'mock-node',
  };
  const baseComponent: IModelRefComponentInternal = {
    ref: 'mock-comp',
    type: KnownComponentType.ModelRef,
    uri: 'mock/uri',
    modelType: 'GLB',
  };
  const mockObject = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 3), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
  const baseScene = new THREE.Group();
  baseScene.add(mockObject);

  const setup = () => {
    jest.resetAllMocks();

    const useThreeMock = useThree as Mock;
    useThreeMock.mockReturnValue(mockThreeStates);

    mockUseGLTF.mockImplementation((p, u, e, o) => {
      return { scene: baseScene };
    });

    mockUseFrame.mockImplementation((cb) => cb());
  };

  beforeEach(() => {
    setup();
  });

  it('should call enableShadow in useFrame', async () => {
    useStore('default').setState(baseState);

    const rendered = await ReactThreeTestRenderer.create(
      <GLTFModelComponent node={baseNode} component={baseComponent} hiddenWhileImmersive={false} />,
    );

    // cloned - different id, but same geometry
    expect(rendered.scene.children[0].instance.children[0].children[0].uuid).not.toEqual(baseScene.children[0].uuid);
    expect((rendered.scene.children[0].instance.children[0].children[0] as THREE.Mesh).geometry).toEqual(
      (baseScene.children[0] as THREE.Mesh).geometry,
    );
  });

  describe('useGLTF', () => {
    let path;
    let extensionsCb;
    let uriModifier;
    let onProgressCb;

    beforeEach(() => {
      setup();

      mockUseGLTF.mockImplementation((p, u, e, o) => {
        path = p;
        extensionsCb = e;
        uriModifier = u;
        onProgressCb = o;
        return { scene: new THREE.Group() };
      });
    });

    it('should be called with correct path and uriModifier', async () => {
      useStore('default').setState(baseState);

      await ReactThreeTestRenderer.create(
        <GLTFModelComponent node={baseNode} component={baseComponent} hiddenWhileImmersive={false} />,
      );

      expect(path).toEqual(baseComponent.uri);
      expect(uriModifier).toBe(mockStoreUriModifier);
    });

    it('should set loading modal state correctly', async () => {
      useStore('default').setState(baseState);
      const mockLoader = {
        manager: {
          onStart: () => null,
          onLoad: () => null,
          onError: () => null,
        },
      };

      await ReactThreeTestRenderer.create(
        <GLTFModelComponent node={baseNode} component={baseComponent} hiddenWhileImmersive={false} />,
      );
      extensionsCb(mockLoader);

      // onStart
      mockLoader.manager.onStart();
      jest.runAllTimers();
      expect(mockSetLoadingModelState).toBeCalledTimes(1);
      expect(mockSetLoadingModelState).toHaveBeenLastCalledWith(true);

      // onLoad
      mockLoader.manager.onLoad();
      jest.runAllTimers();
      expect(mockSetLoadingModelState).toBeCalledTimes(2);
      expect(mockSetLoadingModelState).toHaveBeenLastCalledWith(false);

      // onError
      mockLoader.manager.onError();
      jest.runAllTimers();
      expect(mockSetLoadingModelState).toBeCalledTimes(3);
      expect(mockSetLoadingModelState).toHaveBeenLastCalledWith(false);
    });

    it('should update downloading progress correctly', async () => {
      useStore('default').setState(baseState);
      const mockProcessEvent = {
        lengthComputable: true,
        total: 123,
        target: { responseURL: 'a/b/c' },
        loaded: 11,
      };
      const onDownloadProgressSpy = jest
        .spyOn(THREE.DefaultLoadingManager as any, '__onDownloadProgress')
        .mockImplementation(() => null);

      await ReactThreeTestRenderer.create(
        <GLTFModelComponent node={baseNode} component={baseComponent} hiddenWhileImmersive={false} />,
      );
      onProgressCb(mockProcessEvent);

      expect(onDownloadProgressSpy).toBeCalledTimes(1);
      expect(onDownloadProgressSpy).toHaveBeenLastCalledWith('a/b/c', 11, 123);
    });
  });

  describe('scale', () => {
    beforeEach(() => {
      setup();
    });

    it('should use defalt scale when component does not specify it', async () => {
      useStore('default').setState(baseState);

      const rendered = await ReactThreeTestRenderer.create(
        <GLTFModelComponent node={baseNode} component={baseComponent} hiddenWhileImmersive={false} />,
      );

      expect(Object.values(rendered.scene.children[0]._fiber.scale)).toEqual([1, 1, 1]);
    });

    it('should use local scale set in component', async () => {
      useStore('default').setState(baseState);
      const expected: any = [2, 3, 4];

      const rendered = await ReactThreeTestRenderer.create(
        <GLTFModelComponent
          node={baseNode}
          component={{ ...baseComponent, localScale: expected }}
          hiddenWhileImmersive={false}
        />,
      );

      expect(Object.values(rendered.scene.children[0]._fiber.scale)).toEqual(expected);
    });

    it('should return correct scale for centimeter', async () => {
      useStore('default').setState(baseState);
      const scale = getScaleFactor('centimeters', 'meters');
      const expected: any = [scale, scale, scale];

      const rendered = await ReactThreeTestRenderer.create(
        <GLTFModelComponent
          node={baseNode}
          component={{ ...baseComponent, unitOfMeasure: 'centimeters' }}
          hiddenWhileImmersive={false}
        />,
      );

      expect(Object.values(rendered.scene.children[0]._fiber.scale)).toEqual(expected);
    });
  });

  it('should clone and attach the scene', async () => {
    useStore('default').setState(baseState);
    mockThreeStates.gl.capabilities.getMaxAnisotropy.mockReturnValue(1);

    await ReactThreeTestRenderer.create(
      <GLTFModelComponent node={baseNode} component={baseComponent} hiddenWhileImmersive={false} />,
    );

    expect(mockEnableShadow).toBeCalled();
    expect(mockEnableShadow).toBeCalledWith(baseComponent, expect.any(THREE.Object3D), 1);
  });

  // TODO: Add tests to send onPointerDown and onPointerUp and verify closet is passed to setViewpointNodeRef Similarly to ViewCursorWidget

  // TODO: Add tests to send onPointerDown, onPointerMove and onPointerUp while adding and verify correct functions are executed
});
