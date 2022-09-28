import React from 'react';
import { render } from '@testing-library/react';
import { Euler, Mesh, Vector3 } from 'three';

import SubModelComponent from '..';
import { ISceneNodeInternal, useEditorState } from '../../../../store';
import { ISubModelRefComponent } from '../../../../interfaces';

jest.mock('../../../../common/sceneComposerIdContext', () => ({
  useSceneComposerId: jest.fn(() => 'composer'),
}));

jest.mock('../../../../store', () => {
  return {
    useEditorState: jest.fn(),
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

    const getObject3DBySceneNodeRef = jest.fn(() => obj);
    (useEditorState as jest.Mock).mockImplementation(() => ({
      getObject3DBySceneNodeRef,
    }));
    getObject3DBySceneNodeRef.mockImplementation(() => obj);

    render(<SubModelComponent node={node} component={undefined as unknown as ISubModelRefComponent} />);

    const { x, y, z } = obj.rotation;

    expect(obj.scale).toEqual(new Vector3(...node.transform.scale));
    expect(obj.position).toEqual(new Vector3(...node.transform.position));
    expect([x, y, z]).toEqual(node.transform.rotation);
  });
});
