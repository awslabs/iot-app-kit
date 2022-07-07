/* eslint-disable */
import React from 'react';

const mockRGBELoaderSetPath = jest.fn();
jest.doMock('three-stdlib', () => {
  const originalModule = jest.requireActual('three-stdlib');
  return {
    ...originalModule,
    RGBELoader: {
      setPath: mockRGBELoaderSetPath
    },
  };
});

const mockCubeLoaderSetPath = jest.fn();
jest.doMock('three', () => {
  const originalModule = jest.requireActual('three');
  return {
    ...originalModule,
    CubeTextureLoader: {
      setPath: mockCubeLoaderSetPath
    },
  };
});

import * as THREE from 'three';
import ReactThreeTestRenderer from '@react-three/test-renderer';

import Mock = jest.Mock;

const getMockThreeStates = () => {
  return {gl: {
    domElement: document.createElement('canvas'),
    compile: jest.fn()
  },
  scene: {
    environment: new THREE.Texture(),
    background: new THREE.Color(255, 0, 0),
  }};
};
const mockUseLoader = jest.fn();
jest.doMock('@react-three/fiber', () => {
  const originalModule = jest.requireActual('@react-three/fiber');
  return {
    ...originalModule,
    useThree: jest.fn(),
    useLoader: mockUseLoader,
  };
});

const mockUseAsset = jest.fn();
const mockClear = jest.fn();
function useAsset(cb, param, a) {return mockUseAsset(cb, param, a);}
namespace useAsset {
  export const clear = mockClear;
}
jest.doMock('use-asset', () => {
  const originalModule = jest.requireActual('use-asset');
  return {
    ...originalModule,
    useAsset,
  };
});

const mockGetGlobalSettings = jest.fn();
jest.doMock('../../../src/GlobalSettings', () => {
  const originalModule = jest.requireActual('../../../src/GlobalSettings');
  return {
    ...originalModule,
    getGlobalSettings: mockGetGlobalSettings,
  };
});

import { Environment, presetsObj } from '../../../src/components/three-fiber/Environment';

import { useThree } from '@react-three/fiber';
import reactThreeTestRenderer from '@react-three/test-renderer';

// @ts-ignore
jest.mock('scheduler', () => require('scheduler/unstable_mock'));
/* eslint-enable */

