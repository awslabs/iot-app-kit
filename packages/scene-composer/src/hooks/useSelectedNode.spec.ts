import { useSceneComposerId } from '../common/sceneComposerIdContext';
import { accessStore, useEditorState } from '../store';

import useSelectedNode from './useSelectedNode';

vi.mock('../store', async () => ({
  ...(await vi.importActual('../store')),
  useEditorState: vi.fn(),
  accessStore: vi.fn(),
}));

vi.mock('../common/sceneComposerIdContext', async () => ({
  ...(await vi.importActual('../common/sceneComposerIdContext')),
  useSceneComposerId: vi.fn(),
}));

vi.mock('react', async () => ({
  ...(await vi.importActual('react')),
  useMemo: vi.fn((cb) => cb()), // useMemo just caches the results, for mocking purposes, we can always just execute.
  useCallback: vi.fn((cb) => cb), // unbox callbacks.
}));

describe('useSelectedObject', () => {
  it('should return the object from the store', () => {
    const expected = { material: { color: 'blue ' } };
    const getObject3DBySceneNodeRefMock = vi.fn(() => expected);
    const getSceneNodeByRef = vi.fn(() => 'Object representing scene node at this ref');
    const sceneComposerId = 'fred';

    (useSceneComposerId as vi.Mock).mockImplementation(() => sceneComposerId);
    (useEditorState as vi.Mock).mockImplementation(() => ({
      selectedSceneNodeRef: 'ref',
      selectedSceneSubmodelRef: 'submodelRef',
      getObject3DBySceneNodeRef: getObject3DBySceneNodeRefMock,
      setSelectedSceneNodeRef: vi.fn(),
      setSelectedSceneSubmodelRef: vi.fn(),
    }));

    (accessStore as vi.Mock).mockImplementation(
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
