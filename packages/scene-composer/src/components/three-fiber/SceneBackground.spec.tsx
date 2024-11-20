import { render } from '@/tests/testing-library';
import * as THREE from 'three';
import * as reactThree from '@react-three/fiber';
import { COMPOSER_FEATURES, type ISceneBackgroundSetting } from '../../interfaces';
import { accessStore } from '../../store';
import SceneBackground from './SceneBackground';

vi.doMock('@react-three/fiber', () => ({
  useThree: vi.fn(),
}));

const getScenePropertyMock = vi.fn();
const baseState = {
  getSceneProperty: getScenePropertyMock,
};
const mockTexture = new THREE.Texture();
mockTexture.name = 'testTextureName';

const mockLoadTexture = (uri, cb) => {
  cb(mockTexture);
};
const mockFeatureConfigOn = { [COMPOSER_FEATURES.Textures]: true };

vi.mock('../../hooks/useTwinMakerTextureLoader', () => ({
  default: () => ({
    loadTexture: mockLoadTexture,
  }),
}));

vi.mock('../../common/GlobalSettings', () => {
  return {
    getGlobalSettings: () => ({ featureConfig: mockFeatureConfigOn }),
  };
});

describe('SceneBackground', () => {
  const setup = () => {
    vi.resetAllMocks();

    accessStore('default').setState(baseState);
  };

  beforeEach(() => {
    setup();
  });

  it(`should add background color to the scene`, () => {
    const testScene = new THREE.Scene();
    vi.spyOn(reactThree, 'useThree').mockImplementation((s) => {
      if (s) {
        return s({ scene: testScene } as reactThree.RootState);
      }
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
    vi.spyOn(reactThree, 'useThree').mockImplementation((s) => {
      if (s) {
        return s({ scene: testScene } as reactThree.RootState);
      }
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
    vi.spyOn(reactThree, 'useThree').mockImplementation((s) => {
      if (s) {
        return s({ scene: testScene } as reactThree.RootState);
      }
    });
    getScenePropertyMock.mockReturnValue(undefined);

    expect(testScene.background).toBeNull();
    render(<SceneBackground />);
    expect(testScene.background).toBeNull();
  });
});
