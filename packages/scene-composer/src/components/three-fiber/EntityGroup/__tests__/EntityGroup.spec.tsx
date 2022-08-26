import React from 'react';
import { render } from '@testing-library/react';

import EntityGroup from '..';
import { useSceneDocument } from '../../../../store';
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

jest.mock('../useCallbackWhenNotPanning', () => (cb) => [
  jest.fn(),
  function Hack(e) {
    cb(e);
  },
]);

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
});
