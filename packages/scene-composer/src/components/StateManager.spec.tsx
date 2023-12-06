/* eslint-disable */
jest.mock('../layouts/SceneLayout', () => ({
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
import { act, create } from 'react-test-renderer';
import str2ab from 'string-to-arraybuffer';
import flushPromises from 'flush-promises';

import StateManager from './StateManager';
import ErrorBoundary from '../logger/react-logger/components/error-boundary';
import { ICameraComponentInternal, useStore } from '../store';
import DefaultErrorFallback from './DefaultErrorFallback';
import { numberStream, stringStream, viewport } from '../../tests/data/mockDataStreams';
import { DataStream } from '@iot-app-kit/core';
import useActiveCamera from '../hooks/useActiveCamera';
import { COMPOSER_FEATURES, KnownComponentType, SceneComposerInternalConfig, setMatterportSdk } from '..';
import * as THREE from 'three';
import { SCENE_CAPABILITY_MATTERPORT } from '../common/constants';
import { TwinMakerSceneMetadataModule } from '@iot-app-kit/source-iottwinmaker';
import { MpSdk } from '@matterport/webcomponent';

jest.mock('../hooks/useActiveCamera', () => {
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
  const setViewportMock = jest.fn();
  const setDataBindingQueryRefreshRateMock = jest.fn();
  const setAutoQueryEnabledMock = jest.fn();
  const createState = (connectionName: string) => ({
    ...baseState,
    noHistoryStates: {
      ...useStore('default').getState().noHistoryStates,
      connectionNameForMatterportViewer: connectionName,
      setConnectionNameForMatterportViewer: jest.fn(),
      setViewport: setViewportMock,
      setDataBindingQueryRefreshRate: setDataBindingQueryRefreshRateMock,
      setAutoQueryEnabled: setAutoQueryEnabledMock,
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
  } as unknown as TwinMakerSceneMetadataModule;
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
      container = create(
        <StateManager
          viewport={viewport}
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          dataStreams={mockDataStreams}
          onSceneUpdated={jest.fn()}
        />,
      );
      await flushPromises();
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
      container = create(
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
      await flushPromises();
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
      container = create(
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
      await flushPromises();
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
      container = create(
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
      await flushPromises();
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
      container = create(
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
      await flushPromises();
    });

    expect(container).toMatchSnapshot();
    expect(console.error).toBeCalledTimes(2);
    errorSpy.mockRestore();
  });

  it('should render correctly with Matterport configuration', async () => {
    useStore('default').setState({
      ...createState('mockConnectionName'),
      getSceneProperty: jest.fn().mockReturnValue('mockMatterportModelId'),
    });
    getSceneInfo.mockResolvedValue({
      generatedSceneMetadata: {
        MATTERPORT_ACCESS_TOKEN: 'mockAccessToken',
        MATTERPORT_APPLICATION_KEY: 'mockApplicationKey',
      },
    });

    let container;
    await act(async () => {
      container = create(
        <StateManager
          viewport={viewport}
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          dataStreams={mockDataStreams}
          onSceneUpdated={jest.fn()}
        />,
      );
      await flushPromises();
    });

    expect(container).toMatchSnapshot();
  });

  it('should render correctly with error in Matterport configuration', async () => {
    useStore('default').setState({
      ...createState('mockConnectionName'),
      getSceneProperty: jest.fn().mockReturnValue('mockMatterportModelId'),
    });
    getSceneInfo.mockResolvedValue({ error: { message: 'Client id and secret not valid' } });

    let container;
    await act(async () => {
      container = create(
        <StateManager
          viewport={viewport}
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          dataStreams={mockDataStreams}
          onSceneUpdated={jest.fn()}
        />,
      );
      await flushPromises();
    });

    expect(container).toMatchSnapshot();
  });

  it("should subscribe to query's provider succcessfully", async () => {
    useStore('default').setState(baseState);
    const mockBuild = jest.fn();

    let container;
    await act(async () => {
      container = create(
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
      await flushPromises();
    });

    expect(mockBuild).toBeCalledTimes(2);
    expect(mockBuild).toHaveBeenNthCalledWith(2, 'default', {
      viewport,
      settings: { refreshRate: undefined, fetchFromStartToEnd: true },
    });
    expect(mockCombinedPrvider.subscribe).toBeCalledTimes(1);
    expect(mockCombinedPrvider.unsubscribe).not.toBeCalled();

    // unsubscribe before subscribe when queries updated
    await act(async () => {
      container.update(
        <StateManager
          viewport={{ duration: '5m' }}
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          queries={[{ build: mockBuild, toQueryString: () => 'mockQueryString' }]}
          onSceneUpdated={jest.fn()}
        />,
      );
      await flushPromises();
    });

    expect(mockBuild).toBeCalledTimes(3);
    expect(mockBuild).toHaveBeenNthCalledWith(3, 'default', {
      viewport: { duration: '5m' },
      settings: { refreshRate: 5000, fetchFromStartToEnd: true },
    });
    expect(mockCombinedPrvider.subscribe).toBeCalledTimes(2);
    expect(mockCombinedPrvider.unsubscribe).toBeCalledTimes(1);

    // unsubscribe after unmount
    await act(async () => {
      container.unmount(
        <StateManager
          viewport={{ duration: '5m' }}
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          queries={[{ build: mockBuild, toQueryString: () => 'mockQueryString' }]}
          onSceneUpdated={jest.fn()}
        />,
      );
      await flushPromises();
    });

    expect(mockBuild).toBeCalledTimes(3);
    expect(mockCombinedPrvider.subscribe).toBeCalledTimes(2);
    expect(mockCombinedPrvider.unsubscribe).toBeCalledTimes(2);
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
      create(
        <StateManager
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          onSceneUpdated={jest.fn()}
        />,
      );
      await flushPromises();
    });
    expect(useActiveCamera().setActiveCameraSettings).toHaveBeenCalled();
  });

  it('should call setActiveCameraName if activeCamera is set', async () => {
    useStore('default').setState({
      ...baseState,
    });

    await act(async () => {
      create(
        <StateManager
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          onSceneUpdated={jest.fn()}
          activeCamera='Camera1'
        />,
      );
      await flushPromises();
    });
    expect(useActiveCamera().setActiveCameraName).toHaveBeenCalledWith('Camera1');
  });

  it('should not call setActiveCameraName if activeCamera is set and selectedDataBinding is set', async () => {
    useStore('default').setState({
      ...baseState,
    });

    await act(async () => {
      create(
        <StateManager
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          onSceneUpdated={jest.fn()}
          selectedDataBinding={{ entityId: 'entity' }}
          activeCamera='Camera1'
        />,
      );
      await flushPromises();
    });
    expect(useActiveCamera().setActiveCameraName).not.toBeCalled();
  });

  it('should call onSceneLoaded', async () => {
    useStore('default').setState({
      ...baseState,
    });
    const onSceneLoaded = jest.fn();
    jest.useFakeTimers();

    let container;
    await act(async () => {
      container = create(
        <StateManager
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          onSceneLoaded={onSceneLoaded}
        />,
      );
      await flushPromises();

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
      await flushPromises();
      jest.advanceTimersByTime(1);
    });

    expect(onSceneLoaded).toBeCalledTimes(1);
  });

  it('should call onSceneLoaded for matterport scene', async () => {
    useStore('default').setState({
      ...createState('mockConnectionName'),
      sceneLoaded: true,
      getSceneProperty: jest.fn().mockReturnValue('mockMatterportModelId'),
    });
    getSceneInfo.mockResolvedValue({
      generatedSceneMetadata: {
        MATTERPORT_ACCESS_TOKEN: 'mockAccessToken',
        MATTERPORT_APPLICATION_KEY: 'mockApplicationKey',
      },
    });
    jest.useFakeTimers();

    const onSceneLoaded = jest.fn();

    let container;
    await act(async () => {
      container = create(
        <StateManager
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          onSceneLoaded={onSceneLoaded}
        />,
      );
      await flushPromises();
    });

    expect(onSceneLoaded).not.toBeCalled();

    await act(async () => {
      setMatterportSdk('default', {} as MpSdk);

      container.update(
        <StateManager
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          onSceneLoaded={onSceneLoaded}
        />,
      );
      await flushPromises();
      jest.advanceTimersByTime(1);
    });

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
      container = create(
        <StateManager
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          onSelectionChanged={onSelectionChanged}
        />,
      );
      await flushPromises();
    });
    expect(onSelectionChanged).not.toBeCalled();

    await act(async () => {
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
      await flushPromises();
    });

    expect(onSelectionChanged).toBeCalledTimes(1);

    await act(async () => {
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
      await flushPromises();
    });

    expect(onSelectionChanged).toBeCalledTimes(1);
  });

  it('should call setViewport when changed', async () => {
    useStore('default').setState(createState('random'));
    const viewport = { duration: '5m' };

    let container;
    await act(async () => {
      container = create(
        <StateManager
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          onSceneUpdated={jest.fn()}
          viewport={viewport}
        />,
      );
      await flushPromises();
    });
    expect(setViewportMock).toBeCalledTimes(1);
    expect(setViewportMock).toBeCalledWith(viewport);

    // setViewport with undefined
    await act(async () => {
      container.update(
        <StateManager
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          onSceneUpdated={jest.fn()}
          viewport={undefined}
        />,
      );
      await flushPromises();
    });
    expect(setViewportMock).toBeCalledTimes(2);
    expect(setViewportMock).toBeCalledWith(undefined);
  });

  it('should call setDataBindingQueryRefreshRate when changed', async () => {
    useStore('default').setState(createState('random'));
    let container;
    await act(async () => {
      container = create(
        <StateManager
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={{ dataBindingQueryRefreshRate: 6666 }}
          onSceneUpdated={jest.fn()}
          viewport={viewport}
        />,
      );
      await flushPromises();
    });
    expect(setDataBindingQueryRefreshRateMock).toBeCalledTimes(1);
    expect(setDataBindingQueryRefreshRateMock).toBeCalledWith(6666);

    // setDataBindingQueryRefreshRate with undefined
    await act(async () => {
      container.update(
        <StateManager
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          onSceneUpdated={jest.fn()}
          viewport={undefined}
        />,
      );
      await flushPromises();
    });
    expect(setDataBindingQueryRefreshRateMock).toBeCalledTimes(2);
    expect(setDataBindingQueryRefreshRateMock).toBeCalledWith(undefined);
  });

  it('should call setAutoQueryEnabled with true', async () => {
    useStore('default').setState(createState('random'));

    await act(async () => {
      create(
        <StateManager
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={{ mode: 'Viewing', featureConfig: { [COMPOSER_FEATURES.AutoQuery]: true } }}
          onSceneUpdated={jest.fn()}
        />,
      );
      await flushPromises();
    });
    expect(setAutoQueryEnabledMock).toBeCalledTimes(1);
    expect(setAutoQueryEnabledMock).toBeCalledWith(true);
    expect(setAutoQueryEnabledMock).not.toBeCalledWith(false);
  });

  it('should call setAutoQueryEnabled with false when feature is off', async () => {
    useStore('default').setState(createState('random'));

    await act(async () => {
      create(
        <StateManager
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={{ mode: 'Viewing', featureConfig: { [COMPOSER_FEATURES.AutoQuery]: false } }}
          onSceneUpdated={jest.fn()}
        />,
      );
      await flushPromises();
    });
    expect(setAutoQueryEnabledMock).toBeCalledTimes(1);
    expect(setAutoQueryEnabledMock).toBeCalledWith(false);
    expect(setAutoQueryEnabledMock).not.toBeCalledWith(true);
  });

  it('should call setAutoQueryEnabled with false when mode is Editing', async () => {
    useStore('default').setState(createState('random'));

    await act(async () => {
      create(
        <StateManager
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={{ mode: 'Editing', featureConfig: { [COMPOSER_FEATURES.AutoQuery]: true } }}
          onSceneUpdated={jest.fn()}
        />,
      );
      await flushPromises();
    });
    expect(setAutoQueryEnabledMock).toBeCalledTimes(1);
    expect(setAutoQueryEnabledMock).toBeCalledWith(false);
    expect(setAutoQueryEnabledMock).not.toBeCalledWith(true);
  });

  it('should call setAutoQueryEnabled with false when queries are passed in', async () => {
    useStore('default').setState(createState('random'));

    await act(async () => {
      create(
        <StateManager
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={{ mode: 'Viewing', featureConfig: { [COMPOSER_FEATURES.AutoQuery]: true } }}
          onSceneUpdated={jest.fn()}
          queries={[]}
        />,
      );
      await flushPromises();
    });
    expect(setAutoQueryEnabledMock).toBeCalledTimes(1);
    expect(setAutoQueryEnabledMock).toBeCalledWith(false);
    expect(setAutoQueryEnabledMock).not.toBeCalledWith(true);
  });

  it('should call setAutoQueryEnabled with false when dataStreams are passed in', async () => {
    useStore('default').setState(createState('random'));

    await act(async () => {
      create(
        <StateManager
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={{ mode: 'Viewing', featureConfig: { [COMPOSER_FEATURES.AutoQuery]: true } }}
          onSceneUpdated={jest.fn()}
          dataStreams={[]}
        />,
      );
      await flushPromises();
    });
    expect(setAutoQueryEnabledMock).toBeCalledWith(false);
    expect(setAutoQueryEnabledMock).not.toBeCalledWith(true);
  });
});
