import { render } from '@testing-library/react';
import { Mesh, Vector3 } from 'three';

import SubModelComponent from '..';
import { type ISceneNodeInternal, useEditorState } from '../../../../store';
import { KnownComponentType } from '../../../../interfaces';

vi.mock('../../../../common/sceneComposerIdContext', () => ({
  useSceneComposerId: vi.fn(() => 'composer'),
}));

vi.mock('../../../../store', () => {
  return {
    useEditorState: vi.fn(),
    useSceneDocument: vi.fn().mockReturnValue({ document: {} }),
  };
});

describe('<SubModelComponent />', () => {
  it('should be equal', () => {
    const node = {
      transform: {
        scale: [10, 10, 10],
        position: [10, 10, 10],
        rotation: [10, 10, 10],
      },
    } as ISceneNodeInternal;

    const obj = new Mesh();

    const getObject3DBySceneNodeRef = vi.fn(() => obj);
    (useEditorState as vi.Mock).mockImplementation(() => ({
      getObject3DBySceneNodeRef,
    }));
    getObject3DBySceneNodeRef.mockImplementation(() => obj);

    render(<SubModelComponent node={node} component={{ selector: 'abc', type: KnownComponentType.SubModelRef }} />);

    const { x, y, z } = obj.rotation;

    expect(obj.scale).toEqual(new Vector3(...node.transform.scale));
    expect(obj.position).toEqual(new Vector3(...node.transform.position));
    expect([x, y, z]).toEqual(node.transform.rotation);
  });
});
