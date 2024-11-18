import { render } from '@testing-library/react';
import * as THREE from 'three';
jest.doMock('@react-three/fiber', () => ({
  useThree: jest.fn(),
}));
import { useThree } from '@react-three/fiber';

import { COMPOSER_FEATURES, type ISceneBackgroundSetting } from '../../interfaces';
import { accessStore } from '../../store';

const getScenePropertyMock = jest.fn();
const baseState = {
  getSceneProperty: getScenePropertyMock,
};
const mockTexture = new THREE.Texture();
mockTexture.name = 'testTextureName';

const mockLoadTexture = (uri, cb) => {
  cb(mockTexture);
};
const mockFeatureConfigOn = { [COMPOSER_FEATURES.Textures]: true };

import SceneBackground from './SceneBackground';

jest.mock('../../hooks/useTwinMakerTextureLoader', () => {
  return () => ({
    loadTexture: mockLoadTexture,
  });
});

jest.mock('../../common/GlobalSettings', () => {
  return {
    getGlobalSettings: () => ({ featureConfig: mockFeatureConfigOn }),
  };
});

describe('SceneBackground', () => {
  const setup = () => {
    jest.resetAllMocks();

    accessStore('default').setState(baseState);
  };

  beforeEach(() => {
    setup();
  });

  it(`should add background color to the scene`, () => {
    const testScene = new THREE.Scene();
    const mockThreeStates = {
      scene: testScene,
    };
    const useThreeMock = useThree as jest.Mock;
    useThreeMock.mockImplementation((s) => {
      return s(mockThreeStates);
    });

    const backgroundSetting: ISceneBackgroundSetting = {
      color: '#cccccc',
    };
    getScenePropertyMock.mockReturnValue(backgroundSetting);

    expect(testScene.background).toBeNull();
    render(<SceneBackground />);
    const background = testScene.background as THREE.Color;

    expect(background.getHexString()).toEqual(backgroundSetting.color?.replace('#', ''));
  });

  it(`should add texture background to the scene`, () => {
    const testScene = new THREE.Scene();
    const mockThreeStates = {
      scene: testScene,
    };
    const useThreeMock = useThree as jest.Mock;
    useThreeMock.mockImplementation((s) => {
      return s(mockThreeStates);
    });
    const backgroundSetting: ISceneBackgroundSetting = {
      textureUri: 'filepath',
    };
    getScenePropertyMock.mockReturnValue(backgroundSetting);

    expect(testScene.background).toBeNull();
    render(<SceneBackground />);

    expect((testScene.background as THREE.Texture).name).toEqual('testTextureName');
  });

  it(`should not add background to the scene`, () => {
    const testScene = new THREE.Scene();
    const mockThreeStates = {
      scene: testScene,
    };
    const useThreeMock = useThree as jest.Mock;
    useThreeMock.mockImplementation((s) => {
      return s(mockThreeStates);
    });

    getScenePropertyMock.mockReturnValue(undefined);

    expect(testScene.background).toBeNull();
    render(<SceneBackground />);
    expect(testScene.background).toBeNull();
  });
});