describe('Environment', () => {
  const mockUseAssetResult = new THREE.Texture(document.createElement('canvas'));
  let mockThreeStates;

  let fromCubemapSpy;
  let compileEquirectangularShaderSpy;
  let generatorDisposeSpy;
  let fromEquirectangularSpy;

  const setup = () => {
    jest.resetAllMocks();

    mockThreeStates = getMockThreeStates();
    const useThreeMock = useThree as Mock;
    useThreeMock.mockImplementation((s) => {
      return s(mockThreeStates);
    });

    mockUseAsset.mockReturnValue(mockUseAssetResult);
    mockUseLoader.mockImplementation(() => new THREE.Texture());
    mockGetGlobalSettings.mockReturnValue({ cdnPath: 'abc' });

    fromCubemapSpy = jest.spyOn(THREE.PMREMGenerator.prototype, 'fromCubemap');
    compileEquirectangularShaderSpy = jest.spyOn(THREE.PMREMGenerator.prototype, 'compileEquirectangularShader');
    generatorDisposeSpy = jest.spyOn(THREE.PMREMGenerator.prototype, 'dispose');
    fromEquirectangularSpy = jest.spyOn(THREE.PMREMGenerator.prototype, 'fromEquirectangular');
  };

  beforeEach(() => {
    setup();
  });

  it('should render with default props', async () => {
    const oldSceneEnv = mockThreeStates.scene.environment;
    const oldSceneBackground = mockThreeStates.scene.background;
    const disposeSpy = jest.spyOn(mockUseAssetResult, 'dispose');

    const renderer = await ReactThreeTestRenderer.create(<Environment />);

    expect(mockThreeStates.scene.environment).toBe(mockUseAssetResult);
    expect(mockThreeStates.scene.background).toBe(oldSceneBackground);

    await reactThreeTestRenderer.act(async () => {
      await renderer.unmount();
    });

    expect(mockClear).toBeCalledTimes(1);
    expect(mockThreeStates.scene.environment).toBe(oldSceneEnv);
    expect(mockThreeStates.scene.background).toBe(oldSceneBackground);
    expect(disposeSpy).toBeCalledTimes(1);
  });

  it('should render with background', async () => {
    const oldSceneEnv = mockThreeStates.scene.environment;
    const oldSceneBackground = mockThreeStates.scene.background;
    const disposeSpy = jest.spyOn(mockUseAssetResult, 'dispose');

    const renderer = await ReactThreeTestRenderer.create(<Environment background />);
    expect(mockThreeStates.scene.environment).toBe(mockUseAssetResult);
    expect(mockThreeStates.scene.background).toBe(mockUseAssetResult);

    await reactThreeTestRenderer.act(async () => {
      await renderer.unmount();
    });

    expect(mockClear).toBeCalledTimes(1);
    expect(mockThreeStates.scene.environment).toBe(oldSceneEnv);
    expect(mockThreeStates.scene.background).toBe(oldSceneBackground);
    expect(disposeSpy).toBeCalledTimes(1);
  });

  it('should render with custom scene', async () => {
    const oldSceneEnv = mockThreeStates.scene.environment;
    const oldSceneBackground = mockThreeStates.scene.background;

    const customSceneEnv = new THREE.Texture();
    const customSceneBackground = new THREE.Texture();
    const scene = new THREE.Scene();
    scene.environment = customSceneEnv;
    scene.background = customSceneBackground;

    const disposeSpy = jest.spyOn(mockUseAssetResult, 'dispose');

    const renderer = await ReactThreeTestRenderer.create(<Environment scene={scene} />);
    expect(mockThreeStates.scene.environment).toBe(oldSceneEnv);
    expect(mockThreeStates.scene.background).toBe(oldSceneBackground);
    expect(scene.environment).toBe(mockUseAssetResult);
    expect(scene.background).toBe(customSceneBackground);

    await reactThreeTestRenderer.act(async () => {
      await renderer.unmount();
    });

    expect(mockClear).toBeCalledTimes(1);
    expect(mockThreeStates.scene.environment).toBe(oldSceneEnv);
    expect(mockThreeStates.scene.background).toBe(oldSceneBackground);
    expect(scene.environment).toBe(customSceneEnv);
    expect(scene.background).toBe(customSceneBackground);
    expect(disposeSpy).toBeCalledTimes(1);
  });

  it('should render with custom scene and background', async () => {
    const oldSceneEnv = mockThreeStates.scene.environment;
    const oldSceneBackground = mockThreeStates.scene.background;

    const customSceneEnv = new THREE.Texture();
    const customSceneBackground = new THREE.Texture();
    const scene = new THREE.Scene();
    scene.environment = customSceneEnv;
    scene.background = customSceneBackground;

    const disposeSpy = jest.spyOn(mockUseAssetResult, 'dispose');

    const renderer = await ReactThreeTestRenderer.create(<Environment background scene={scene} />);
    expect(mockThreeStates.scene.environment).toBe(oldSceneEnv);
    expect(mockThreeStates.scene.background).toBe(oldSceneBackground);
    expect(scene.environment).toBe(mockUseAssetResult);
    expect(scene.background).toBe(mockUseAssetResult);

    await reactThreeTestRenderer.act(async () => {
      await renderer.unmount();
    });

    expect(mockClear).toBeCalledTimes(1);
    expect(mockThreeStates.scene.environment).toBe(oldSceneEnv);
    expect(mockThreeStates.scene.background).toBe(oldSceneBackground);
    expect(scene.environment).toBe(customSceneEnv);
    expect(scene.background).toBe(customSceneBackground);
    expect(disposeSpy).toBeCalledTimes(1);
  });

  it('should call extensions correctly', async () => {
    const mockLoaderResult = new THREE.Texture();
    let loaderInstance;
    mockUseLoader.mockImplementation((loader, input, ext) => {
      loaderInstance = loader;
      ext(loader);
      return mockLoaderResult;
    });

    const extensions = jest.fn();
    await ReactThreeTestRenderer.create(<Environment extensions={extensions} path={'123/456'} />);

    expect(extensions).toBeCalledWith(loaderInstance);
    expect(mockCubeLoaderSetPath).toBeCalledWith('123/456');
    expect(mockRGBELoaderSetPath).not.toBeCalled();
  });

  it('should render with preset', async () => {
    const mockLoaderResult = new THREE.Texture();
    let loaderInstance;
    let file;
    mockUseLoader.mockImplementation((loader, input, ext) => {
      file = input;
      loaderInstance = loader;
      ext(loader);
      return mockLoaderResult;
    });

    await ReactThreeTestRenderer.create(<Environment preset={'neutral'} />);

    expect(file).toEqual(presetsObj.neutral);
    expect(mockCubeLoaderSetPath).not.toBeCalled();
    expect(mockRGBELoaderSetPath).toBeCalledWith('abc/hdri/');
  });

  it('should useAsset callback return correct texture without preset', async () => {
    let useAssetCb;
    let mapInput;
    mockUseAsset.mockImplementation((cb, map, _) => {
      useAssetCb = cb;
      mapInput = map;
      return mockUseAssetResult;
    });
    const expected = new THREE.Texture();
    fromCubemapSpy.mockReturnValue({ texture: expected });
    await ReactThreeTestRenderer.create(<Environment />);

    const result = await useAssetCb(mapInput);

    expect(result).toEqual(expected);
    expect(compileEquirectangularShaderSpy).toBeCalledTimes(1);
    expect(fromEquirectangularSpy).not.toBeCalled();
    expect(generatorDisposeSpy).toBeCalledTimes(1);
  });

  it('should useAsset callback return correct texture with preset', async () => {
    let useAssetCb;
    let mapInput;
    mockUseAsset.mockImplementation((cb, map, _) => {
      useAssetCb = cb;
      mapInput = map;
      return mockUseAssetResult;
    });
    const expected = new THREE.Texture();
    fromEquirectangularSpy.mockReturnValue({ texture: expected });
    await ReactThreeTestRenderer.create(<Environment preset={'neutral'} />);

    const result = await useAssetCb(mapInput);

    expect(result).toEqual(expected);
    expect(compileEquirectangularShaderSpy).not.toBeCalled();
    expect(fromEquirectangularSpy).toBeCalledTimes(1);
    expect(generatorDisposeSpy).toBeCalledTimes(1);
  });
});
