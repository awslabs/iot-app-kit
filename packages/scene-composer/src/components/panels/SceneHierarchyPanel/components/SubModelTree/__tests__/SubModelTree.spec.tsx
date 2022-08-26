import React, { useCallback } from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Object3D, Event } from 'three';

import { useEditorState, useSceneDocument } from '../../../../../../store';
import useMaterialEffect from '../../../../../../hooks/useMaterialEffect';
import SubModelTree from '..';

jest.mock('../../../../../../utils/mathUtils', () => ({
  generateUUID: jest.fn(() => '40B59050-EBAE-497F-A366-201E775341DD'), // Hard code UUID for predictable snapshots.
}));

jest.mock('../../../../../../hooks/useMaterialEffect');

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useCallback: jest.fn((cb) => cb), // just act as a pass through, since we don't care about testing useCallback Behavior
}));

jest.mock('../SubModelTreeItemLabel', () => (props) => <div data-mocked='SubModelTreeItemLabel' {...props} />);

jest.mock('../../../../../../store', () => ({
  ...jest.requireActual('../../../../../../store'),
  useSceneDocument: jest.fn(() => ({ appendSceneNodeInternal: jest.fn() })),
  useEditorState: jest.fn(() => ({ setSceneNodeObject3DMapping: jest.fn() })),
}));

const node = (id: number, name?: string, children: any[] = [], isOriginal = true) => {
  return { id, name, children, userData: { isOriginal: isOriginal } };
};

describe('SubModelTree', () => {
  it('should render appropriately based on the object', () => {
    (useMaterialEffect as jest.Mock).mockImplementation(() => [jest.fn(), jest.fn()]);
    const object = {
      name: 'RootObject',
      userData: { isOriginal: true },
      children: [
        node(1, 'Node 1'),
        node(2, 'Node 2'),
        node(3, 'Node 3', [], false),
        node(4),
        node(5, 'Node 5', [node(6, 'Child 1'), node(7, 'Child 2'), node(8, 'Child 3')]),
      ] as unknown as Object3D<Event>[],
    } as unknown as Object3D<Event>;

    const parentRef = '112';

    const { container } = render(<SubModelTree parentRef={parentRef} object3D={object} />);
    expect(container).toMatchSnapshot();
  });

  it('should change color of submodel on hover', async () => {
    const transform = jest.fn();
    const restore = jest.fn();

    const object = {
      name: 'RootObject',
      userData: { isOriginal: true },
      children: [] as unknown as Object3D<Event>[],
    } as unknown as Object3D<Event>;

    const parentRef = '112';

    (useMaterialEffect as jest.Mock).mockImplementation(() => [transform, restore]);

    const { findByText } = render(<SubModelTree parentRef={parentRef} object3D={object} />);

    const label = await findByText('RootObject');

    fireEvent.mouseOver(label!);

    expect(transform).toHaveBeenCalled();

    fireEvent.mouseLeave(label);

    expect(restore).toHaveBeenCalled();
  });

  describe('callbacks', () => {
    let callbacks: ((args?: any) => void)[] = [];

    beforeEach(() => {
      callbacks = [];
      (useCallback as jest.Mock).mockImplementation((cb) => {
        callbacks.push(cb);
        return cb;
      });
    });

    it('should toggle visibility when triggered', () => {
      const object = {
        name: 'RootObject',
        userData: { isOriginal: true },
        children: [] as unknown as Object3D<Event>[],
      } as unknown as Object3D<Event>;

      const parentRef = '112';

      (useMaterialEffect as jest.Mock).mockImplementation(() => [jest.fn(), jest.fn()]);

      render(<SubModelTree parentRef={parentRef} object3D={object} />);

      const [onVisibilityToggled] = callbacks;

      onVisibilityToggled(true);

      expect(object.visible).toEqual(true);
    });

    it('should append node onCreate', () => {
      const appendSceneNodeInternal = jest.fn();
      const setSceneNodeObject3DMapping = jest.fn();
      const object = {
        name: 'RootObject',
        userData: { isOriginal: true },
        position: { x: 1, y: 1, z: 1 },
        rotation: { x: 1, y: 1, z: 1 },
        scale: { x: 1, y: 1, z: 1 },
        children: [] as unknown as Object3D<Event>[],
      } as unknown as Object3D<Event>;

      const parentRef = '112';

      (useSceneDocument as jest.Mock).mockImplementation(() => ({ appendSceneNodeInternal }));

      (useEditorState as jest.Mock).mockImplementation(() => ({ setSceneNodeObject3DMapping }));

      (useMaterialEffect as jest.Mock).mockImplementation(() => [jest.fn(), jest.fn()]);

      render(<SubModelTree parentRef={parentRef} object3D={object} />);

      // Act
      const [, onCreate] = callbacks;
      onCreate();

      expect(appendSceneNodeInternal).toBeCalled();
      expect(setSceneNodeObject3DMapping).toBeCalled();
      expect(appendSceneNodeInternal.mock.calls[0]).toMatchSnapshot();
    });
  });
});
