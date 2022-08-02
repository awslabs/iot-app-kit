import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import EntityGroup from '..';
import { useEditorState, useSceneDocument } from '../../../../store';
import { fakeSceneNode } from '../fakers';

jest.mock('../../../../store', () => ({
  ...jest.requireActual('../../../../store'),
  useSceneDocument: jest.fn(() => ({
    getSceneNodeByRef: jest.fn(),
  })),
  useEditorState: jest.fn(() => ({
    getObject3DBySceneNodeRef: jest.fn(),
    selectedSceneNodeRef: null,
    setSceneNodeObject3DMapping: jest.fn(),
    setSelectedSceneNodeRef: jest.fn(),
  })),
}));

describe('<EntityGroup />', () => {
  it('should render expected DOM when rendered', () => {
    const childRefs = [1, 2, 3].map((i) => fakeSceneNode(`${i}`));
    const node = fakeSceneNode(
      'parent',
      childRefs.map((c) => c.ref),
    );
    const getSceneNodeByRef = jest.fn((ref: string) => childRefs[Number(ref)]);

    (useSceneDocument as jest.Mock).mockImplementation(() => ({
      getSceneNodeByRef,
    }));

    const { container } = render(<EntityGroup node={node} />);
    expect(container).toMatchSnapshot();
  });

  it('should select the corresponding scene node when the group is clicked', async () => {
    const node = fakeSceneNode('EntityGroup');
    const setSelectedSceneNodeRef = jest.fn();

    (useEditorState as jest.Mock).mockImplementation(() => ({
      selectedSceneNodeRef: undefined,
      setSelectedSceneNodeRef,
      getObject3DBySceneNodeRef: jest.fn(),
      setSceneNodeObject3DMapping: jest.fn(),
    }));

    const { container } = render(<EntityGroup node={node} />);

    const group = container.children[0];

    fireEvent.click(group);

    expect(setSelectedSceneNodeRef).toBeCalledWith(node.ref);
  });

  it('should deselect the corresponding scene node when it is clicked', async () => {
    const node = fakeSceneNode('EntityGroup');
    const setSelectedSceneNodeRef = jest.fn();

    (useEditorState as jest.Mock).mockImplementation(() => ({
      selectedSceneNodeRef: node.ref,
      setSelectedSceneNodeRef,
      getObject3DBySceneNodeRef: jest.fn(),
      setSceneNodeObject3DMapping: jest.fn(),
    }));

    const { container } = render(<EntityGroup node={node} />);

    const group = container.children[0];

    fireEvent.click(group);

    expect(setSelectedSceneNodeRef).toBeCalledWith(undefined);
  });
});
