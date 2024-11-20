import { act, create } from 'react-test-renderer';
import str2ab from 'string-to-arraybuffer';
import flushPromises from 'flush-promises';
import StateManager from './StateManager';
import ErrorBoundary from '../logger/react-logger/components/error-boundary';
import { type ICameraComponentInternal, accessStore } from '../store';
import DefaultErrorFallback from './DefaultErrorFallback';
import { numberStream, stringStream, viewport } from '../../tests/data/mockDataStreams';
import type { DataStream } from '@iot-app-kit/core';
import useActiveCamera from '../hooks/useActiveCamera';
import { KnownComponentType } from '..';
import * as THREE from 'three';
import { MATTERPORT_ERROR } from '../common/constants';
import type { TwinMakerSceneMetadataModule } from '@iot-app-kit/source-iottwinmaker';
import type { MpSdk } from '@matterport/webcomponent';
import type { SceneComposerInternalConfig } from '../interfaces/sceneComposerInternal';
import { setMatterportSdk } from '../common/GlobalSettings';
import { SceneCapabilities, SceneMetadataMapKeys } from '../common/sceneModelConstants';
import { render } from '@/tests/testing-library';

/* eslint-disable */
vi.mock('../layouts/SceneLayout', () => ({
  SceneLayout: 'SceneLayout',
}));

const mockCombinedPrvider = {
  subscribe: vi.fn(),
  unsubscribe: vi.fn(),
};
vi.mock('@iot-app-kit/core', async () => {
  const actual = await vi.importActual('@iot-app-kit/core');
  return {
    ...actual,
    combineProviders: () => vi.fn(() => mockCombinedPrvider),
  };
});

const setActiveCameraSettings = vi.fn();
const setActiveCameraName = vi.fn();
vi.mock('../hooks/useActiveCamera', () => ({
  default: () => ({
    activeCameraSettings: {
      cameraType: 'Perspective',
      fov: 100,
      far: 50,
      near: 0.2,
      transform: {
        position: [5, 5, 5],
      },
    },
    setActiveCameraSettings: (...args: unknown[]) => setActiveCameraSettings(...args),
    setActiveCameraName: (...args: unknown[]) => setActiveCameraName(...args),
  }),
}));

vi.mock('../utils/entityModelUtils/sceneComponent');
/* eslint-enable */

