/* eslint-disable */
const mockSceneComposerApi = {
  findSceneNodeRefBy: vi.fn(),
  setCameraTarget: vi.fn(),
  setSelectedSceneNodeRef: vi.fn(),
};

let onSceneLoadedCb;
vi.mock('./components/SceneComposerInternal', async () => {
  const original = await vi.importActual('./components/SceneComposerInternal');
  return {
    ...original,
    SceneComposerInternal: (props) => {
      onSceneLoadedCb = props.onSceneLoaded;
      return mockComponent('SceneComposerInternal')(props);
    },
    useSceneComposerApi: () => mockSceneComposerApi,
  };
});

import { act, create } from 'react-test-renderer';
import mockComponent from '../__mocks__/mockComponent';
import { SceneViewer } from './SceneViewer';
import { KnownComponentType } from './interfaces';
/* eslint-enable */

describe('SceneViewer', () => {
  const mockGetSceneObjectFunction = vi;
  const mockSceneLoader = {
    getSceneUri: () => Promise.resolve('https://test.url'),
    getSceneUrl: () => Promise.resolve('https://test.url'),
    getSceneObject: mockGetSceneObjectFunction,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', async () => {
    let container;
    act(() => {
      container = create(<SceneViewer sceneComposerId='123' sceneLoader={mockSceneLoader} />);
    });

    expect(container).toMatchSnapshot();
  });

  it('should call sceneComposerApis to select when selectedDataBinding is available with component name', async () => {
    const mockNodeRef = ['node-123'];
    mockSceneComposerApi.findSceneNodeRefBy.mockReturnValueOnce(mockNodeRef);
    const mockLabel = { entityId: 'entity', componentName: 'component' };

    let container;
    act(() => {
      container = create(<SceneViewer sceneLoader={mockSceneLoader} selectedDataBinding={mockLabel} />);
    });

    // not called before scene is loaded
    expect(mockSceneComposerApi.findSceneNodeRefBy).not.toBeCalled();
    expect(mockSceneComposerApi.setCameraTarget).not.toBeCalled();

    act(() => {
      onSceneLoadedCb();
      container.update(<SceneViewer sceneLoader={mockSceneLoader} selectedDataBinding={mockLabel} />);
    });

    // called after scene is loaded
    expect(mockSceneComposerApi.findSceneNodeRefBy).toBeCalledTimes(1);
    expect(mockSceneComposerApi.findSceneNodeRefBy).toBeCalledWith(mockLabel, [KnownComponentType.Tag]);
    expect(mockSceneComposerApi.setCameraTarget).toBeCalledTimes(1);
    expect(mockSceneComposerApi.setCameraTarget).toBeCalledWith(mockNodeRef[0], 'transition');
    expect(mockSceneComposerApi.setSelectedSceneNodeRef).toBeCalledTimes(1);
    expect(mockSceneComposerApi.setSelectedSceneNodeRef).toBeCalledWith(mockNodeRef[0]);

    // not re-setting camera with same data binding values
    container.update(<SceneViewer sceneLoader={mockSceneLoader} selectedDataBinding={mockLabel} />);

    expect(mockSceneComposerApi.findSceneNodeRefBy).toBeCalledTimes(1);
    expect(mockSceneComposerApi.setCameraTarget).toBeCalledTimes(1);
  });

  it('should call sceneComposerApis to select when selectedDataBinding is available without component name', async () => {
    const mockNodeRef = ['node-123'];
    mockSceneComposerApi.findSceneNodeRefBy.mockReturnValueOnce(mockNodeRef);
    const mockLabel = { entityId: 'entity' };

    let container;
    act(() => {
      container = create(<SceneViewer sceneLoader={mockSceneLoader} selectedDataBinding={mockLabel} />);
    });

    // not called before scene is loaded
    expect(mockSceneComposerApi.findSceneNodeRefBy).not.toBeCalled();
    expect(mockSceneComposerApi.setCameraTarget).not.toBeCalled();

    act(() => {
      onSceneLoadedCb();
      container.update(<SceneViewer sceneLoader={mockSceneLoader} selectedDataBinding={mockLabel} />);
    });

    // called after scene is loaded
    expect(mockSceneComposerApi.findSceneNodeRefBy).toBeCalledTimes(1);
    expect(mockSceneComposerApi.findSceneNodeRefBy).toBeCalledWith(mockLabel, [KnownComponentType.EntityBinding]);
    expect(mockSceneComposerApi.setCameraTarget).toBeCalledTimes(1);
    expect(mockSceneComposerApi.setCameraTarget).toBeCalledWith(mockNodeRef[0], 'transition');
    expect(mockSceneComposerApi.setSelectedSceneNodeRef).toBeCalledTimes(1);
    expect(mockSceneComposerApi.setSelectedSceneNodeRef).toBeCalledWith(mockNodeRef[0]);

    // not re-setting camera with same data binding values
    container.update(<SceneViewer sceneLoader={mockSceneLoader} selectedDataBinding={mockLabel} />);

    expect(mockSceneComposerApi.findSceneNodeRefBy).toBeCalledTimes(1);
    expect(mockSceneComposerApi.setCameraTarget).toBeCalledTimes(1);
  });

  it('should call sceneComposerApis to deselect when selectedDataBinding has no matching', async () => {
    mockSceneComposerApi.findSceneNodeRefBy.mockReturnValueOnce(undefined);
    const mockLabel = { entityId: 'entity', componentName: 'component' };

    let container;
    act(() => {
      container = create(<SceneViewer sceneLoader={mockSceneLoader} selectedDataBinding={mockLabel} />);
    });

    act(() => {
      onSceneLoadedCb();
      container.update(<SceneViewer sceneLoader={mockSceneLoader} selectedDataBinding={mockLabel} />);
    });

    expect(mockSceneComposerApi.findSceneNodeRefBy).toBeCalledTimes(1);
    expect(mockSceneComposerApi.setCameraTarget).toBeCalledTimes(0);
    expect(mockSceneComposerApi.setSelectedSceneNodeRef).toBeCalledTimes(1);
    expect(mockSceneComposerApi.setSelectedSceneNodeRef).toBeCalledWith(undefined);
  });
});
