import { render } from '@testing-library/react';
import * as THREE from 'three';
jest.doMock('@react-three/fiber', () => ({
  useThree: jest.fn(),
}));
const getScenePropertyMock = jest.fn();
const baseState = {
  getSceneProperty: getScenePropertyMock,
};
import { useThree } from '@react-three/fiber';
import React from 'react';

import { accessStore } from '../../../src/store';
import { IFogSettings } from '../../interfaces';

import Fog from './Fog';

import Mock = jest.Mock;

describe('Fog', () => {
  const setup = () => {
    jest.resetAllMocks();

    accessStore('default').setState(baseState);
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
});
