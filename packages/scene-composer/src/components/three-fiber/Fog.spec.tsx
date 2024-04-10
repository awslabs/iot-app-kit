import { render } from '@testing-library/react';
import * as THREE from 'three';
jest.doMock('@react-three/fiber', () => ({
  useThree: jest.fn(),
}));
const setScenePropertyMock = jest.fn();
const getScenePropertyMock = jest.fn();
const baseState = {
  getSceneProperty: getScenePropertyMock,
  setSceneProperty: setScenePropertyMock,
};
import { useThree } from '@react-three/fiber';
import React from 'react';

import { useStore } from '../../../src/store';
import {
  DEFAULT_FOG_COLOR,
  DEFAULT_FOG_NEAR,
  DEFAULT_FOG_FAR,
  IFogSettings,
  KnownSceneProperty,
} from '../../interfaces';

import Fog from './Fog';

import Mock = jest.Mock;

describe('Fog', () => {
  const setup = () => {
    jest.resetAllMocks();

    useStore('default').setState(baseState);
  };

  beforeEach(() => {
    setup();
  });

  it(`should add fog to the scene`, () => {
    const testScene = new THREE.Scene();
    const mockThreeStates = {
      scene: testScene,
    };
    const useThreeMock = useThree as Mock;
    useThreeMock.mockImplementation((s) => {
      return s(mockThreeStates);
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
    const mockThreeStates = {
      scene: testScene,
    };
    const useThreeMock = useThree as Mock;
    useThreeMock.mockImplementation((s) => {
      return s(mockThreeStates);
    });

    getScenePropertyMock.mockReturnValue(undefined);

    expect(testScene.fog).toBeNull();
    render(<Fog />);
    expect(testScene.fog).toBeNull();
  });

  it(`should fix invalid values back to default`, () => {
    const testScene = new THREE.Scene();
    const mockThreeStates = {
      scene: testScene,
    };
    const useThreeMock = useThree as Mock;
    useThreeMock.mockImplementation((s) => {
      return s(mockThreeStates);
    });

    const fogSetting: IFogSettings = {
      color: 'NotHex',
      near: -1,
      far: -1,
    };
    getScenePropertyMock.mockReturnValue(fogSetting);

    render(<Fog />);
    expect(setScenePropertyMock).toBeCalledTimes(1);
    expect(setScenePropertyMock).toBeCalledWith(KnownSceneProperty.FogSettings, {
      color: DEFAULT_FOG_COLOR,
      near: DEFAULT_FOG_NEAR,
      far: DEFAULT_FOG_FAR,
    });
  });
});
