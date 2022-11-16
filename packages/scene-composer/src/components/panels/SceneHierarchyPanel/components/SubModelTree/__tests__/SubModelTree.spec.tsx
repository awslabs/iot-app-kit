import React, { useCallback } from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Object3D, Event } from 'three';

import { useEditorState, useSceneDocument } from '../../../../../../store';
import useMaterialEffect from '../../../../../../hooks/useMaterialEffect';
import SubModelTree from '..';
import { KnownComponentType } from '../../../../../../interfaces';

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
  useSceneDocument: jest.fn(() => ({
    appendSceneNodeInternal: jest.fn(),
    getSceneNodeByRef: jest.fn(),
  })),
  useEditorState: jest.fn(() => ({ setSceneNodeObject3DMapping: jest.fn() })),
}));

const node = (id: number, name?: string, children: any[] = [], isOriginal = true) => {
  return { id, name, children, userData: { isOriginal: isOriginal } };
};

const defaultObject = {
  object3D: {
    name: 'RootObject',
    userData: { isOriginal: true },
    children: [
      node(1, 'Node 1'),
      node(2, 'Node 2'),
      node(3, 'Node 3', [], false),
      node(4),
      node(5, 'Node 5', [node(6, 'Child 1'), node(7, 'Child 2'), node(8, 'Child 3')]),
      node(9, '', [node(10, 'Child 4'), node(11, 'Child 5'), node(12, 'Child 6')]),
      node(13, 'Composer Added', [node(14, 'Child 7'), node(15, 'Child 8'), node(16, 'Child 9')], false),
    ] as unknown as Object3D<Event>[],
  } as unknown as Object3D<Event>,
  parentRef: '112',
};

describe('SubModelTree', () => {
  it('should render appropriately based on the object', () => {
    (useMaterialEffect as jest.Mock).mockImplementation(() => [jest.fn(), jest.fn()]);

    const { container } = render(<SubModelTree {...defaultObject} />);
    expect(container).toMatchSnapshot();
  });

  it('should not render a SubModel Tree if name is null', () => {
    (useMaterialEffect as jest.Mock).mockImplementation(() => [jest.fn(), jest.fn()]);

    const objectNullName = {
      ...defaultObject,
      name: undefined,
    };

    const { container } = render(<SubModelTree {...objectNullName} />);
    expect(container).toMatchSnapshot();
  });

  it('should not render a SubModel Tree if isOriginal flag is false', () => {
    (useMaterialEffect as jest.Mock).mockImplementation(() => [jest.fn(), jest.fn()]);

    const objectIsOriginalFalse = {
      ...defaultObject,
      userData: { isOriginal: false },
    };

    const { container } = render(<SubModelTree {...objectIsOriginalFalse} />);
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
      const getSceneNodeByRef = jest.fn();
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

      (useSceneDocument as jest.Mock).mockImplementation(() => ({
        appendSceneNodeInternal,
        getSceneNodeByRef,
      }));

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

    it('should not append duplicate node onCreate', () => {
      const appendSceneNodeInternal = jest.fn();

      const nodes = [
        {
          childRefs: ['childRef'],
        },
        {
          ref: 'childRef',
          components: [
            {
              type: KnownComponentType.SubModelRef,
              selector: 'RootObject',
            },
          ],
        },
      ];
      const getSceneNodeByRef = jest.fn().mockReturnValueOnce(nodes[0]).mockReturnValueOnce(nodes[1]);
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

      (useSceneDocument as jest.Mock).mockImplementation(() => ({
        appendSceneNodeInternal,
        getSceneNodeByRef,
      }));

      (useEditorState as jest.Mock).mockImplementation(() => ({ setSceneNodeObject3DMapping }));

      (useMaterialEffect as jest.Mock).mockImplementation(() => [jest.fn(), jest.fn()]);

      render(<SubModelTree parentRef={parentRef} object3D={object} />);

      // Act
      const [, onCreate] = callbacks;
      onCreate();

      expect(appendSceneNodeInternal).not.toBeCalled();
      expect(setSceneNodeObject3DMapping).not.toBeCalled();
    });
  });
});
