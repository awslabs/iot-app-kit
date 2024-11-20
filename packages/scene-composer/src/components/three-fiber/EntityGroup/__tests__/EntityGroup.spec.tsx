import { render } from '@testing-library/react';

import EntityGroup from '..';
import { useSceneDocument } from '../../../../store';
import { fakeSceneNode } from '../fakers';

vi.mock('../../../../store', async () => ({
  ...(await vi.importActual('../../../../store')),

  useSceneDocument: vi.fn(() => ({
    getSceneNodeByRef: vi.fn(),
  })),

  useEditorState: vi.fn(() => ({
    getObject3DBySceneNodeRef: vi.fn(),
    selectedSceneNodeRef: null,
    setSceneNodeObject3DMapping: vi.fn(),
    setSelectedSceneNodeRef: vi.fn(),
  })),
}));

describe('<EntityGroup />', () => {
  it('should render expected DOM when rendered', () => {
    const childRefs = [1, 2, 3].map((i) => fakeSceneNode(`${i}`));
    const node = fakeSceneNode(
      'parent',
      childRefs.map((c) => c.ref),
    );
    const getSceneNodeByRef = vi.fn((ref: string) => childRefs[Number(ref)]);

    (useSceneDocument as vi.Mock).mockImplementation(() => ({
      getSceneNodeByRef,
    }));

    const { container } = render(<EntityGroup node={node} />);
    expect(container).toMatchSnapshot();
  });
});
