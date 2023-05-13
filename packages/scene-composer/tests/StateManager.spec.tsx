/* eslint-disable */
jest.mock('../src/layouts/SceneLayout', () => ({
  SceneLayout: 'SceneLayout',
}));

const mockCombinedPrvider = {
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
};
jest.doMock('@iot-app-kit/core', () => {
  const actual = jest.requireActual('@iot-app-kit/core');
  return {
    ...actual,
    combineProviders: jest.fn().mockReturnValue(mockCombinedPrvider),
  };
});

import * as React from 'react';
import renderer, { act } from 'react-test-renderer';
import str2ab from 'string-to-arraybuffer';

import StateManager from '../src/components/StateManager';
import ErrorBoundary from '../src/logger/react-logger/components/error-boundary';
import { ICameraComponentInternal, useStore, useViewOptionState } from '../src/store';
import { createViewOptionStateSlice, IViewOptionStateSlice } from '../src/store/slices/ViewOptionStateSlice';
import DefaultErrorFallback from '../src/components/DefaultErrorFallback';
import { numberStream, stringStream, viewport } from './data/mockDataStreams';
import { DataStream } from '@iot-app-kit/core';
import useActiveCamera from '../src/hooks/useActiveCamera';
import { KnownComponentType, SceneComposerInternalConfig } from '../src';
import * as THREE from 'three';
import { SCENE_CAPABILITY_MATTERPORT } from '../src/common/constants';

jest.mock('../src/hooks/useActiveCamera', () => {
  return jest.fn().mockReturnValue({
    activeCameraSettings: {
      cameraType: 'Perspective',
      fov: 100,
      far: 50,
      near: 0.2,
      transform: {
        position: [5, 5, 5],
      },
    },
    setActiveCameraSettings: jest.fn(),
    setActiveCameraName: jest.fn(),
  });
});
/* eslint-enable */

