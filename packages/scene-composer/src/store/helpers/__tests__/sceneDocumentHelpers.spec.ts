import { cloneDeep } from 'lodash';

import { ISceneDocumentInternal, ISceneNodeInternal, RootState } from '../..';
import DebugLogger from '../../../logger/DebugLogger';
import { ITransformInternal } from '../../internalInterfaces';
import { appendSceneNode, removeNode, renderSceneNodes, updateSceneNode } from '../sceneDocumentHelpers';
import { mergeDeep } from '../../../utils/objectUtils';
import { RESERVED_LAYER_ID } from '../../../common/entityModelConstants';

jest.mock('../../../utils/objectUtils', () => {
  return { mergeDeep: jest.fn() };
});

const logger = new DebugLogger('stateStore');

const defaultTransform: ITransformInternal = {
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  scale: [1, 1, 1],
};

describe('sceneDocumentHelpers', () => {
  describe('removeNode', () => {
    it('should be able to removeNode correctly', () => {
      const document = {
        rootNodeRefs: ['root', 'testNode'],
        nodeMap: {
          root: {
            ref: 'root',
            childRefs: [],
            components: [{ ref: 'root-comp', type: 'abc' }],
            name: 'root',
            transform: defaultTransform,
            properties: {},
            transformConstraint: {},
          },
          testNode: {
            ref: 'testNode',
            childRefs: ['childNode'],
            components: [
              { ref: 'test-comp-1', type: 'abc' },
              { ref: 'test-comp-2', type: 'def' },
            ],
            name: 'testNode',
            transform: defaultTransform,
            properties: {},
            transformConstraint: {},
          },
          childNode: {
            ref: 'childNode',
            parentRef: 'testNode',
            childRefs: ['grandchildNode'],
            components: [{ ref: 'child-comp', type: 'def' }],
            name: 'childNode',
            transform: defaultTransform,
            properties: {},
            transformConstraint: {},
          },
          grandchildNode: {
            ref: 'grandchildNode',
            parentRef: 'childNode',
            childRefs: [],
            components: [],
            name: 'grandchildNode',
            transform: defaultTransform,
            properties: {},
            transformConstraint: {},
          },
        } as Record<string, ISceneNodeInternal>,
        componentNodeMap: {
          abc: { root: ['root-comp'], testNode: ['test-comp-1'] },
          def: { testNode: ['test-comp-2'], childNode: ['child-comp'] },
        },
        unit: 'meter',
        version: '1.0',
        ruleMap: {},
      } as ISceneDocumentInternal;

      removeNode(document, 'childNode', logger);
      expect(document.nodeMap.testNode.childRefs).toEqual([]);
      expect(document.nodeMap.childNode).toBeUndefined();
      expect(document.nodeMap.grandchildNode).toBeUndefined();
      expect(document.componentNodeMap).toEqual({
        abc: { root: ['root-comp'], testNode: ['test-comp-1'] },
        def: { testNode: ['test-comp-2'] },
      });
    });
  });

  describe('renderSceneNodes', () => {
    it('should be able to renderSceneNodes correctly', () => {
      const document = {
        rootNodeRefs: ['root', 'testNode'],
        nodeMap: {
          root: {
            ref: 'root',
            childRefs: [],
            components: [{ ref: 'root-comp', type: 'abc' }],
            name: 'root',
            transform: defaultTransform,
            properties: {},
            transformConstraint: {},
          },
          testNode: {
            ref: 'testNode',
            childRefs: [],
            components: [
              { ref: 'test-comp-1', type: 'abc' },
              { ref: 'test-comp-2', type: 'def' },
            ],
            name: 'testNode',
            transform: defaultTransform,
            properties: {
              layerIds: [RESERVED_LAYER_ID],
            },
            transformConstraint: {},
          },
          deleteNode: {
            ref: 'deleteNode',
            parentRef: 'testNode',
            childRefs: [],
            components: [{ ref: 'delete-comp', type: 'def' }],
            name: 'deleteNode',
            transform: defaultTransform,
            properties: {
              layerIds: [RESERVED_LAYER_ID],
            },
            transformConstraint: {},
          },
        } as Record<string, ISceneNodeInternal>,
        componentNodeMap: {
          abc: { root: ['root-comp'], testNode: ['test-comp-1'] },
          def: { testNode: ['test-comp-2'], deleteNode: ['delete-comp'] },
        },
        unit: 'meter',
        version: '1.0',
        ruleMap: {},
      } as ISceneDocumentInternal;

      const nodes = [
        {
          ...document.nodeMap.testNode,
          name: 'testNode-new-name',
        },
        {
          ref: 'childNode',
          parentRef: 'testNode',
          childRefs: [],
          components: [{ ref: 'child-comp', type: 'def' }],
          name: 'childNode',
          transform: defaultTransform,
          properties: {
            layerIds: [RESERVED_LAYER_ID],
          },
          transformConstraint: {},
        },
        {
          ref: 'newRoot',
          components: [],
          childRefs: [],
          name: 'newRoot',
          transform: defaultTransform,
          properties: {
            layerIds: [RESERVED_LAYER_ID],
          },
          transformConstraint: {},
        },
      ];

      renderSceneNodes(nodes, document, logger);
      expect(document.nodeMap.deleteNode).toBeUndefined();
      expect(document.nodeMap.testNode.name).toEqual('testNode-new-name');
      expect(document.nodeMap.testNode.childRefs).toEqual(['childNode']);
      expect(document.nodeMap.childNode).toEqual(nodes[1]);
      expect(document.nodeMap.newRoot).toEqual(nodes[2]);
      expect(document.componentNodeMap).toEqual({
        abc: { root: ['root-comp'], testNode: ['test-comp-1'] },
        def: { testNode: ['test-comp-2'], childNode: ['child-comp'] },
      });
      expect(document.rootNodeRefs).toEqual(['root', 'testNode', 'newRoot']);
    });
  });

  describe('appendSceneNode', () => {
    const valid = {
      rootNodeRefs: [],
      nodeMap: { parentNode: { childRefs: [] } },
      componentNodeMap: {},
    };

    [undefined, valid].forEach((document) => {
      it(`should be able to appendSceneNode to a ${document ? 'valid' : 'undefined'} document.`, () => {
        const rootNode: Partial<ISceneNodeInternal> = {
          ref: 'rootNode',
          components: [
            { ref: 'root-comp-1', type: 'abc' },
            { ref: 'root-comp-2', type: 'abc' },
          ],
        };
        const childNode: Partial<ISceneNodeInternal> = {
          ref: 'childNode',
          parentRef: 'parentNode',
          components: [{ ref: 'child-comp', type: 'abc' }],
        };
        const componentNodeMap = {
          abc: {
            rootNode: ['root-comp-1', 'root-comp-2'],
            childNode: ['child-comp'],
          },
        };
        const draft: Partial<RootState> = {
          lastOperation: undefined,
          selectedSceneNodeRef: undefined,
          document: document as unknown as ISceneDocumentInternal,
        };

        appendSceneNode(draft as RootState, rootNode as ISceneNodeInternal);

        if (document) {
          expect(draft.selectedSceneNodeRef).toEqual(rootNode.ref);

          appendSceneNode(draft as RootState, childNode as ISceneNodeInternal);
          expect(draft.selectedSceneNodeRef).toEqual(childNode.ref);

          expect(draft.lastOperation!).toEqual('appendSceneNodeInternal');
          expect(draft.document?.rootNodeRefs).toContainEqual(rootNode.ref);
          expect(draft.document?.nodeMap.parentNode.childRefs).toContainEqual(childNode.ref);
          expect(draft.document?.nodeMap[rootNode.ref!]).toEqual(rootNode);
          expect(draft.document?.nodeMap[childNode.ref!]).toEqual(childNode);
          expect(draft.document?.componentNodeMap).toEqual(componentNodeMap);
        } else {
          expect(draft.lastOperation).toBeUndefined();
        }
      });
    });

    it(`should be able to appendSceneNode to a document with selecte node enabled.`, () => {
      const testNode: Partial<ISceneNodeInternal> = {
        ref: 'testNode',
        components: [{ ref: 'child-comp', type: 'abc' }],
      };
      const document = cloneDeep(valid) as unknown as ISceneDocumentInternal;
      const draft: Partial<RootState> = { lastOperation: undefined, document, selectedSceneNodeRef: undefined };

      appendSceneNode(draft as RootState, testNode as ISceneNodeInternal);

      expect(draft.lastOperation!).toEqual('appendSceneNodeInternal');
      expect(draft.selectedSceneNodeRef).toEqual(testNode.ref);
    });

    it(`should be able to appendSceneNode to a document with selecte node disabled.`, () => {
      const testNode: Partial<ISceneNodeInternal> = {
        ref: 'testNode',
        components: [{ ref: 'child-comp', type: 'abc' }],
      };
      const document = cloneDeep(valid) as unknown as ISceneDocumentInternal;
      const draft: Partial<RootState> = { lastOperation: undefined, document, selectedSceneNodeRef: 'random' };

      appendSceneNode(draft as RootState, testNode as ISceneNodeInternal, true);

      expect(draft.lastOperation!).toEqual('appendSceneNodeInternal');
      expect(draft.selectedSceneNodeRef).toEqual('random');
    });
  });

  describe('updateSceneNode', () => {
    const document = {
      nodeMap: {
        testNode1: { ref: 'testNode1', childRefs: [], parentRef: 'testNode2', properties: {} },
        testNode2: { ref: 'testNode2', childRefs: ['testNode1'], properties: {} },
        testNode3: { ref: 'testNode3', childRefs: [], properties: {} },
      },
      rootNodeRefs: ['testNode2', 'testNode3'],
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it(`should be able to updateSceneNode with different parent`, () => {
      // Arrange
      const draft = { document: cloneDeep(document), lastOperation: undefined };

      // Act
      updateSceneNode(draft as unknown as RootState, 'testNode1', { parentRef: 'testNode3' });

      // Assert
      expect(mergeDeep).toBeCalledTimes(1);
      expect(draft.document!).toEqual({
        nodeMap: {
          testNode1: expect.anything(), // mergeDeep is mock and not doing things, therefore not verify it
          testNode2: { ref: 'testNode2', childRefs: [], properties: {} },
          testNode3: { ref: 'testNode3', childRefs: ['testNode1'], properties: {} },
        },
        rootNodeRefs: ['testNode2', 'testNode3'],
      });
    });

    it(`should be able to updateSceneNode from child to root`, () => {
      // Arrange
      const draft = { document: cloneDeep(document), lastOperation: undefined };

      // Act
      updateSceneNode(draft as unknown as RootState, 'testNode1', { parentRef: undefined });

      // Assert
      expect(mergeDeep).toBeCalledTimes(1);
      expect(draft.document!).toEqual({
        nodeMap: {
          testNode1: expect.anything(), // mergeDeep is mock and not doing things, therefore not verify it
          testNode2: { ref: 'testNode2', childRefs: [], properties: {} },
          testNode3: { ref: 'testNode3', childRefs: [], properties: {} },
        },
        rootNodeRefs: ['testNode2', 'testNode3', 'testNode1'],
      });
    });

    it(`should be able to updateSceneNode from root to child`, () => {
      // Arrange
      const draft = { document: cloneDeep(document), lastOperation: undefined };

      // Act
      updateSceneNode(draft as unknown as RootState, 'testNode3', { parentRef: 'testNode2' });

      // Assert
      expect(mergeDeep).toBeCalledTimes(1);
      expect(draft.document!).toEqual({
        nodeMap: {
          testNode1: { ref: 'testNode1', childRefs: [], parentRef: 'testNode2', properties: {} },
          testNode2: { ref: 'testNode2', childRefs: ['testNode1', 'testNode3'], properties: {} },
          testNode3: expect.anything(), // mergeDeep is mock and not doing things, therefore not verify it
        },
        rootNodeRefs: ['testNode2'],
      });
    });
  });
});
