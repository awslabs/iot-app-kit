/* eslint-disable */
jest.mock('../src/layouts/scene-layout', () => ({
  SceneLayout: 'SceneLayout',
}));

import * as React from 'react';
import renderer, { act } from 'react-test-renderer';
import str2ab from 'string-to-arraybuffer';

import { COMPOSER_FEATURES } from '../src';
import { setFeatureConfig } from '../src/common/GlobalSettings';
import StateManager from '../src/components/StateManager';
import { useStore } from '../src/store';
/* eslint-enable */

describe('StateManager', () => {
  const baseState = {
    loadScene: jest.fn(),
    getMessages: jest.fn().mockReturnValue(['messagge']),
  };
  const mockSceneContent = 'This is test content';
  const mockGetSceneObjectFunction = jest.fn();
  const mockSceneLoader = {
    getSceneUri: () => Promise.resolve('https://test.url'),
    getSceneUrl: () => Promise.resolve('https://test.url'),
    getSceneObject: mockGetSceneObjectFunction,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    setFeatureConfig({});

    const mockArrayBuffer = str2ab(mockSceneContent);
    mockGetSceneObjectFunction.mockImplementation(() => Promise.resolve(mockArrayBuffer));
  });

  it('should render correctly', async () => {
    useStore('default').setState(baseState);

    let container;
    act(() => {
      container = renderer.create(
        <StateManager
          sceneLoader={mockSceneLoader}
          config={{ dracoDecoder: true } as any}
          dataInput={'Test Data' as any}
          onSceneUpdated={jest.fn()}
        />,
      );
    });

    // Wait for async call
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(container).toMatchSnapshot();

    expect(baseState.loadScene).toBeCalledWith(mockSceneContent, { disableMotionIndicator: true });
  });

  it('should load scene with motion indicator enabled when feature is on', async () => {
    setFeatureConfig({ [COMPOSER_FEATURES.MOTION_INDICATOR]: true });

    useStore('default').setState(baseState);
    let container;
    act(() => {
      container = renderer.create(
        <StateManager
          sceneLoader={mockSceneLoader}
          config={{ dracoDecoder: true } as any}
          dataInput={'Test Data' as any}
          onSceneUpdated={jest.fn()}
        />,
      );
    });

    // Wait for async call
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(container).toMatchSnapshot();

    expect(baseState.loadScene).toBeCalledWith(mockSceneContent, { disableMotionIndicator: false });
  });
});