describe('StateManager', () => {
  const object3D = new THREE.Object3D();
  object3D.position.set(5, 5, 5);
  object3D.rotation.set(0, 0, 0);
  object3D.scale.set(1, 1, 1);
  const getObject3DBySceneNodeRef = jest.fn().mockReturnValue(object3D);
  const baseState = {
    loadScene: jest.fn(),
    getMessages: jest.fn().mockReturnValue(['messagge']),
    getObject3DBySceneNodeRef,
    selectedSceneNodeRef: undefined,
    sceneLoaded: false,
    getSceneProperty: jest.fn(),
  };
  const createState = (connectionName: string) => ({
    ...baseState,
    noHistoryStates: {
      ...useStore('default').getState().noHistoryStates,
      connectionNameForMatterportViewer: connectionName,
      setConnectionNameForMatterportViewer: jest.fn(),
    },
  });
  const sceneConfig: SceneComposerInternalConfig = { dracoDecoder: { enable: true } };
  const mockSceneContent = 'This is test content';
  const mockGetSceneObjectFunction = jest.fn();
  const mockSceneLoader = {
    getSceneUri: () => Promise.resolve('https://test.url'),
    getSceneUrl: () => Promise.resolve('https://test.url'),
    getSceneObject: mockGetSceneObjectFunction,
  };
  const MOCK_ARN = 'mockARN';
  const getSceneInfo = jest.fn();
  const updateSceneInfo = jest.fn();
  const get3pConnectionList = jest.fn();
  const mockSceneMetadataModule = {
    getSceneInfo,
    updateSceneInfo,
    get3pConnectionList,
  };
  const mockDataStreams: DataStream[] = [numberStream, stringStream];

  beforeEach(() => {
    jest.clearAllMocks();

    const mockArrayBuffer = str2ab(mockSceneContent);
    mockGetSceneObjectFunction.mockImplementation(() => Promise.resolve(mockArrayBuffer));
    getSceneInfo.mockResolvedValue({
      capabilities: [SCENE_CAPABILITY_MATTERPORT],
      sceneMetadata: { MATTERPORT_SECRET_ARN: MOCK_ARN },
    });
  });

  it('should render correctly', async () => {
    useStore('default').setState(baseState);

    let container;
    await act(async () => {
      container = renderer.create(
        <StateManager
          viewport={viewport}
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
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
            config={sceneConfig}
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
            config={sceneConfig}
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
            config={sceneConfig}
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
            config={sceneConfig}
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

  it('should render correctly with Matterport configuration', async () => {
    useStore('default').setState(createState('mockConnectionName'));
    baseState.getSceneProperty.mockReturnValue('mockMatterportModelId');
    getSceneInfo.mockResolvedValue({
      generatedSceneMetadata: {
        MATTERPORT_ACCESS_TOKEN: 'mockAccessToken',
        MATTERPORT_APPLICATION_KEY: 'mockApplicationKey',
      },
    });

    let container;
    await act(async () => {
      container = renderer.create(
        <StateManager
          viewport={viewport}
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          dataStreams={mockDataStreams}
          onSceneUpdated={jest.fn()}
        />,
      );
      // Wait for async call
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    expect(container).toMatchSnapshot();
  });

  it('should render correctly with error in Matterport configuration', async () => {
    useStore('default').setState(createState('mockConnectionName'));
    getSceneInfo.mockResolvedValue({ error: { message: 'Client id and secret not valid' } });

    let container;
    await act(async () => {
      container = renderer.create(
        <StateManager
          viewport={viewport}
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          dataStreams={mockDataStreams}
          onSceneUpdated={jest.fn()}
        />,
      );
      // Wait for async call
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    expect(container).toMatchSnapshot();
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
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          queries={[
            { build: mockBuild, toQueryString: () => 'mockQueryString' },
            { build: mockBuild, toQueryString: () => 'mockQueryString' },
          ]}
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
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          queries={[{ build: mockBuild, toQueryString: () => 'mockQueryString' }]}
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

  it('should call setActiveCameraSettings if selected node has camera component', async () => {
    const component = {
      type: KnownComponentType.Camera,
      ref: 'testCamera',
      fov: 60,
      near: 0,
      far: 100,
      zoom: 1,
      cameraType: 'Perspective',
    } as ICameraComponentInternal;

    const testNode = {
      ref: 'testRef',
      components: [component],
    };

    useStore('default').setState({
      ...baseState,
      selectedSceneNodeRef: 'testRef',
      getSceneNodeByRef: jest.fn().mockReturnValue(testNode),
    });

    await act(async () => {
      renderer.create(
        <StateManager
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          dataInput={'Test Data' as any}
          onSceneUpdated={jest.fn()}
        />,
      );
      // Wait for async call
      await new Promise((resolve) => setTimeout(resolve, 10));
    });
    expect(useActiveCamera().setActiveCameraSettings).toHaveBeenCalled();
  });

  it('should call setActiveCameraName if activeCamera is set', async () => {
    useStore('default').setState({
      ...baseState,
    });

    await act(async () => {
      renderer.create(
        <StateManager
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          dataInput={'Test Data' as any}
          onSceneUpdated={jest.fn()}
          activeCamera='Camera1'
        />,
      );
      // Wait for async call
      await new Promise((resolve) => setTimeout(resolve, 10));
    });
    expect(useActiveCamera().setActiveCameraName).toHaveBeenCalledWith('Camera1');
  });

  it('should not call setActiveCameraName if activeCamera is set and selectedDataBinding is set', async () => {
    useStore('default').setState({
      ...baseState,
    });

    await act(async () => {
      renderer.create(
        <StateManager
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          dataInput={'Test Data' as any}
          onSceneUpdated={jest.fn()}
          selectedDataBinding={{}}
          activeCamera='Camera1'
        />,
      );
      // Wait for async call
      await new Promise((resolve) => setTimeout(resolve, 10));
    });
    expect(useActiveCamera().setActiveCameraName).not.toBeCalled();
  });

  it('should call onSceneLoaded', async () => {
    useStore('default').setState({
      ...baseState,
    });
    const onSceneLoaded = jest.fn();

    let container;
    await act(async () => {
      container = renderer.create(
        <StateManager
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          onSceneLoaded={onSceneLoaded}
        />,
      );
    });

    useStore('default').setState({
      ...baseState,
      sceneLoaded: true,
    });

    container.update(
      <StateManager
        sceneLoader={mockSceneLoader}
        sceneMetadataModule={mockSceneMetadataModule}
        config={sceneConfig}
        onSceneLoaded={onSceneLoaded}
      />,
    );
    await new Promise((resolve) => setTimeout(resolve, 1));

    expect(onSceneLoaded).toBeCalledTimes(1);
  });

  it('should call onSelectionChanged as expected', async () => {
    useStore('default').setState({
      ...baseState,
    });
    const onSelectionChanged = jest.fn();

    // not called when selection is not changed
    let container;
    await act(async () => {
      container = renderer.create(
        <StateManager
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          onSelectionChanged={onSelectionChanged}
        />,
      );
    });
    expect(onSelectionChanged).not.toBeCalled();

    // called when selection is changed
    useStore('default').setState({
      ...baseState,
      selectedSceneNodeRef: 'abc',
    });
    container.update(
      <StateManager
        sceneLoader={mockSceneLoader}
        sceneMetadataModule={mockSceneMetadataModule}
        config={sceneConfig}
        onSelectionChanged={onSelectionChanged}
      />,
    );
    expect(onSelectionChanged).toBeCalledTimes(1);

    // not called when selection is not changed
    useStore('default').setState({
      ...baseState,
      selectedSceneNodeRef: 'abc',
    });
    container.update(
      <StateManager
        sceneLoader={mockSceneLoader}
        sceneMetadataModule={mockSceneMetadataModule}
        config={sceneConfig}
        onSelectionChanged={onSelectionChanged}
      />,
    );
    expect(onSelectionChanged).toBeCalledTimes(1);
  });
});
