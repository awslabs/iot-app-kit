/* eslint-disable */
jest.mock('../src/layouts/SceneLayout', () => ({
  SceneLayout: 'SceneLayout',
}));

const mockCombinedPrvider = {
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
}
jest.doMock('@iot-app-kit/core', () => {
  const actual = jest.requireActual('@iot-app-kit/core');
  return {
    ...actual,
    combineProviders: jest.fn().mockReturnValue(mockCombinedPrvider)
  }
})

import * as React from 'react';
import renderer, { act } from 'react-test-renderer';
import str2ab from 'string-to-arraybuffer';

import StateManager from '../src/components/StateManager';
import ErrorBoundary from '../src/logger/react-logger/components/error-boundary';
import { useStore } from '../src/store';
import DefaultErrorFallback from '../src/components/DefaultErrorFallback';
import { numberStream, stringStream, viewport } from './data/mockDataStreams';
import { DataStream } from '@iot-app-kit/core';
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
  const mockDataStreams: DataStream[] = [numberStream, stringStream];

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
          viewport={viewport}
          sceneLoader={mockSceneLoader}
          config={{ dracoDecoder: true } as any}
          dataStreams={mockDataStreams}
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
            viewport={viewport}
            sceneLoader={loader}
            config={{ dracoDecoder: true } as any}
            dataStreams={mockDataStreams}
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
            viewport={viewport}
            sceneLoader={loader}
            config={{ dracoDecoder: true } as any}
            dataStreams={mockDataStreams}
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
            viewport={viewport}
            sceneLoader={loader}
            config={{ dracoDecoder: true } as any}
            dataStreams={mockDataStreams}
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
            viewport={viewport}
            sceneLoader={loader}
            config={{ dracoDecoder: true } as any}
            dataStreams={mockDataStreams}
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

  it("should subscribe to query's provider succcessfully", async () => {
    useStore('default').setState(baseState);
    const mockBuild = jest.fn();

    let container;
    await act(async () => {
      container = renderer.create(
        <StateManager
          viewport={viewport}
          sceneLoader={mockSceneLoader}
          config={{ dracoDecoder: true } as any}
          queries={[{ build: mockBuild }, { build: mockBuild }]}
          onSceneUpdated={jest.fn()}
        />,
      );
      // Wait for async call
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    expect(mockBuild).toBeCalledTimes(2);
    expect(mockCombinedPrvider.subscribe).toBeCalledTimes(1);
    expect(mockCombinedPrvider.unsubscribe).not.toBeCalled();

    // unsubscribe before subscribe when queries updated
    await act(async () => {
      container.update(
        <StateManager
          viewport={viewport}
          sceneLoader={mockSceneLoader}
          config={{ dracoDecoder: true } as any}
          queries={[{ build: mockBuild }]}
          onSceneUpdated={jest.fn()}
        />,
      );
      // Wait for async call
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    expect(mockBuild).toBeCalledTimes(3);
    expect(mockCombinedPrvider.subscribe).toBeCalledTimes(2);
    expect(mockCombinedPrvider.unsubscribe).toBeCalledTimes(1);
  });
});
