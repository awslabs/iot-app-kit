import React from 'react';
import { render } from '@testing-library/react';
import * as THREE from 'three';

import { useStore } from '../../../store';
import * as nodeUtils from '../../../utils/nodeUtils';
import { KnownComponentType } from '../../../interfaces';

import SceneHierarchyDataProvider, { Context } from './SceneHierarchyDataProvider';

describe('SceneHierarchyDataProvider', () => {
  const baseState: any = {
    getSceneNodeByRef: jest.fn(),
    getObject3DBySceneNodeRef: jest.fn(),
    updateSceneNodeInternal: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it(`should return correct path from selected node to root`, () => {
    useStore('default').setState(baseState);
    baseState.getSceneNodeByRef.mockReturnValueOnce({ ref: 'node-1' });
    baseState.getSceneNodeByRef.mockReturnValueOnce({ ref: 'sub-parent-1' });
    baseState.getSceneNodeByRef.mockReturnValueOnce({ ref: 'parent-1' });

    const expectedResult = ['sub-parent-1', 'parent-1'];

    const { getByText } = render(
      <SceneHierarchyDataProvider selectionMode='single'>
        <Context.Consumer>
          {(value) => <span>Path to root: {value.pathFromSelectedToRoot?.toString()}</span>}
        </Context.Consumer>
      </SceneHierarchyDataProvider>,
    );

    expect(baseState.getSceneNodeByRef).toBeCalledTimes(4);
    expect(getByText('Path to root: ' + expectedResult.toString())).toBeTruthy();
  });

  describe('move', () => {
    /**
     * oldParent
     *   original
     *   newParent
     */
    const oldParentNode = {
      ref: 'oldParent',
      parentRef: undefined,
      components: [],
      transform: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },
    };

    const originalNode = {
      ref: 'original',
      parentRef: 'oldParent',
      components: [{ type: KnownComponentType.ModelRef }],
      transform: {
        position: [1, 2, 3],
        rotation: [0, 0, 0],
        scale: [6, 6, 6],
      },
    };
    const newParentNode = {
      ref: 'newParent',
      parentRef: 'oldParent',
      components: [{ type: KnownComponentType.ModelRef }],
      transform: {
        position: [1, 1, 1],
        rotation: [0, 0, 0],
        scale: [2, 2, 2],
      },
    };

    const sceneNodeMap = {
      oldParent: oldParentNode,
      original: originalNode,
      newParent: newParentNode,
    };

    const originalObject = new THREE.Object3D();
    originalObject.name = 'original';
    const newParentObject = new THREE.Object3D();
    newParentObject.name = 'newParent';
    const oldParentObject = new THREE.Object3D();
    oldParentObject.name = 'oldParent';

    const objectMap = {
      original: originalObject,
      oldParent: oldParentObject,
      newParentNode: newParentObject,
    };

    beforeEach(() => {
      jest.clearAllMocks();

      useStore('default').setState(baseState);
      baseState.getSceneNodeByRef.mockImplementation((ref) => sceneNodeMap[ref]);
      baseState.getObject3DBySceneNodeRef.mockImplementation((ref) => objectMap[ref]);
    });

    it(`should do nothing when parent is not changed`, () => {
      let context;
      render(
        <SceneHierarchyDataProvider selectionMode='single'>
          <Context.Consumer>
            {
              ((value) => {
                context = value;
              }) as any
            }
          </Context.Consumer>
        </SceneHierarchyDataProvider>,
      );

      context.move(originalNode.ref, originalNode.parentRef);

      expect(baseState.updateSceneNodeInternal).not.toBeCalled();
    });

    it(`should set new relative position and scale when moved to new parent`, () => {
      const getRelativeTransformSpy = jest.spyOn(nodeUtils, 'getRelativeTransform');

      let context;
      render(
        <SceneHierarchyDataProvider selectionMode='single'>
          <Context.Consumer>
            {
              ((value) => {
                context = value;
              }) as any
            }
          </Context.Consumer>
        </SceneHierarchyDataProvider>,
      );

      context.move(originalNode.ref, newParentNode.ref);

      expect(getRelativeTransformSpy).toBeCalledTimes(1);
      expect(baseState.updateSceneNodeInternal).toMatchInlineSnapshot(`
      [MockFunction] {
        "calls": Array [
          Array [
            "original",
            Object {
              "parentRef": "newParent",
              "transform": Object {
                "position": Array [
                  0,
                  1,
                  2,
                ],
                "rotation": Array [
                  0,
                  0,
                  0,
                ],
                "scale": Array [
                  3,
                  3,
                  3,
                ],
              },
            },
          ],
        ],
        "results": Array [
          Object {
            "type": "return",
            "value": undefined,
          },
        ],
      }
      `);
    });
  });
});
