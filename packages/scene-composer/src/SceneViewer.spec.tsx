/* eslint-disable */
const mockSceneComposerApi = {
  findSceneNodeRefBy: jest.fn(),
  setCameraTarget: jest.fn(),
  setSelectedSceneNodeRef: jest.fn(),
};

jest.doMock('./components/SceneComposerInternal', () => {
  const original = jest.requireActual('./components/SceneComposerInternal');
  return {
    ...original,
    SceneComposerInternal: 'SceneComposerInternal',
    useSceneComposerApi: () => mockSceneComposerApi,
  }
});

import * as React from 'react';
import renderer, { act } from 'react-test-renderer';
import { useStore } from './store';
import { SceneViewer } from './SceneViewer';
import { KnownComponentType } from './interfaces';
/* eslint-enable */

describe('SceneViewer', () => {
  const mockGetSceneObjectFunction = jest.fn();
  const mockSceneLoader = {
    getSceneUri: () => Promise.resolve('https://test.url'),
    getSceneUrl: () => Promise.resolve('https://test.url'),
    getSceneObject: mockGetSceneObjectFunction,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', async () => {
    let container;
    act(() => {
      container = renderer.create(<SceneViewer sceneComposerId={'123'} sceneLoader={mockSceneLoader} config={{}} />);
    });

    expect(container).toMatchSnapshot();
  });

  it('should call sceneComposerApis when selectedDataBinding is available', async () => {
    const mockNodeRef = ['node-123'];
    mockSceneComposerApi.findSceneNodeRefBy.mockReturnValueOnce(mockNodeRef);
    const mockLabel = { label: 'label-1' };

    let container;
    act(() => {
      container = renderer.create(
        <SceneViewer sceneLoader={mockSceneLoader} config={{}} selectedDataBinding={mockLabel} />,
      );
    });

    expect(mockSceneComposerApi.findSceneNodeRefBy).toBeCalledTimes(1);
    expect(mockSceneComposerApi.findSceneNodeRefBy).toBeCalledWith(mockLabel, [KnownComponentType.Tag]);
    expect(mockSceneComposerApi.setCameraTarget).toBeCalledTimes(1);
    expect(mockSceneComposerApi.setCameraTarget).toBeCalledWith(mockNodeRef[0], 'transition');
    expect(mockSceneComposerApi.setSelectedSceneNodeRef).toBeCalledTimes(1);
    expect(mockSceneComposerApi.setSelectedSceneNodeRef).toBeCalledWith(mockNodeRef[0]);

    // not re-setting camera with same data binding values
    container.update(<SceneViewer sceneLoader={mockSceneLoader} config={{}} selectedDataBinding={mockLabel} />);

    expect(mockSceneComposerApi.findSceneNodeRefBy).toBeCalledTimes(1);
    expect(mockSceneComposerApi.setCameraTarget).toBeCalledTimes(1);
  });
});
