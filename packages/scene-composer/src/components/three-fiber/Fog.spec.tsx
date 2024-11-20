import { render } from '@/tests/testing-library';
import { MockedFunction } from 'vitest';
import * as THREE from 'three';
// import { useThree } from '@react-three/fiber';
import * as reactThree from '@react-three/fiber';

import { accessStore } from '../../../src/store';
import { type IFogSettings } from '../../interfaces';

import Fog from './Fog';

const getScenePropertyMock = vi.fn();
const baseState = {
  getSceneProperty: getScenePropertyMock,
};

describe('Fog', () => {
  const setup = () => {
    vi.resetAllMocks();

    accessStore('default').setState(baseState);
  };

  beforeEach(() => {
    setup();
  });

  it(`should add fog to the scene`, () => {
    const testScene = new THREE.Scene();
    vi.spyOn(reactThree, 'useThree').mockImplementation((s) => {
      if (s) {
        return s({ scene: testScene } as reactThree.RootState);
      }
    });

    const fogSetting: IFogSettings = {
      color: '#cccccc',
      near: 2,
      far: 20,
    };
    getScenePropertyMock.mockReturnValue(fogSetting);

    expect(testScene.fog).toBeNull();
    render(<Fog />);
    const fog = testScene.fog as THREE.Fog;

    expect(fog.color.getHexString()).toEqual(fogSetting.color.replace('#', ''));
    expect(fog.near).toEqual(fogSetting.near);
    expect(fog.far).toEqual(fogSetting.far);
  });

  it(`should not add fog to the scene`, () => {
    const testScene = new THREE.Scene();
    vi.spyOn(reactThree, 'useThree').mockImplementation((s) => {
      if (s) {
        return s({ scene: testScene } as reactThree.RootState);
      }
    });

    getScenePropertyMock.mockReturnValue(undefined);

    expect(testScene.fog).toBeNull();
    render(<Fog />);
    expect(testScene.fog).toBeNull();
  });
});
