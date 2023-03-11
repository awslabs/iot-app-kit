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
    const originalNode = {
      ref: 'original',
      parentRef: 'oldParent',
      components: [],
      transform: {
        scale: [6, 6, 6],
      },
    };
    const modelRefNode = {
      ref: 'modelRef',
      components: [{ type: KnownComponentType.ModelRef }],
    };
    const subModelNode = {
      ref: 'subModel',
      parentRef: modelRefNode.ref,
      components: [{ type: KnownComponentType.SubModelRef }],
    };

    const originalObject = new THREE.Object3D();
    originalObject.name = 'original';
    const modelRefObject = new THREE.Object3D();
    modelRefObject.name = 'modelRef';
    const subModelObject = new THREE.Object3D();
    subModelObject.name = 'subModel';

    const sceneNodeMap = {
      original: originalNode,
      subModel: subModelNode,
      modelRef: modelRefNode,
    };
    const objectMap = {
      original: originalObject,
      subModel: subModelObject,
      modelRef: modelRefObject,
    };

    const mockFinalTransform = {
      position: new THREE.Vector3(1, 1, 1),
      rotation: new THREE.Euler(1, 1, 1),
      scale: new THREE.Vector3(1, 1, 1),
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

    it(`should use correct ModelRef node to calculate transforms when new parent is SubModelRef`, () => {
      const getFinalTransformSpy = jest.spyOn(nodeUtils, 'getFinalTransform').mockReturnValue(mockFinalTransform);

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

      context.move(originalNode.ref, subModelNode.ref);

      expect(getFinalTransformSpy).toBeCalledTimes(1);
      expect(getFinalTransformSpy).toBeCalledWith(expect.anything(), modelRefObject);
      expect(baseState.updateSceneNodeInternal).toMatchInlineSnapshot(`
        [MockFunction] {
          "calls": Array [
            Array [
              "original",
              Object {
                "parentRef": "subModel",
                "transform": Object {
                  "position": Array [
                    1,
                    1,
                    1,
                  ],
                  "rotation": Array [
                    0.8414709848078967,
                    -0.45464871341284097,
                    0.2919265817264288,
                  ],
                  "scale": Array [
                    1,
                    1,
                    1,
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

    it(`should keep Tag's original scale`, () => {
      const getFinalTransformSpy = jest.spyOn(nodeUtils, 'getFinalTransform').mockReturnValue(mockFinalTransform);
      const customSceneNodeMap = {
        ...sceneNodeMap,
        original: {
          ...originalNode,
          components: [{ type: KnownComponentType.Tag }],
        },
      };
      baseState.getSceneNodeByRef.mockImplementation((ref) => customSceneNodeMap[ref]);

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

      context.move(originalNode.ref, modelRefNode.ref);

      expect(getFinalTransformSpy).toBeCalledTimes(1);
      expect(getFinalTransformSpy).toBeCalledWith(expect.anything(), modelRefObject);
      expect(baseState.updateSceneNodeInternal).toMatchInlineSnapshot(`
        [MockFunction] {
          "calls": Array [
            Array [
              "original",
              Object {
                "parentRef": "modelRef",
                "transform": Object {
                  "position": Array [
                    1,
                    1,
                    1,
                  ],
                  "rotation": Array [
                    0.8414709848078967,
                    -0.45464871341284097,
                    0.2919265817264288,
                  ],
                  "scale": Array [
                    6,
                    6,
                    6,
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
