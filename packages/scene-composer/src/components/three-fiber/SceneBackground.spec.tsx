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

import { useStore } from '../../../src/store';
import { ISceneBackgroundSetting } from '../../interfaces';

import SceneBackground from './SceneBackground';

import Mock = jest.Mock;

describe('SceneBackground', () => {
  const setup = () => {
    jest.resetAllMocks();

    useStore('default').setState(baseState);
  };

  beforeEach(() => {
    setup();
  });

  it(`should add background color to the scene`, () => {
    const testScene = new THREE.Scene();
    const mockThreeStates = {
      scene: testScene,
    };
    const useThreeMock = useThree as Mock;
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

  it(`should not add background to the scene`, () => {
    const testScene = new THREE.Scene();
    const mockThreeStates = {
      scene: testScene,
    };
    const useThreeMock = useThree as Mock;
    useThreeMock.mockImplementation((s) => {
      return s(mockThreeStates);
    });

    getScenePropertyMock.mockReturnValue(undefined);

    expect(testScene.background).toBeNull();
    render(<SceneBackground />);
    expect(testScene.background).toBeNull();
  });
});