describe('StateManager', () => {
  const object3D = new THREE.Object3D();
  object3D.position.set(5, 5, 5);
  object3D.rotation.set(0, 0, 0);
  object3D.scale.set(1, 1, 1);
  const getObject3DBySceneNodeRef = vi.fn().mockReturnValue(object3D);
  const baseState = {
    loadScene: vi.fn(),
    addMessages: vi.fn(),
    getObject3DBySceneNodeRef,
    selectedSceneNodeRef: undefined,
    sceneLoaded: false,
    getSceneProperty: vi.fn(),
  };
  const setViewportMock = vi.fn();
  const setDataBindingQueryRefreshRateMock = vi.fn();
  const setAutoQueryEnabledMock = vi.fn();
  const states = accessStore('default').getState().noHistoryStates;
  const createState = (connectionName: string) => ({
    ...baseState,
    noHistoryStates: {
      ...states,
      connectionNameForMatterportViewer: connectionName,
      setConnectionNameForMatterportViewer: vi.fn(),
      setViewport: setViewportMock,
      setDataBindingQueryRefreshRate: setDataBindingQueryRefreshRateMock,
      setAutoQueryEnabled: setAutoQueryEnabledMock,
    },
  });
  const sceneConfig: SceneComposerInternalConfig = { basisuDecoder: { enable: true }, dracoDecoder: { enable: true } };
  const mockSceneContent = 'This is test content';
  const mockGetSceneObjectFunction = vi.fn();
  const mockSceneLoader = {
    getSceneUri: vi.fn().mockResolvedValue('https://test.url'),
    getSceneObject: mockGetSceneObjectFunction,
  };
  const MOCK_ARN = 'mockARN';
  const getSceneInfo = vi.fn();
  const updateSceneInfo = vi.fn();
  const get3pConnectionList = vi.fn();
  const getSceneEntity = vi.fn();
  const mockSceneMetadataModule = {
    getSceneInfo,
    updateSceneInfo,
    get3pConnectionList,
    getSceneEntity,
  } as unknown as TwinMakerSceneMetadataModule;
  const mockDataStreams: DataStream[] = [numberStream, stringStream];

  beforeEach(() => {
    vi.clearAllMocks();

    const mockArrayBuffer = str2ab(mockSceneContent);
    mockGetSceneObjectFunction.mockImplementation(() => Promise.resolve(mockArrayBuffer));
    getSceneInfo.mockResolvedValue({
      capabilities: [SceneCapabilities.MATTERPORT],
      sceneMetadata: { [SceneMetadataMapKeys.MATTERPORT_SECRET_ARN]: MOCK_ARN },
    });
    getSceneEntity.mockResolvedValue({});
  });

  it('should render correctly', async () => {
    accessStore('default').setState(baseState);

    let container;
    await act(async () => {
      container = create(
        <StateManager
          viewport={viewport}
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          dataStreams={mockDataStreams}
          onSceneUpdated={vi.fn()}
        />,
      );
      await flushPromises();
    });

    expect(container).toMatchSnapshot();
    expect(mockSceneLoader.getSceneUri).toBeCalledTimes(1);
    expect(baseState.loadScene).toBeCalledWith(mockSceneContent, { disableMotionIndicator: false });
  });

  it('should render with empty scene url error', async () => {
    accessStore('default').setState(baseState);
    const loader = {
      ...mockSceneLoader,
      getSceneUri: () => Promise.resolve(null),
    };
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { container } = render(
      <ErrorBoundary ErrorView={DefaultErrorFallback}>
        <StateManager
          viewport={viewport}
          sceneLoader={loader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          dataStreams={mockDataStreams}
          onSceneUpdated={vi.fn()}
        />
      </ErrorBoundary>,
    );

    expect(container).toMatchSnapshot();
    expect(console.error).toBeCalledTimes(1);
    errorSpy.mockRestore();
  });

  it('should render with get scene uri error', async () => {
    accessStore('default').setState(baseState);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const loader = {
      ...mockSceneLoader,
      getSceneUri: () => Promise.reject(new Error('get scene uri error')),
    };

    const { container } = render(
      <ErrorBoundary ErrorView={DefaultErrorFallback}>
        <StateManager
          viewport={viewport}
          sceneLoader={loader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          dataStreams={mockDataStreams}
          onSceneUpdated={vi.fn()}
        />
      </ErrorBoundary>,
    );

    expect(container).toMatchSnapshot();
    expect(console.error).toBeCalledTimes(1);
    errorSpy.mockRestore();
  });

  it('should render with Failed to fetch scene content', async () => {
    accessStore('default').setState(baseState);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const loader = {
      ...mockSceneLoader,
      getSceneObject: () => null,
    };

    const { container } = render(
      <ErrorBoundary ErrorView={DefaultErrorFallback}>
        <StateManager
          viewport={viewport}
          sceneLoader={loader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          dataStreams={mockDataStreams}
          onSceneUpdated={vi.fn()}
        />
      </ErrorBoundary>,
    );

    expect(container).toMatchSnapshot();
    expect(console.error).toBeCalledTimes(1);
    errorSpy.mockRestore();
  });

  it('should render with fetch scene content API error', async () => {
    accessStore('default').setState(baseState);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const loader = {
      ...mockSceneLoader,
      getSceneObject: () => Promise.reject(new Error('Random error')),
    };

    const { container } = render(
      <ErrorBoundary ErrorView={DefaultErrorFallback}>
        <StateManager
          viewport={viewport}
          sceneLoader={loader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          dataStreams={mockDataStreams}
          onSceneUpdated={vi.fn()}
        />
      </ErrorBoundary>,
    );

    expect(container).toMatchSnapshot();
    expect(console.error).toBeCalledTimes(1);
    errorSpy.mockRestore();
  });

  it('should load dynamic scene correctly', async () => {
    accessStore('default').setState(baseState);
    getSceneInfo.mockResolvedValue({});

    const { container } = render(
      <ErrorBoundary ErrorView={DefaultErrorFallback}>
        <StateManager
          viewport={viewport}
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          dataStreams={mockDataStreams}
          onSceneUpdated={vi.fn()}
        />
      </ErrorBoundary>,
    );

    await flushPromises();
    await flushPromises();

    expect(container).toMatchSnapshot();
    expect(mockSceneLoader.getSceneUri).toBeCalled();
    expect(mockSceneMetadataModule.getSceneEntity).not.toBeCalled();
    expect(baseState.loadScene).toBeCalledTimes(1);
    expect(baseState.loadScene).toBeCalledWith(mockSceneContent, { disableMotionIndicator: false });
  });

  it('should load dynamic scene with error for empty document', async () => {
    accessStore('default').setState(baseState);
    getSceneInfo.mockResolvedValue({});

    let container;
    await act(async () => {
      container = create(
        <ErrorBoundary ErrorView={DefaultErrorFallback}>
          <StateManager
            viewport={viewport}
            sceneLoader={mockSceneLoader}
            sceneMetadataModule={mockSceneMetadataModule}
            config={sceneConfig}
            dataStreams={mockDataStreams}
            onSceneUpdated={vi.fn()}
          />
        </ErrorBoundary>,
      );
      await flushPromises();
    });

    expect(container).toMatchSnapshot();
    expect(mockSceneLoader.getSceneUri).toBeCalled();
    expect(mockSceneMetadataModule.getSceneEntity).not.toBeCalled();
    expect(baseState.loadScene).toBeCalled();
  });

  it('should load dynamic scene with error for getting scene entity failure', async () => {
    accessStore('default').setState(baseState);
    getSceneInfo.mockResolvedValue({});
    getSceneEntity.mockRejectedValue(new Error('get scene entity failure'));

    let container;
    await act(async () => {
      container = create(
        <ErrorBoundary ErrorView={DefaultErrorFallback}>
          <StateManager
            viewport={viewport}
            sceneLoader={mockSceneLoader}
            sceneMetadataModule={mockSceneMetadataModule}
            config={sceneConfig}
            dataStreams={mockDataStreams}
            onSceneUpdated={vi.fn()}
          />
        </ErrorBoundary>,
      );
      await flushPromises();
    });

    expect(container).toMatchSnapshot();
    expect(mockSceneLoader.getSceneUri).toBeCalled();
    expect(mockSceneMetadataModule.getSceneEntity).not.toBeCalled();
    expect(baseState.loadScene).toBeCalled();
  });

  it('should render correctly with Matterport configuration', async () => {
    accessStore('default').setState({
      ...createState('mockConnectionName'),
      getSceneProperty: vi.fn().mockReturnValue('mockMatterportModelId'),
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
          onSceneUpdated={vi.fn()}
        />,
      );
      await flushPromises();
    });

    expect(container).toMatchSnapshot();
  });

  it('should render correctly with error in Matterport configuration', async () => {
    accessStore('default').setState({
      ...createState('mockConnectionName'),
      getSceneProperty: vi.fn().mockReturnValue('mockMatterportModelId'),
    });
    getSceneInfo.mockResolvedValue({ error: { message: 'Client id and secret not valid', code: MATTERPORT_ERROR } });

    let container;
    await act(async () => {
      container = create(
        <StateManager
          viewport={viewport}
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          dataStreams={mockDataStreams}
          onSceneUpdated={vi.fn()}
        />,
      );
      await flushPromises();
    });

    expect(baseState.addMessages).toBeCalledTimes(1);
  });

  it.skip("should subscribe to query's provider succcessfully", async () => {
    accessStore('default').setState(baseState);
    const mockBuild = vi.fn();

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
          onSceneUpdated={vi.fn()}
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
          onSceneUpdated={vi.fn()}
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
          onSceneUpdated={vi.fn()}
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

    accessStore('default').setState({
      ...baseState,
      selectedSceneNodeRef: 'testRef',
      getSceneNodeByRef: vi.fn().mockReturnValue(testNode),
    });

    render(
      <StateManager
        sceneLoader={mockSceneLoader}
        sceneMetadataModule={mockSceneMetadataModule}
        config={sceneConfig}
        onSceneUpdated={vi.fn()}
      />,
    );
    await flushPromises();
    await flushPromises();
    await flushPromises();
    await flushPromises();
    expect(setActiveCameraSettings).toHaveBeenCalled();
  });

  it('should call setActiveCameraName if activeCamera is set', async () => {
    accessStore('default').setState({
      ...baseState,
    });

    await act(async () => {
      create(
        <StateManager
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          onSceneUpdated={vi.fn()}
          activeCamera='Camera1'
        />,
      );
      await flushPromises();
    });
    expect(setActiveCameraName).toHaveBeenCalledWith('Camera1');
  });

  it('should not call setActiveCameraName if activeCamera is set and selectedDataBinding is set', async () => {
    accessStore('default').setState({
      ...baseState,
    });

    await act(async () => {
      create(
        <StateManager
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          onSceneUpdated={vi.fn()}
          selectedDataBinding={{ entityId: 'entity' }}
          activeCamera='Camera1'
        />,
      );
      await flushPromises();
    });
    expect(setActiveCameraName).not.toBeCalled();
  });

  it('should call onSceneLoaded', async () => {
    accessStore('default').setState({
      ...baseState,
    });
    const onSceneLoaded = vi.fn();
    vi.useFakeTimers();

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

      accessStore('default').setState({
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
      vi.advanceTimersByTime(1);
    });

    expect(onSceneLoaded).toBeCalledTimes(1);
  });

  it('should call onSceneLoaded for matterport scene', async () => {
    accessStore('default').setState({
      ...createState('mockConnectionName'),
      sceneLoaded: true,
      getSceneProperty: vi.fn().mockReturnValue('mockMatterportModelId'),
    });
    getSceneInfo.mockResolvedValue({
      generatedSceneMetadata: {
        MATTERPORT_ACCESS_TOKEN: 'mockAccessToken',
        MATTERPORT_APPLICATION_KEY: 'mockApplicationKey',
      },
    });
    vi.useFakeTimers();

    const onSceneLoaded = vi.fn();

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
      vi.advanceTimersByTime(1);
    });

    expect(onSceneLoaded).toBeCalledTimes(1);
  });

  it('should call onSelectionChanged as expected', async () => {
    accessStore('default').setState({
      ...baseState,
    });
    const onSelectionChanged = vi.fn();

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
      accessStore('default').setState({
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
      accessStore('default').setState({
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
    accessStore('default').setState(createState('random'));
    const viewport = { duration: '5m' };

    let container;
    await act(async () => {
      container = create(
        <StateManager
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={sceneConfig}
          onSceneUpdated={vi.fn()}
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
          onSceneUpdated={vi.fn()}
          viewport={undefined}
        />,
      );
      await flushPromises();
    });
    expect(setViewportMock).toBeCalledTimes(2);
    expect(setViewportMock).toBeCalledWith(undefined);
  });

  it('should call setDataBindingQueryRefreshRate when changed', async () => {
    accessStore('default').setState(createState('random'));
    let container;
    await act(async () => {
      container = create(
        <StateManager
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={{ dataBindingQueryRefreshRate: 6666 }}
          onSceneUpdated={vi.fn()}
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
          onSceneUpdated={vi.fn()}
          viewport={undefined}
        />,
      );
      await flushPromises();
    });
    expect(setDataBindingQueryRefreshRateMock).toBeCalledTimes(2);
    expect(setDataBindingQueryRefreshRateMock).toBeCalledWith(undefined);
  });

  it('should call setAutoQueryEnabled with true', async () => {
    accessStore('default').setState(createState('random'));

    await act(async () => {
      create(
        <StateManager
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={{ mode: 'Viewing' }}
          onSceneUpdated={vi.fn()}
        />,
      );
      await flushPromises();
    });
    expect(setAutoQueryEnabledMock).toBeCalledTimes(1);
    expect(setAutoQueryEnabledMock).toBeCalledWith(true);
    expect(setAutoQueryEnabledMock).not.toBeCalledWith(false);
  });

  it('should call setAutoQueryEnabled with false when mode is Editing', async () => {
    accessStore('default').setState(createState('random'));

    await act(async () => {
      create(
        <StateManager
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={{ mode: 'Editing' }}
          onSceneUpdated={vi.fn()}
        />,
      );
      await flushPromises();
    });
    expect(setAutoQueryEnabledMock).toBeCalledTimes(1);
    expect(setAutoQueryEnabledMock).toBeCalledWith(false);
    expect(setAutoQueryEnabledMock).not.toBeCalledWith(true);
  });

  it('should call setAutoQueryEnabled with false when queries are passed in', async () => {
    accessStore('default').setState(createState('random'));

    await act(async () => {
      create(
        <StateManager
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={{ mode: 'Viewing' }}
          onSceneUpdated={vi.fn()}
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
    accessStore('default').setState(createState('random'));

    await act(async () => {
      create(
        <StateManager
          sceneLoader={mockSceneLoader}
          sceneMetadataModule={mockSceneMetadataModule}
          config={{ mode: 'Viewing' }}
          onSceneUpdated={vi.fn()}
          dataStreams={[]}
        />,
      );
      await flushPromises();
    });
    expect(setAutoQueryEnabledMock).toBeCalledWith(false);
    expect(setAutoQueryEnabledMock).not.toBeCalledWith(true);
  });
});
