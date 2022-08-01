/* eslint-disable */
jest.mock('../src/layouts/scene-layout', () => ({
  SceneLayout: 'SceneLayout',
}));

import * as React from 'react';
import renderer, { act } from 'react-test-renderer';
import str2ab from 'string-to-arraybuffer';

import StateManager from '../src/components/StateManager';
import ErrorBoundary from '../src/logger/react-logger/components/error-boundary';
import { useStore } from '../src/store';
import DefaultErrorFallback from '../src/components/DefaultErrorFallback';
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

    const mockArrayBuffer = str2ab(mockSceneContent);
    mockGetSceneObjectFunction.mockImplementation(() => Promise.resolve(mockArrayBuffer));
  });

  it('should render correctly', async () => {
    useStore('default').setState(baseState);

    let container;
    await act(async () => {
      container = renderer.create(
        <StateManager
          sceneLoader={mockSceneLoader}
          config={{ dracoDecoder: true } as any}
          dataInput={'Test Data' as any}
          onSceneUpdated={jest.fn()}
        />,
      );
      // Wait for async call
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    expect(container).toMatchSnapshot();

    expect(baseState.loadScene).toBeCalledWith(mockSceneContent, { disableMotionIndicator: false });
  });

  it('should render with empty scene url error', async () => {
    useStore('default').setState(baseState);
    const loader = {
      ...mockSceneLoader,
      getSceneUri: () => Promise.resolve(null),
    };
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    let container;
    await act(async () => {
      container = renderer.create(
        <ErrorBoundary ErrorView={DefaultErrorFallback}>
          <StateManager
            sceneLoader={loader}
            config={{ dracoDecoder: true } as any}
            dataInput={'Test Data' as any}
            onSceneUpdated={jest.fn()}
          />
        </ErrorBoundary>,
      );
      // Wait for async call
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    expect(container).toMatchSnapshot();
    expect(console.error).toBeCalledTimes(2);
    errorSpy.mockRestore();
  });

  it('should render with get scene uri error', async () => {
    useStore('default').setState(baseState);
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const loader = {
      ...mockSceneLoader,
      getSceneUri: () => Promise.reject(new Error('get scene uri error')),
    };

    let container;
    await act(async () => {
      container = renderer.create(
        <ErrorBoundary ErrorView={DefaultErrorFallback}>
          <StateManager
            sceneLoader={loader}
            config={{ dracoDecoder: true } as any}
            dataInput={'Test Data' as any}
            onSceneUpdated={jest.fn()}
          />
        </ErrorBoundary>,
      );
      // Wait for async call
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    expect(container).toMatchSnapshot();
    expect(console.error).toBeCalledTimes(2);
    errorSpy.mockRestore();
  });

  it('should render with Failed to fetch scene content', async () => {
    useStore('default').setState(baseState);
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const loader = {
      ...mockSceneLoader,
      getSceneObject: () => null,
    };

    let container;
    await act(async () => {
      container = renderer.create(
        <ErrorBoundary ErrorView={DefaultErrorFallback}>
          <StateManager
            sceneLoader={loader}
            config={{ dracoDecoder: true } as any}
            dataInput={'Test Data' as any}
            onSceneUpdated={jest.fn()}
          />
        </ErrorBoundary>,
      );
      // Wait for async call
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    expect(container).toMatchSnapshot();
    expect(console.error).toBeCalledTimes(2);
    errorSpy.mockRestore();
  });

  it('should render with fetch scene content API error', async () => {
    useStore('default').setState(baseState);
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const loader = {
      ...mockSceneLoader,
      getSceneObject: () => Promise.reject(new Error('Random error')),
    };

    let container;
    await act(async () => {
      container = renderer.create(
        <ErrorBoundary ErrorView={DefaultErrorFallback}>
          <StateManager
            sceneLoader={loader}
            config={{ dracoDecoder: true } as any}
            dataInput={'Test Data' as any}
            onSceneUpdated={jest.fn()}
          />
        </ErrorBoundary>,
      );
      // Wait for async call
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    expect(container).toMatchSnapshot();
    expect(console.error).toBeCalledTimes(2);
    errorSpy.mockRestore();
  });
});
