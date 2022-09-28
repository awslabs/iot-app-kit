import { useEditorState, useStore } from '../store';
import { useSceneComposerId } from '../common/sceneComposerIdContext';

import useSelectedNode from './useSelectedNode';

jest.mock('../store', () => ({
  ...jest.requireActual('../store'),
  useEditorState: jest.fn(),
  useStore: jest.fn(),
}));

jest.mock('../common/sceneComposerIdContext', () => ({
  ...jest.requireActual('../common/sceneComposerIdContext'),
  useSceneComposerId: jest.fn(),
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useMemo: jest.fn((cb) => cb()), // useMemo just caches the results, for mocking purposes, we can always just execute.
  useCallback: jest.fn((cb) => cb), // unbox callbacks.
}));

describe('useSelectedObject', () => {
  it('should return the object from the store', () => {
    const expected = { material: { color: 'blue ' } };
    const getObject3DBySceneNodeRefMock = jest.fn(() => expected);
    const getSceneNodeByRef = jest.fn(() => 'Object representing scene node at this ref');
    const sceneComposerId = 'fred';

    (useSceneComposerId as jest.Mock).mockImplementation(() => sceneComposerId);
    (useEditorState as jest.Mock).mockImplementation(() => ({
      selectedSceneNodeRef: 'ref',
      selectedSceneSubmodelRef: 'submodelRef',
      getObject3DBySceneNodeRef: getObject3DBySceneNodeRefMock,
      setSelectedSceneNodeRef: jest.fn(),
      setSelectedSceneSubmodelRef: jest.fn(),
    }));

    (useStore as jest.Mock).mockImplementation(
      () => (cb) =>
        cb({
          getSceneNodeByRef,
        }),
    );

    // Act
    const result = useSelectedNode();

    expect(result).toMatchSnapshot();
  });
});
