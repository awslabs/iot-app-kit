import { ISceneDocumentInternal, ISceneNodeInternal } from '../..';
import DebugLogger from '../../../logger/DebugLogger';
import { ITransformInternal } from '../../internalInterfaces';
import { removeNode, renderSceneNodesFromLayers } from '../sceneDocumentHelpers';

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

      removeNode(document, 'testNode', logger);
      expect(document.nodeMap.testNode).toBeUndefined();
      expect(document.nodeMap.childNode).toBeUndefined();
      expect(document.nodeMap.grandchildNode).toBeUndefined();
      expect(document.componentNodeMap).toEqual({ abc: { root: ['root-comp'] }, def: {} });
    });
  });

  describe('renderSceneNodesFromLayers', () => {
    it('should be able to renderSceneNodesFromLayers correctly', () => {
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
              layerIds: ['testLayer'],
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
              layerIds: ['testLayer'],
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
            layerIds: ['testLayer'],
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
            layerIds: ['testLayer'],
          },
          transformConstraint: {},
        },
      ];

      renderSceneNodesFromLayers(nodes, 'testLayer', document, logger);
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
});
