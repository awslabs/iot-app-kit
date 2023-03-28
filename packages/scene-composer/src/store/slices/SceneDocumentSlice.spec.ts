/* eslint-disable dot-notation, jest/no-conditional-expect */
import { cloneDeep } from 'lodash';

import serializationHelpers from '../helpers/serializationHelpers';
import interfaceHelpers from '../helpers/interfaceHelpers';
import { mergeDeep } from '../../utils/objectUtils';
import { KnownComponentType, KnownSceneProperty } from '../..';
import { containsMatchingEntityComponent } from '../../utils/dataBindingUtils';
import { IAnchorComponentInternal } from '..';
import { Component } from '../../models/SceneModels';

import { createSceneDocumentSlice } from './SceneDocumentSlice';

jest.mock('../../../src/utils/objectUtils', () => {
  return { mergeDeep: jest.fn() };
});

jest.mock('../../../src/utils/dataBindingUtils', () => {
  return { containsMatchingEntityComponent: jest.fn() };
});

describe('createSceneDocumentSlice', () => {
  const defaultDocumentSliceState = {
    nodeMap: {},
    ruleMap: {},
    componentNodeMap: {},
    rootNodeRefs: [],
    unit: 'meter',
    version: '1',
    specVersion: undefined,
    properties: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  [true, false].forEach((hasErrors) => {
    it(`should load a scene ${hasErrors ? 'with' : 'without'} errors and default document`, () => {
      // Arrange
      const deserializeResult = {
        document: hasErrors ? undefined : 'This is a mock document',
        errors: hasErrors ? [{ category: 'Error', message: 'test Error' }] : [],
      };
      jest.spyOn(serializationHelpers.document, 'deserialize').mockReturnValue(deserializeResult as any);
      const draft = { lastOperation: undefined, document: deserializeResult.document };
      const getReturn = { resetEditorState: jest.fn(), addMessages: jest.fn() };
      const get = jest.fn().mockReturnValue(getReturn); // fake out get call
      const set = jest.fn((callback) => callback(draft));
      const options = { disableMotionIndicator: true };

      // Act
      const { loadScene } = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed
      loadScene('sceneContent', options);

      // Assert
      expect(draft.lastOperation!).toEqual('loadScene');
      expect(get).toBeCalledTimes(hasErrors ? 2 : 1);
      expect(getReturn.resetEditorState).toBeCalled();
      if (hasErrors) {
        expect(getReturn.addMessages).toBeCalledWith([
          {
            category: 'Error',
            messageText: 'test Error',
            params: undefined,
          },
        ]);
      }
      expect(draft.document).toEqual(hasErrors ? defaultDocumentSliceState : deserializeResult.document);
      expect(jest.spyOn(serializationHelpers.document, 'deserialize')).toBeCalledWith('sceneContent', options);
    });
  });

  it('should load a scene and initialize view options correctly', () => {
    // Arrange
    const deserializeResult = {
      document: {
        ...defaultDocumentSliceState,
        properties: {
          [KnownSceneProperty.ComponentSettings]: {
            [KnownComponentType.DataOverlay]: {
              overlayPanelVisible: true,
            },
          },
        },
      },
      errors: [],
    };
    jest.spyOn(serializationHelpers.document, 'deserialize').mockReturnValue(deserializeResult);
    const draft = {
      lastOperation: undefined,
      document: deserializeResult.document,
      noHistoryStates: { componentVisibilities: {} },
    };
    const set = jest.fn((callback) => callback(draft));
    const get = jest.fn(); // fake out get call
    const getReturn = { resetEditorState: jest.fn(), addMessages: jest.fn() };
    get.mockReturnValue(getReturn);

    // Act
    const { loadScene } = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed
    loadScene('sceneContent');

    // Assert
    expect(draft.lastOperation!).toEqual('loadScene');
    expect(get).toBeCalledTimes(1);
    expect(draft.document).toEqual(deserializeResult.document);
    expect(draft.noHistoryStates.componentVisibilities[Component.DataOverlaySubType.OverlayPanel]).toEqual(true);
  });

  it(`should getSceneNodeByRef`, () => {
    // Arrange
    const document = { nodeMap: { testRef: 'node' } };
    const draft = { document };
    const get = jest.fn().mockReturnValue(draft); // fake out get call
    const set = jest.fn();

    // Act
    const { getSceneNodeByRef } = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed
    const found = getSceneNodeByRef('testRef');
    const notFound = getSceneNodeByRef('notHere');

    // Assert
    expect(found).toEqual('node');
    expect(notFound).toBeUndefined();
  });

  it(`should getSceneNodesByRefs`, () => {
    // Arrange
    const getSceneNodeByRef = jest.fn();
    const get = jest.fn().mockReturnValue({ getSceneNodeByRef }); // fake out get call
    const set = jest.fn();

    // Act
    const { getSceneNodesByRefs } = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed
    getSceneNodesByRefs(['testRef', 'notHere']);

    // Assert
    expect(getSceneNodeByRef).toBeCalledWith('testRef');
    expect(getSceneNodeByRef).toBeCalledWith('notHere');
  });

  describe('appendSceneNodeInternal', () => {
    // Arrange
    const valid = {
      selectedSceneNodeRef: undefined,
      rootNodeRefs: [],
      nodeMap: { parentNode: { childRefs: [] } },
      componentNodeMap: {},
    };
    const validWithPreExistingNode = {
      selectedSceneNodeRef: undefined,
      rootNodeRefs: [],
      nodeMap: { parentNode: { childRefs: [] }, testNode: { childRefs: [] } },
    };

    [undefined, valid].forEach((document) => {
      it(`should be able to appendSceneNodeInternal to a ${document ? 'valid' : 'undefined'} document.`, () => {
        const rootNode = {
          ref: 'rootNode',
          components: [
            { ref: 'root-comp-1', type: 'abc' },
            { ref: 'root-comp-2', type: 'abc' },
          ],
        };
        const childNode = {
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
        const draft = { lastOperation: undefined, selectedSceneNodeRef: undefined, document };
        const get = jest.fn().mockReturnValue({ document }); // fake out get call
        const set = jest.fn((callback) => callback(draft));

        // Act
        const { appendSceneNodeInternal } = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed
        appendSceneNodeInternal(rootNode as any);

        if (draft.document) {
          expect(draft.selectedSceneNodeRef).toEqual(rootNode.ref);

          appendSceneNodeInternal(childNode as any);
          expect(draft.selectedSceneNodeRef).toEqual(childNode.ref);

          // Assert
          expect(draft.lastOperation!).toEqual('appendSceneNodeInternal');
          expect(draft.document.rootNodeRefs).toContainEqual(rootNode.ref);
          expect(draft.document.nodeMap.parentNode.childRefs).toContainEqual(childNode.ref);
          expect(draft.document.nodeMap[rootNode.ref]).toEqual(rootNode);
          expect(draft.document.nodeMap[childNode.ref]).toEqual(childNode);
          expect(draft.document.componentNodeMap).toEqual(componentNodeMap);
          expect(get).toBeCalledTimes(2);
        } else {
          expect(get).toBeCalledTimes(1);
        }
      });
    });

    it(`should not be able to appendSceneNodeInternal to a document with an existing node.`, () => {
      const testNode = { ref: 'testNode' };
      const document = validWithPreExistingNode;
      const draft = { lastOperation: undefined, document };
      const get = jest.fn().mockReturnValue({ document }); // fake out get call
      const set = jest.fn((callback) => callback(draft));

      // Act
      const { appendSceneNodeInternal } = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed
      appendSceneNodeInternal(testNode as any);

      expect(get).toBeCalled();
      expect(draft.lastOperation!).toBeUndefined();
      expect(draft.document.rootNodeRefs).toHaveLength(0);
      expect(draft.document.selectedSceneNodeRef).toBeUndefined();
    });
  });

  describe('updateSceneNodeInternal', () => {
    const document = {
      nodeMap: {
        testNode1: { ref: 'testNode1', childRefs: [], parentRef: 'testNode2' },
        testNode2: { ref: 'testNode2', childRefs: ['testNode1'] },
        testNode3: { ref: 'testNode3', childRefs: [] },
      },
      rootNodeRefs: ['testNode2', 'testNode3'],
    };

    [true, false].forEach((isTransient) => {
      it(`should be able to updateSceneNodeInternal ${isTransient ? 'as' : 'as not'} transient`, () => {
        // Arrange
        const draft = { lastOperation: undefined, document: { nodeMap: { testNode: 'testNode' } } };
        const get = jest.fn().mockReturnValue(draft); // fake out get call
        const set = jest.fn((callback) => callback(draft));

        // Act
        const { updateSceneNodeInternal } = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed
        updateSceneNodeInternal('testNode', { test: 'test' } as any, isTransient);

        // Assert
        expect(mergeDeep).toBeCalledWith('testNode', { test: 'test' });
        expect(draft.lastOperation!).toEqual(
          isTransient ? 'updateSceneNodeInternalTransient' : 'updateSceneNodeInternal',
        );
      });
    });

    it(`should be able to updateSceneNodeInternal with different parent`, () => {
      // Arrange
      const draft = { document: cloneDeep(document), lastOperation: undefined };
      const get = jest.fn().mockReturnValue({ document }); // fake out get call
      const set = jest.fn((callback) => callback(draft));

      // Act
      const { updateSceneNodeInternal } = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed
      updateSceneNodeInternal('testNode1', { parentRef: 'testNode3' });

      // Assert
      expect(mergeDeep).toBeCalledTimes(1);
      expect(draft.lastOperation!).toEqual('updateSceneNodeInternal');
      expect(draft.document!).toEqual({
        nodeMap: {
          testNode1: expect.anything(), // mergeDeep is mock and not doing things, therefore not verify it
          testNode2: { ref: 'testNode2', childRefs: [] },
          testNode3: { ref: 'testNode3', childRefs: ['testNode1'] },
        },
        rootNodeRefs: ['testNode2', 'testNode3'],
      });
    });

    it(`should be able to updateSceneNodeInternal from child to root`, () => {
      // Arrange
      const draft = { document: cloneDeep(document), lastOperation: undefined };
      const get = jest.fn().mockReturnValue({ document }); // fake out get call
      const set = jest.fn((callback) => callback(draft));

      // Act
      const { updateSceneNodeInternal } = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed
      updateSceneNodeInternal('testNode1', { parentRef: undefined });

      // Assert
      expect(mergeDeep).toBeCalledTimes(1);
      expect(draft.lastOperation!).toEqual('updateSceneNodeInternal');
      expect(draft.document!).toEqual({
        nodeMap: {
          testNode1: expect.anything(), // mergeDeep is mock and not doing things, therefore not verify it
          testNode2: { ref: 'testNode2', childRefs: [] },
          testNode3: { ref: 'testNode3', childRefs: [] },
        },
        rootNodeRefs: ['testNode2', 'testNode3', 'testNode1'],
      });
    });

    it(`should be able to updateSceneNodeInternal from root to child`, () => {
      // Arrange
      const draft = { document: cloneDeep(document), lastOperation: undefined };
      const get = jest.fn().mockReturnValue({ document }); // fake out get call
      const set = jest.fn((callback) => callback(draft));

      // Act
      const { updateSceneNodeInternal } = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed
      updateSceneNodeInternal('testNode3', { parentRef: 'testNode2' });

      // Assert
      expect(mergeDeep).toBeCalledTimes(1);
      expect(draft.lastOperation!).toEqual('updateSceneNodeInternal');
      expect(draft.document!).toEqual({
        nodeMap: {
          testNode1: { ref: 'testNode1', childRefs: [], parentRef: 'testNode2' },
          testNode2: { ref: 'testNode2', childRefs: ['testNode1', 'testNode3'] },
          testNode3: expect.anything(), // mergeDeep is mock and not doing things, therefore not verify it
        },
        rootNodeRefs: ['testNode2'],
      });
    });
  });

  it(`should be able to updateDocumentInternal`, () => {
    // Arrange
    const draft = { lastOperation: undefined, document: { nodeMap: { testNode: 'testNode' } } };
    const get = jest.fn(); // fake out get call
    const set = jest.fn((callback) => callback(draft));

    // Act
    const { updateDocumentInternal } = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed
    updateDocumentInternal('partial' as any);

    // Assert
    expect(mergeDeep).toBeCalledWith(draft.document, 'partial');
    expect(draft.lastOperation!).toEqual('updateDocumentInternal');
  });

  it('should be able to appendSceneNode', () => {
    jest.spyOn(interfaceHelpers, 'createSceneNodeInternal').mockReturnValue('newNode' as any);
    const appendSceneNodeInternal = jest.fn();
    const get = jest.fn().mockReturnValue({ appendSceneNodeInternal }); // fake out get call
    const set = jest.fn();

    const node = { childRefs: [] };
    const nodeWithChildren = { childRefs: ['ref]'] };

    // Act
    const { appendSceneNode } = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed
    appendSceneNode(node);

    expect(get).toBeCalled();
    expect(interfaceHelpers.createSceneNodeInternal).toBeCalledWith(node);
    expect(appendSceneNodeInternal).toBeCalledWith('newNode');

    expect(() => appendSceneNode(nodeWithChildren)).toThrow();
  });

  it('should be able to updateSceneNode', () => {
    const updateSceneNodeInternal = jest.fn();
    const get = jest.fn().mockReturnValue({ updateSceneNodeInternal }); // fake out get call
    const set = jest.fn();

    // Act
    const { updateSceneNode } = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed
    updateSceneNode('ref', 'partial' as any);

    expect(get).toBeCalled();
    expect(updateSceneNodeInternal).toBeCalledWith('ref', 'partial');
  });

  describe('removeSceneNode', () => {
    it('should not be able to removeSceneNode when node not found', () => {
      const document = { nodeMap: { testNode: 'testNode' } };
      const get = jest.fn().mockReturnValue({ document }); // fake out get call
      const set = jest.fn();

      // Act
      const { removeSceneNode } = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed

      expect(() => removeSceneNode('someNode')).toThrow();
      expect(get).toBeCalled();
      expect(document.nodeMap.testNode).toBeDefined();
    });

    it('should be able to removeSceneNode', () => {
      const document = {
        rootNodeRefs: ['testNode'],
        nodeMap: {
          root: { ref: 'root', childRefs: [], components: [{ ref: 'root-comp', type: 'abc' }] },
          testNode: {
            ref: 'testNode',
            childRefs: ['childNode'],
            components: [
              { ref: 'test-comp-1', type: 'abc' },
              { ref: 'test-comp-2', type: 'def' },
            ],
          },
          childNode: {
            ref: 'childNode',
            parentRef: 'testNode',
            childRefs: ['grandchildNode'],
            components: [{ ref: 'child-comp', type: 'def' }],
          },
          grandchildNode: { ref: 'grandchildNode', parentRef: 'childNode', childRefs: [], components: [] },
        },
        componentNodeMap: {
          abc: { root: ['root-comp'], testNode: ['test-comp-1'] },
          def: { testNode: ['test-comp-2'], childNode: ['child-comp'] },
        },
      };
      const draft = { lastOperation: undefined, document };
      const get = jest.fn().mockReturnValue({ document }); // fake out get call
      const set = jest.fn((callback) => callback(draft));

      // Act
      const { removeSceneNode } = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed

      removeSceneNode('testNode');
      expect(get).toBeCalled();
      expect(draft.lastOperation!).toEqual('removeSceneNode');
      expect(draft.document.nodeMap.testNode).toBeUndefined();
      expect(draft.document.nodeMap.childNode).toBeUndefined();
      expect(draft.document.nodeMap.grandchildNode).toBeUndefined();
      expect(draft.document.componentNodeMap).toEqual({ abc: { root: ['root-comp'] }, def: {} });
    });
  });

  it('should be able to listSceneRuleMapIds', () => {
    const statements = { testRule: { expression: 0, target: 'target' } };
    const document = { ruleMap: { rule1: { statements }, rule2: { statements } } };
    const get = jest.fn().mockReturnValue({ document }); // fake out get call
    const set = jest.fn();

    // Act
    const { listSceneRuleMapIds } = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed
    const ruleIds = listSceneRuleMapIds();

    expect(get).toBeCalled();
    expect(ruleIds).toEqual(['rule1', 'rule2']);
  });

  it('should be able to getSceneRuleByMapId', () => {
    const statements = { testRule: { expression: 0, target: 'target' } };
    const document = { ruleMap: { rule1: { statements }, rule2: { statements } } };
    const get = jest.fn().mockReturnValue({ document }); // fake out get call
    const set = jest.fn();

    // Act
    const { getSceneRuleMapById } = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed
    const rule = getSceneRuleMapById('rule1');

    expect(get).toBeCalled();
    expect(rule).toEqual(document.ruleMap.rule1);
  });

  it('should not be able to getSceneRuleByMapId of undefined', () => {
    const statements = { testRule: { expression: 0, target: 'target' } };
    const document = { ruleMap: { rule1: { statements }, rule2: { statements } } };
    const get = jest.fn().mockReturnValue({ document }); // fake out get call
    const set = jest.fn();

    // Act
    const { getSceneRuleMapById } = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed
    const rule = getSceneRuleMapById(undefined);

    expect(get).not.toBeCalled();
  });

  it('should be able to updateSceneRuleByMapId', () => {
    const statements = { testRule: { expression: 0, target: 'target' } };
    const document = { ruleMap: { rule1: { statements }, rule2: { statements } } };
    const draft = { lastOperation: undefined, document };
    const get = jest.fn(); // fake out get call
    const set = jest.fn((callback) => callback(draft));

    // Act
    const { updateSceneRuleMapById } = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed
    updateSceneRuleMapById('rule1', { statements: { testRule: { expression: 1, target: 'target' } } } as any);

    expect(draft.lastOperation!).toEqual('updateSceneRuleMapById');
    expect(draft.document.ruleMap.rule1.statements.testRule.expression).toEqual(1);
  });

  it('should be able to removeSceneRuleByMapId', () => {
    const statements = { testRule: { expression: 0, target: 'target' } };
    const document = { ruleMap: { rule1: { statements }, rule2: { statements } } };
    const draft = { lastOperation: undefined, document };
    const get = jest.fn(); // fake out get call
    const set = jest.fn((callback) => callback(draft));

    // Act
    const { removeSceneRuleMapById } = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed
    removeSceneRuleMapById('rule1');

    expect(draft.lastOperation!).toEqual('removeSceneRuleMapById');
    expect(draft.document.ruleMap.rule1).toBeUndefined();
  });

  it('should be able to addComponentInternal', () => {
    const document = { nodeMap: { testNode: { components: [] } }, componentNodeMap: {} };
    const draft = { lastOperation: undefined, document };
    const getSceneNodeByRef = jest.fn().mockReturnValue(document.nodeMap.testNode);
    const get = jest.fn().mockReturnValue({ getSceneNodeByRef }); // fake out get call
    const set = jest.fn((callback) => callback(draft));
    const comp = { ref: 'comp-1', type: 'abc' };

    // Act
    const { addComponentInternal } = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed
    addComponentInternal('testNode', comp);

    expect(draft.lastOperation!).toEqual('addComponentInternal');
    expect(get).toBeCalled();
    expect(getSceneNodeByRef).toBeCalledWith('testNode');
    expect(draft.document.nodeMap.testNode.components).toEqual([comp]);
    expect(draft.document.componentNodeMap['abc']['testNode']).toEqual([comp.ref]);
  });

  it('should not be able to addComponentInternal if not found', () => {
    const document = { nodeMap: { testNode: { components: [] } } };
    const draft = { lastOperation: undefined, document };
    const getSceneNodeByRef = jest.fn();
    const get = jest.fn().mockReturnValue({ getSceneNodeByRef }); // fake out get call
    const set = jest.fn((callback) => callback(draft));

    // Act
    const { addComponentInternal } = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed
    addComponentInternal('notHere', 'component' as any);

    expect(draft.lastOperation!).toBeUndefined();
    expect(get).toBeCalled();
    expect(getSceneNodeByRef).toBeCalledWith('notHere');
  });

  describe('updateComponentInternal', () => {
    [true, false].forEach((replace) => {
      it(`should be able to updateComponentInternal ${replace ? 'with' : 'without'} replacing`, () => {
        const document = {
          nodeMap: { testNode: { components: [{ ref: 'component1', data: 'original' }] } },
        };
        const draft = { lastOperation: undefined, document };
        const getSceneNodeByRef = jest.fn().mockReturnValue(document.nodeMap.testNode);
        const get = jest.fn().mockReturnValue({ getSceneNodeByRef }); // fake out get call
        const set = jest.fn((callback) => callback(draft));

        // Act
        const { updateComponentInternal } = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed
        updateComponentInternal('testNode', { ref: 'component1', data: 'updated' } as any, replace);

        expect(draft.lastOperation!).toEqual('updateComponentInternal');
        expect(get).toBeCalled();
        expect(getSceneNodeByRef).toBeCalledWith('testNode');

        if (replace) {
          expect(draft.document.nodeMap.testNode.components[0].data).toEqual('updated');
        } else {
          expect(mergeDeep).toBeCalled();
        }
      });
    });

    it(`should not be able to updateComponentInternal with incorrect data`, () => {
      const document = {
        nodeMap: { testNode: { components: [{ ref: 'component1', data: 'original' }] } },
      };
      const draft = { lastOperation: undefined, document };
      const getSceneNodeByRef = jest.fn().mockImplementation((ref) => {
        if (ref === 'testNode') {
          return document.nodeMap.testNode;
        }
        return undefined;
      });
      const get = jest.fn().mockReturnValue({ getSceneNodeByRef }); // fake out get call
      const set = jest.fn((callback) => callback(draft));

      // Act
      const { updateComponentInternal } = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed
      expect(() => updateComponentInternal('testNode', { data: 'updated' } as any, false)).toThrow();
      expect(() => updateComponentInternal('notHere', { ref: 'component1', data: 'updated' } as any, false)).toThrow();
      expect(() => updateComponentInternal('testNode', { ref: 'notHere', data: 'updated' } as any, false)).toThrow();
    });
  });

  it(`should be able to removeComponent`, () => {
    const document = {
      nodeMap: { testNode: { components: [{ ref: 'component1', data: 'original', type: 'abc' }] } },
      componentNodeMap: { abc: { testNode: ['component1'] } },
    };
    const draft = { lastOperation: undefined, document };
    const getSceneNodeByRef = jest.fn().mockReturnValue(document.nodeMap.testNode);
    const get = jest.fn().mockReturnValue({ getSceneNodeByRef }); // fake out get call
    const set = jest.fn((callback) => callback(draft));

    // Act
    const { removeComponent } = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed
    removeComponent('testNode', 'component1');

    expect(draft.lastOperation!).toEqual('removeComponent');
    expect(get).toBeCalled();
    expect(getSceneNodeByRef).toBeCalledWith('testNode');

    expect(draft.document.nodeMap.testNode.components).toHaveLength(0);
    expect(draft.document.componentNodeMap['abc']).toEqual({});
  });

  it(`should do nothing to removeComponent if unnecessary`, () => {
    const document = {
      nodeMap: { testNode: { components: [{ ref: 'component1', data: 'original' }] } },
    };
    const draft = { lastOperation: undefined, document };
    const getSceneNodeByRef = jest.fn().mockImplementation((ref) => {
      if (ref === 'testNode') {
        return document.nodeMap.testNode;
      }
      return undefined;
    });
    const get = jest.fn().mockReturnValue({ getSceneNodeByRef }); // fake out get call
    const set = jest.fn((callback) => callback(draft));

    // Act
    const { removeComponent } = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed
    removeComponent('notHere', 'component1');
    removeComponent('testNode', 'notHere');

    expect(get).toBeCalledTimes(2);

    expect(draft.document.nodeMap.testNode.components).toHaveLength(1);
  });

  it('should be able to getSceneProperty', () => {
    const document = {
      properties: { baseUrl: 'baseUrlValue' },
    };
    const get = jest.fn().mockReturnValue({ document }); // fake out get call
    const set = jest.fn();

    // Act
    const { getSceneProperty } = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed
    const result = getSceneProperty(KnownSceneProperty.BaseUrl);
    const result2 = getSceneProperty(KnownSceneProperty.EnvironmentPreset, 'default');

    expect(get).toBeCalledTimes(2);
    expect(result).toEqual(document.properties.baseUrl);
    expect(result2).toEqual('default');
  });

  it('should return default with getSceneProperty if no properties set', () => {
    const document = {};
    const get = jest.fn().mockReturnValue({ document }); // fake out get call
    const set = jest.fn();

    // Act
    const { getSceneProperty } = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed
    const result = getSceneProperty(KnownSceneProperty.BaseUrl, 'default');

    expect(get).toBeCalled();
    expect(result).toEqual('default');
  });

  [{}, { properties: { baseUrl: 'original' } }].forEach((document) => {
    it(`should be able to setSceneProperty ${document.properties ? 'with' : 'without'} set properties`, () => {
      const draft = { lastOperation: undefined, document };
      const get = jest.fn(); // fake out get call
      const set = jest.fn((callback) => callback(draft));

      // Act
      const { setSceneProperty } = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed
      setSceneProperty(KnownSceneProperty.BaseUrl, 'setValue');

      expect(draft.lastOperation!).toEqual('setSceneProperty');
      expect(draft.document.properties!.baseUrl).toEqual('setValue');
    });
  });

  describe('clearTemplatizedDataBindings', () => {
    [KnownComponentType.Tag, KnownComponentType.ModelShader].forEach((componentType) => {
      const componentTypeName = KnownComponentType[componentType];
      it(`should remove data binding for ${componentTypeName}`, () => {
        const component = {
          type: componentType,
          valueDataBinding: { dataBindingContext: { key1: '${value1}', key2: 'value2' } },
        } as IAnchorComponentInternal;
        const document = { nodeMap: { testNode: { ref: 'testRef', components: [component] } } };
        const draft = { lastOperation: undefined, document };
        const get = jest.fn().mockReturnValue({ document }); // fake out get call
        const set = jest.fn((callback) => callback(draft));

        // Act
        const sceneDocumentSlice = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed
        sceneDocumentSlice.clearTemplatizedDataBindings();

        expect(
          (draft.document.nodeMap.testNode.components[0] as IAnchorComponentInternal).valueDataBinding
            ?.dataBindingContext,
        ).toEqual({});
      });
      it("should do nothing if data binding context doesn't use data binding template", () => {
        const component = {
          type: componentType,
          valueDataBinding: { dataBindingContext: { key1: 'value1', key2: 'value2' } },
        } as IAnchorComponentInternal;
        const document = { nodeMap: { testNode: { ref: 'testRef', components: [component] } } };
        const draft = { lastOperation: undefined, document };
        const get = jest.fn().mockReturnValue({ document }); // fake out get call
        const set = jest.fn((callback) => callback(draft));

        // Act
        const sceneDocumentSlice = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed
        sceneDocumentSlice.clearTemplatizedDataBindings();

        expect(
          (draft.document.nodeMap.testNode.components[0] as IAnchorComponentInternal).valueDataBinding
            ?.dataBindingContext,
        ).toEqual({ key1: 'value1', key2: 'value2' });
      });

      it(`should do nothing for ${componentTypeName} if data binding is empty`, () => {
        const component = {
          type: componentType,
        } as IAnchorComponentInternal;
        const document = { nodeMap: { testNode: { ref: 'testRef', components: [component] } } };
        const draft = { lastOperation: undefined, document };
        const get = jest.fn().mockReturnValue({ document }); // fake out get call
        const set = jest.fn((callback) => callback(draft));

        // Act
        const sceneDocumentSlice = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed
        sceneDocumentSlice.clearTemplatizedDataBindings();

        expect((draft.document.nodeMap.testNode.components[0] as IAnchorComponentInternal).valueDataBinding).toBe(
          undefined,
        );
      });
    });
  });

  it('should be able to getComponentRefByType', () => {
    const document = {
      componentNodeMap: { abc: { node: ['comp'] } },
    };
    const get = jest.fn();
    const set = jest.fn();
    get.mockReturnValueOnce({ document: { componentNodeMap: {} } });
    get.mockReturnValueOnce({ document });
    get.mockReturnValueOnce({ document });

    // Act
    const { getComponentRefByType } = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed
    const result1 = getComponentRefByType('abc' as any); // empty map
    const result2 = getComponentRefByType('abc' as any); // type exists
    const result3 = getComponentRefByType('def' as any); // type undefined

    expect(get).toBeCalledTimes(3);
    expect(result1).toEqual({});
    expect(result2).toEqual(document.componentNodeMap['abc']);
    expect(result3).toEqual({});
  });

  describe('findSceneNodeByRef', () => {
    const tagComponent = { type: KnownComponentType.Tag };
    const modelShaderComponent = { type: KnownComponentType.ModelShader };
    const otherComponent = { type: KnownComponentType.ModelRef };
    const none = {};
    [tagComponent, modelShaderComponent, otherComponent, none].forEach((component, index) => {
      it(`should be able to findSceneNodeByRef of ${
        ['tagComponent', 'modelShaderComponent', 'otherComponent', 'none'][index]
      }`, () => {
        (containsMatchingEntityComponent as jest.Mock).mockReturnValue(true);
        const document = { nodeMap: { testNode: { ref: 'testRef', components: [component] } } };
        const get = jest.fn().mockReturnValue({ document }); // fake out get call
        const set = jest.fn();

        // Act
        const { findSceneNodeRefBy } = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed
        const result = findSceneNodeRefBy('whatever');

        if (index <= 1) {
          expect(containsMatchingEntityComponent).toBeCalledWith('whatever', undefined);
          expect(result).toEqual(['testRef']);
        } else {
          expect(result).toEqual([]);
        }
      });
    });

    it('should not return ref when no matching for the component type filter', () => {
      (containsMatchingEntityComponent as jest.Mock).mockReturnValue(true);
      const document = {
        nodeMap: {
          testTagNode: { ref: 'tagRef', components: [tagComponent] },
          testShaderNode: { ref: 'shaderRef', components: [modelShaderComponent] },
        },
      };
      const get = jest.fn().mockReturnValue({ document }); // fake out get call
      const set = jest.fn();

      const { findSceneNodeRefBy } = createSceneDocumentSlice(set, get); // api is never used in the function, so it's not needed

      const result1 = findSceneNodeRefBy('whatever', [KnownComponentType.Tag]);
      expect(containsMatchingEntityComponent).toBeCalledWith('whatever', undefined);
      expect(result1).toEqual(['tagRef']);

      const result2 = findSceneNodeRefBy('whatever', [KnownComponentType.MotionIndicator]);
      expect(result2).toEqual([]);

      const result3 = findSceneNodeRefBy('whatever');
      expect(result3).toEqual(['tagRef', 'shaderRef']);
    });
  });
});
