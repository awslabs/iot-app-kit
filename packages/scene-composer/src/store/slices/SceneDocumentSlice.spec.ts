import { ComponentUpdateType } from '@aws-sdk/client-iottwinmaker';
import flushPromises from 'flush-promises';
import cloneDeep from 'lodash-es/cloneDeep';
import { Object3D } from 'three';
import { type IAnchorComponentInternal, type IDataOverlayComponentInternal, type ISceneNodeInternal } from '..';
import { COMPOSER_FEATURES, type IErrorDetails, KnownComponentType, KnownSceneProperty } from '../..';
import { setFeatureConfig, setOnFlashMessage } from '../../common/GlobalSettings';
import { RESERVED_LAYER_ID } from '../../common/entityModelConstants';
import { Component } from '../../models/SceneModels';
import { containsMatchingEntityComponent } from '../../utils/dataBindingUtils';
import { createNodeEntity } from '../../utils/entityModelUtils/createNodeEntity';
import { deleteNodeEntity } from '../../utils/entityModelUtils/deleteNodeEntity';
import { updateSceneRootEntity } from '../../utils/entityModelUtils/sceneUtils';
import { updateEntity } from '../../utils/entityModelUtils/updateNodeEntity';
import { mergeDeep } from '../../utils/objectUtils';
import interfaceHelpers from '../helpers/interfaceHelpers';
import { appendSceneNode } from '../helpers/sceneDocumentHelpers';
import serializationHelpers from '../helpers/serializationHelpers';
import { DisplayMessageCategory, SceneNodeRuntimeProperty } from '../internalInterfaces';
import { createSceneDocumentSlice } from './SceneDocumentSlice';

vi.mock('../../../src/utils/objectUtils', () => {
  return { mergeDeep: vi.fn() };
});

vi.mock('../../../src/utils/dataBindingUtils', () => {
  return { containsMatchingEntityComponent: vi.fn() };
});

vi.mock('../../../src/utils/entityModelUtils/updateNodeEntity');

vi.mock('../../../src/utils/entityModelUtils/deleteNodeEntity');

vi.mock('../../../src/utils/entityModelUtils/createNodeEntity');

vi.mock('../../../src/utils/entityModelUtils/sceneUtils', async () => {
  return {
    ...(await vi.importActual('../../../src/utils/entityModelUtils/sceneUtils')),
    updateSceneRootEntity: vi.fn(),
  };
});

vi.mock('../helpers/sceneDocumentHelpers', async () => {
  return { ...(await vi.importActual('../helpers/sceneDocumentHelpers')), appendSceneNode: vi.fn() };
});

vi.mock('../helpers/serializationHelpers', () => ({
  default: {
    document: {
      deserialize: vi.fn(),
    },
  },
}));

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
    vi.clearAllMocks();

    setFeatureConfig({});
  });

  [true, false].forEach((hasErrors) => {
    it(`should load a scene ${hasErrors ? 'with' : 'without'} errors and default document`, () => {
      // Arrange
      const deserializeResult = {
        document: hasErrors ? undefined : defaultDocumentSliceState,
        errors: hasErrors ? [{ category: 'Error', message: 'test Error' } as unknown as IErrorDetails] : [],
      };
      (serializationHelpers.document.deserialize as vi.Mock).mockReturnValue(deserializeResult);
      const draft = { lastOperation: undefined, document: deserializeResult.document, sceneLoaded: false };
      const getReturn = { resetEditorState: vi.fn(), addMessages: vi.fn() };
      const get = vi.fn().mockReturnValue(getReturn); // fake out get call
      const set = vi.fn((callback) => callback(draft));
      const options = { disableMotionIndicator: true };

      // Act
      const { loadScene } = createSceneDocumentSlice(set, get);
      loadScene('sceneContent', options);

      // Assert
      expect(draft.lastOperation!).toEqual('loadScene');
      expect(draft.sceneLoaded).toBeTruthy();
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
      expect(serializationHelpers.document.deserialize).toBeCalledWith('sceneContent', options);
    });
  });

  it('should load a scene with parsed document', () => {
    const draft = { lastOperation: undefined, document: undefined, sceneLoaded: false };
    const getReturn = { resetEditorState: vi.fn(), addMessages: vi.fn() };
    const get = vi.fn().mockReturnValue(getReturn); // fake out get call
    const set = vi.fn((callback) => callback(draft));

    const { loadScene } = createSceneDocumentSlice(set, get);
    loadScene(defaultDocumentSliceState);

    expect(draft.lastOperation!).toEqual('loadScene');
    expect(draft.sceneLoaded).toBeTruthy();
    expect(get).toBeCalledTimes(1);
    expect(getReturn.resetEditorState).toBeCalled();
    expect(draft.document).toEqual(defaultDocumentSliceState);
    expect(serializationHelpers.document.deserialize).not.toBeCalled();
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
    (serializationHelpers.document.deserialize as vi.Mock).mockReturnValue(deserializeResult);
    const draft = {
      lastOperation: undefined,
      document: deserializeResult.document,
      noHistoryStates: { componentVisibilities: {} },
    };
    const set = vi.fn((callback) => callback(draft));
    const get = vi.fn(); // fake out get call
    const getReturn = { resetEditorState: vi.fn(), addMessages: vi.fn() };
    get.mockReturnValue(getReturn);

    // Act
    const { loadScene } = createSceneDocumentSlice(set, get);
    loadScene('sceneContent');

    // Assert
    expect(draft.lastOperation!).toEqual('loadScene');
    expect(get).toBeCalledTimes(1);
    expect(draft.document).toEqual(deserializeResult.document);
    expect(draft.noHistoryStates.componentVisibilities[Component.DataOverlaySubType.OverlayPanel]).toEqual(true);
  });

  it('should load a scene and not set sceneLoaded flag for dynamic scene when feature enabled', () => {
    // Arrange
    const deserializeResult = {
      document: {
        ...defaultDocumentSliceState,
        properties: {
          [KnownSceneProperty.SceneRootEntityId]: 'root-id',
        },
      },
      errors: [],
    };
    (serializationHelpers.document.deserialize as vi.Mock).mockReturnValue(deserializeResult);
    const draft = {
      lastOperation: undefined,
      sceneLoaded: false,
    };
    const set = vi.fn((callback) => callback(draft));
    const get = vi.fn(); // fake out get call
    const getReturn = { resetEditorState: vi.fn(), addMessages: vi.fn() };
    get.mockReturnValue(getReturn);
    setFeatureConfig({ [COMPOSER_FEATURES.DynamicScene]: true });

    // Act
    const { loadScene } = createSceneDocumentSlice(set, get);
    loadScene('sceneContent');

    // Assert
    expect(draft.lastOperation!).toEqual('loadScene');
    expect(draft.sceneLoaded).toBeFalsy();
  });

  it('should load a scene and set sceneLoaded flag to true for dynamic scene when feature disabled', () => {
    // Arrange
    const deserializeResult = {
      document: {
        ...defaultDocumentSliceState,
        properties: {
          [KnownSceneProperty.SceneRootEntityId]: 'root-id',
        },
      },
      errors: [],
    };
    (serializationHelpers.document.deserialize as vi.Mock).mockReturnValue(deserializeResult);
    const draft = {
      lastOperation: undefined,
      sceneLoaded: false,
    };
    const set = vi.fn((callback) => callback(draft));
    const get = vi.fn(); // fake out get call
    const getReturn = { resetEditorState: vi.fn(), addMessages: vi.fn() };
    get.mockReturnValue(getReturn);
    setFeatureConfig({ [COMPOSER_FEATURES.DynamicScene]: false });

    // Act
    const { loadScene } = createSceneDocumentSlice(set, get);
    loadScene('sceneContent');

    // Assert
    expect(draft.lastOperation!).toEqual('loadScene');
    expect(draft.sceneLoaded).toBeTruthy();
  });

  it(`should getSceneNodeByRef`, () => {
    // Arrange
    const document = { nodeMap: { testRef: 'node' } };
    const draft = { document };
    const get = vi.fn().mockReturnValue(draft); // fake out get call
    const set = vi.fn();

    // Act
    const { getSceneNodeByRef } = createSceneDocumentSlice(set, get);
    const found = getSceneNodeByRef('testRef');
    const notFound = getSceneNodeByRef('notHere');

    // Assert
    expect(found).toEqual('node');
    expect(notFound).toBeUndefined();
  });

  it(`should getSceneNodesByRefs`, () => {
    // Arrange
    const getSceneNodeByRef = vi.fn();
    const get = vi.fn().mockReturnValue({ getSceneNodeByRef }); // fake out get call
    const set = vi.fn();

    // Act
    const { getSceneNodesByRefs } = createSceneDocumentSlice(set, get);
    getSceneNodesByRefs(['testRef', 'notHere']);

    // Assert
    expect(getSceneNodeByRef).toBeCalledWith('testRef');
    expect(getSceneNodeByRef).toBeCalledWith('notHere');
  });

  describe('appendSceneNodeInternal', () => {
    // Arrange
    const valid = {
      rootNodeRefs: [],
      nodeMap: { parentNode: { childRefs: [] } },
      componentNodeMap: {},
    };
    const validWithPreExistingNode = {
      rootNodeRefs: [],
      nodeMap: { parentNode: { childRefs: [] }, testNode: { childRefs: [] } },
    };

    beforeEach(() => {
      vi.clearAllMocks();

      setFeatureConfig({ [COMPOSER_FEATURES.DynamicScene]: false });
    });

    it('should not be able to appendSceneNodeInternal to an undefined document', () => {
      const testNode: Partial<ISceneNodeInternal> = { ref: 'testNode' };
      const draft = { lastOperation: undefined, document: undefined, selectedSceneNodeRef: undefined };
      const get = vi.fn().mockReturnValue({ document: undefined }); // fake out get call
      const set = vi.fn((callback) => callback(draft));

      // Act
      const { appendSceneNodeInternal } = createSceneDocumentSlice(set, get);
      appendSceneNodeInternal(testNode as ISceneNodeInternal);

      expect(get).toBeCalled();
      expect(appendSceneNode as vi.Mock).not.toBeCalled();
    });

    it('should be able to appendSceneNodeInternal to static scene', () => {
      const testNode: Partial<ISceneNodeInternal> = { ref: 'testNode' };
      const document = cloneDeep(valid);
      const draft = { lastOperation: undefined, document, selectedSceneNodeRef: undefined };
      const get = vi.fn().mockReturnValue({ document }); // fake out get call
      const set = vi.fn((callback) => callback(draft));

      // Act
      const { appendSceneNodeInternal } = createSceneDocumentSlice(set, get);
      appendSceneNodeInternal(testNode as ISceneNodeInternal);

      expect(get).toBeCalled();
      expect(appendSceneNode as vi.Mock).toBeCalledTimes(1);
      expect(appendSceneNode as vi.Mock).toBeCalledWith(draft, testNode, undefined);
    });

    it(`should not be able to appendSceneNodeInternal to a document with an existing node.`, () => {
      const testNode: Partial<ISceneNodeInternal> = { ref: 'testNode' };
      const document = cloneDeep(validWithPreExistingNode);
      const draft = { lastOperation: undefined, document, selectedSceneNodeRef: undefined };
      const get = vi.fn().mockReturnValue({ document }); // fake out get call
      const set = vi.fn((callback) => callback(draft));

      // Act
      const { appendSceneNodeInternal } = createSceneDocumentSlice(set, get);
      appendSceneNodeInternal(testNode as ISceneNodeInternal);

      expect(get).toBeCalled();
      expect(appendSceneNode as vi.Mock).not.toBeCalled();
    });

    it('should be able to appendSceneNodeInternal to a dynamic scene', async () => {
      setFeatureConfig({ [COMPOSER_FEATURES.DynamicScene]: true });

      const testNode: Partial<ISceneNodeInternal> = { ref: 'testNode', properties: {} };
      const document = {
        ...cloneDeep(valid),
        properties: {
          [KnownSceneProperty.SceneRootEntityId]: 'scene-root',
        },
      };
      const draft = { lastOperation: undefined, document, selectedSceneNodeRef: undefined };
      const appendSceneNodeInternalMock = vi.fn();
      const get = vi.fn().mockReturnValue({
        document,
        appendSceneNodeInternal: appendSceneNodeInternalMock,
        getObject3DBySceneNodeRef: vi.fn(),
      }); // fake out get call
      const set = vi.fn((callback) => callback(draft));
      (createNodeEntity as vi.Mock).mockResolvedValue(null);

      // Act
      const { appendSceneNodeInternal } = createSceneDocumentSlice(set, get);
      appendSceneNodeInternal(testNode as ISceneNodeInternal);

      await flushPromises();

      expect(get).toBeCalledTimes(2);
      expect(createNodeEntity as vi.Mock).toBeCalledTimes(1);
      expect(createNodeEntity as vi.Mock).toBeCalledWith(testNode, 'scene-root');
      expect(appendSceneNodeInternalMock).toBeCalledTimes(1);
      expect(appendSceneNodeInternalMock).toBeCalledWith(
        { ...testNode, properties: { [SceneNodeRuntimeProperty.LayerIds]: [RESERVED_LAYER_ID] } },
        undefined,
      );
      expect(appendSceneNode as vi.Mock).not.toBeCalled();
    });

    it('should be able to appendSceneNodeInternal to a dynamic scene not reparented to root', async () => {
      setFeatureConfig({ [COMPOSER_FEATURES.DynamicScene]: true });

      const testNode: Partial<ISceneNodeInternal> = {
        ref: 'testNode',
        properties: {},
        parentRef: 'parentNode',
        components: [],
        transform: {
          rotation: [0, 0, 0],
          position: [0, 0, 0],
          scale: [1, 1, 1],
        },
      };
      const document = {
        ...cloneDeep(valid),
        properties: {
          [KnownSceneProperty.SceneRootEntityId]: 'scene-root',
        },
      };
      const draft = { lastOperation: undefined, document, selectedSceneNodeRef: undefined };
      const appendSceneNodeInternalMock = vi.fn();
      const getObject3DBySceneNodeRefMock = vi.fn();
      const parent = new Object3D();
      parent.position.set(2, 3, 4);
      parent.scale.set(8, 8, 9);
      parent.updateWorldMatrix(true, true);
      getObject3DBySceneNodeRefMock.mockReturnValue(parent);
      const get = vi.fn().mockReturnValue({
        document,
        appendSceneNodeInternal: appendSceneNodeInternalMock,
        getObject3DBySceneNodeRef: getObject3DBySceneNodeRefMock,
      }); // fake out get call
      const set = vi.fn((callback) => callback(draft));
      (createNodeEntity as vi.Mock).mockResolvedValue(null);

      // Act
      const { appendSceneNodeInternal } = createSceneDocumentSlice(set, get);
      appendSceneNodeInternal(testNode as ISceneNodeInternal);

      await flushPromises();

      expect(get).toBeCalledTimes(2);
      expect(createNodeEntity as vi.Mock).toBeCalledTimes(1);
      expect(createNodeEntity as vi.Mock).toBeCalledWith(
        {
          ...testNode,
        },
        'parentNode',
      );
      expect(appendSceneNodeInternalMock).toBeCalledTimes(1);
      expect(appendSceneNodeInternalMock).toBeCalledWith(
        { ...testNode, properties: { [SceneNodeRuntimeProperty.LayerIds]: [RESERVED_LAYER_ID] } },
        undefined,
      );
      expect(appendSceneNode as vi.Mock).not.toBeCalled();
    });

    it('should be able to appendSceneNodeInternal to a dynamic scene and keep parentRef for sub model ref node', async () => {
      setFeatureConfig({ [COMPOSER_FEATURES.DynamicScene]: true });

      const testNode: Partial<ISceneNodeInternal> = {
        ref: 'testNode',
        properties: {},
        parentRef: 'parentNode',
        components: [{ type: KnownComponentType.SubModelRef, ref: 'sub' }],
        transform: {
          rotation: [0, 0, 0],
          position: [0, 0, 0],
          scale: [1, 1, 1],
        },
      };
      const document = {
        ...cloneDeep(valid),
        properties: {
          [KnownSceneProperty.SceneRootEntityId]: 'scene-root',
        },
      };
      const draft = { lastOperation: undefined, document, selectedSceneNodeRef: undefined };
      const appendSceneNodeInternalMock = vi.fn();
      const getObject3DBySceneNodeRefMock = vi.fn();
      const parent = new Object3D();
      parent.position.set(2, 3, 4);
      parent.scale.set(8, 8, 9);
      parent.updateWorldMatrix(true, true);
      getObject3DBySceneNodeRefMock.mockReturnValue(parent);
      const get = vi.fn().mockReturnValue({
        document,
        appendSceneNodeInternal: appendSceneNodeInternalMock,
        getObject3DBySceneNodeRef: getObject3DBySceneNodeRefMock,
      }); // fake out get call
      const set = vi.fn((callback) => callback(draft));
      (createNodeEntity as vi.Mock).mockResolvedValue(null);

      // Act
      const { appendSceneNodeInternal } = createSceneDocumentSlice(set, get);
      appendSceneNodeInternal(testNode as ISceneNodeInternal);

      await flushPromises();

      expect(get).toBeCalledTimes(2);
      expect(createNodeEntity as vi.Mock).toBeCalledTimes(1);
      expect(createNodeEntity as vi.Mock).toBeCalledWith(
        {
          ...testNode,
          parentRef: 'parentNode',
          transform: {
            rotation: [0, 0, 0],
            position: [0, 0, 0],
            scale: [1, 1, 1],
          },
        },
        'parentNode',
      );
      expect(appendSceneNodeInternalMock).toBeCalledTimes(1);
      expect(appendSceneNodeInternalMock).toBeCalledWith(
        { ...testNode, properties: { [SceneNodeRuntimeProperty.LayerIds]: [RESERVED_LAYER_ID] } },
        undefined,
      );
      expect(appendSceneNode as vi.Mock).not.toBeCalled();
    });

    it('should add error message when appendSceneNodeInternal to a dynamic scene failed', async () => {
      setFeatureConfig({ [COMPOSER_FEATURES.DynamicScene]: true });

      const testNode: Partial<ISceneNodeInternal> = { ref: 'testNode', properties: {}, name: 'test' };
      const document = {
        ...cloneDeep(valid),
        properties: {
          [KnownSceneProperty.SceneRootEntityId]: 'scene-root',
        },
      };
      const draft = { lastOperation: undefined, document, selectedSceneNodeRef: undefined };
      const addMessagesMock = vi.fn();
      const get = vi
        .fn()
        .mockReturnValue({ document, addMessages: addMessagesMock, getObject3DBySceneNodeRef: vi.fn() }); // fake out get call
      const set = vi.fn((callback) => callback(draft));
      (createNodeEntity as vi.Mock).mockRejectedValue(new Error('create failed'));

      // Act
      const { appendSceneNodeInternal } = createSceneDocumentSlice(set, get);
      appendSceneNodeInternal(testNode as ISceneNodeInternal);

      await flushPromises();

      expect(get).toBeCalledTimes(2);
      expect(createNodeEntity as vi.Mock).toBeCalledTimes(1);
      expect(createNodeEntity as vi.Mock).toBeCalledWith(testNode, 'scene-root');
      expect(addMessagesMock).toBeCalledTimes(1);
      expect(addMessagesMock).toBeCalledWith([
        {
          category: DisplayMessageCategory.Warning,
          messageText: 'Create entity for node test failed with error: create failed',
        },
      ]);
      expect(appendSceneNode as vi.Mock).not.toBeCalled();
    });
  });

  describe('renderSceneNodes', () => {
    it('should not be able to renderSceneNodes when document is undefined', () => {
      const draft = { document: undefined, lastOperation: undefined };
      const get = vi.fn();
      const set = vi.fn((callback) => callback(draft));

      // Act
      const { renderSceneNodes } = createSceneDocumentSlice(set, get);

      renderSceneNodes([]);

      expect(draft.lastOperation).toBeUndefined();
    });

    it('should be able to call renderSceneNodes', () => {
      const document = {
        rootNodeRefs: [],
        nodeMap: {},
        componentNodeMap: {},
      };
      const draft = { lastOperation: undefined, document, sceneLoaded: false };
      const get = vi.fn();
      const set = vi.fn((callback) => callback(draft));

      // Act
      const { renderSceneNodes } = createSceneDocumentSlice(set, get);

      renderSceneNodes([]);

      expect(draft.lastOperation).toEqual('renderSceneNodes');
      expect(draft.sceneLoaded).toBeTruthy();
    });
  });

  describe('updateSceneNodeInternal', () => {
    [true, false].forEach((isTransient) => {
      it(`should be able to updateSceneNodeInternal ${isTransient ? 'as' : 'as not'} transient`, () => {
        // Arrange
        const draft = {
          lastOperation: undefined,
          document: { nodeMap: { testNode: { ref: 'testNode', properties: {} } } },
        };
        const get = vi.fn().mockReturnValue(draft); // fake out get call
        const set = vi.fn((callback) => callback(draft));

        // Act
        const { updateSceneNodeInternal } = createSceneDocumentSlice(set, get);
        updateSceneNodeInternal('testNode', { name: 'test' }, isTransient);

        // Assert
        expect(mergeDeep).toBeCalledWith(draft.document.nodeMap.testNode, { name: 'test' });
        expect(draft.lastOperation!).toEqual(
          isTransient ? 'updateSceneNodeInternalTransient' : 'updateSceneNodeInternal',
        );
        expect(updateEntity).not.toBeCalled();
      });
    });
  });

  describe('updateSceneNodeInternalBatch', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    [true, false].forEach((isTransient) => {
      it(`should be able to updateSceneNodeInternalBatch ${isTransient ? 'as' : 'as not'} transient`, () => {
        // Arrange
        const draft = {
          lastOperation: undefined,
          document: { nodeMap: { testNode1: { ref: 'testNode', properties: {} } } },
        };
        const get = vi.fn().mockReturnValue(draft); // fake out get call
        const set = vi.fn((callback) => callback(draft));

        // Act
        const { updateSceneNodeInternalBatch } = createSceneDocumentSlice(set, get);
        updateSceneNodeInternalBatch({ testNode1: { name: 'test1' }, testNode2: { name: 'test2' } }, isTransient);

        // Assert
        expect(mergeDeep).toBeCalledWith(draft.document.nodeMap.testNode1, { name: 'test1' });
        expect(mergeDeep).toBeCalledWith(draft.document.nodeMap['testNode2'], { name: 'test2' });
        expect(draft.lastOperation!).toEqual(
          isTransient ? 'updateSceneNodeInternalBatchTransient' : 'updateSceneNodeInternalBatch',
        );
        expect(updateEntity).not.toBeCalled();
      });
    });
  });

  it(`should be able to updateDocumentInternal`, () => {
    // Arrange
    const draft = { lastOperation: undefined, document: { nodeMap: { testNode: 'testNode' } } };
    const get = vi.fn(); // fake out get call
    const set = vi.fn((callback) => callback(draft));

    // Act
    const { updateDocumentInternal } = createSceneDocumentSlice(set, get);
    updateDocumentInternal('partial' as any);

    // Assert
    expect(mergeDeep).toBeCalledWith(draft.document, 'partial');
    expect(updateSceneRootEntity).not.toBeCalled();
    expect(draft.lastOperation!).toEqual('updateDocumentInternal');
  });

  it('should be able to appendSceneNode with selete node enabled', () => {
    vi.spyOn(interfaceHelpers, 'createSceneNodeInternal').mockReturnValue({ ref: 'newNode' } as ISceneNodeInternal);
    const appendSceneNodeInternal = vi.fn();
    const get = vi.fn().mockReturnValue({ appendSceneNodeInternal }); // fake out get call
    const set = vi.fn();

    const node = { childRefs: [] };
    const nodeWithChildren = { childRefs: ['ref]'] };

    // Act
    const { appendSceneNode } = createSceneDocumentSlice(set, get);
    appendSceneNode(node, false);

    expect(get).toBeCalled();
    expect(interfaceHelpers.createSceneNodeInternal).toBeCalledWith(node);
    expect(appendSceneNodeInternal).toBeCalledWith({ ref: 'newNode' }, false);

    expect(() => appendSceneNode(nodeWithChildren)).toThrow();
  });

  it('should be able to appendSceneNode with selete node disabled', () => {
    vi.spyOn(interfaceHelpers, 'createSceneNodeInternal').mockReturnValue({ ref: 'newNode' } as ISceneNodeInternal);
    const appendSceneNodeInternal = vi.fn();
    const get = vi.fn().mockReturnValue({ appendSceneNodeInternal }); // fake out get call
    const set = vi.fn();

    const node = { childRefs: [] };
    const nodeWithChildren = { childRefs: ['ref]'] };

    // Act
    const { appendSceneNode } = createSceneDocumentSlice(set, get);
    appendSceneNode(node, true);

    expect(get).toBeCalled();
    expect(interfaceHelpers.createSceneNodeInternal).toBeCalledWith(node);
    expect(appendSceneNodeInternal).toBeCalledWith({ ref: 'newNode' }, true);

    expect(() => appendSceneNode(nodeWithChildren)).toThrow();
  });

  it('should be able to updateSceneNode', () => {
    const updateSceneNodeInternal = vi.fn();
    const get = vi.fn().mockReturnValue({ updateSceneNodeInternal }); // fake out get call
    const set = vi.fn();

    // Act
    const { updateSceneNode } = createSceneDocumentSlice(set, get);
    updateSceneNode('ref', 'partial' as any);

    expect(get).toBeCalled();
    expect(updateSceneNodeInternal).toBeCalledWith('ref', 'partial');
  });

  describe('removeSceneNode', () => {
    it('should not be able to removeSceneNode when node not found', () => {
      const document = { nodeMap: { testNode: 'testNode' } };
      const get = vi.fn().mockReturnValue({ document }); // fake out get call
      const set = vi.fn();

      // Act
      const { removeSceneNode } = createSceneDocumentSlice(set, get);

      expect(() => removeSceneNode('someNode')).toThrow();
      expect(get).toBeCalled();
      expect(document.nodeMap.testNode).toBeDefined();
    });

    it('should be able to removeSceneNode', () => {
      const document = {
        rootNodeRefs: ['testNode'],
        nodeMap: {
          testNode: {
            ref: 'testNode',
            childRefs: [],
            components: [
              { ref: 'test-comp-1', type: 'abc' },
              { ref: 'test-comp-2', type: 'def' },
            ],
            properties: {},
          },
        },
        componentNodeMap: {
          abc: { testNode: ['test-comp-1'] },
          def: { testNode: ['test-comp-2'] },
        },
      };
      const draft = { lastOperation: undefined, document };
      const get = vi.fn().mockReturnValue({ document }); // fake out get call
      const set = vi.fn((callback) => callback(draft));

      // Act
      const { removeSceneNode } = createSceneDocumentSlice(set, get);

      removeSceneNode('testNode');
      expect(get).toBeCalled();
      expect(updateEntity).not.toBeCalled();
      expect(draft.lastOperation!).toEqual('removeSceneNode');
      expect(draft.document.nodeMap.testNode).toBeUndefined();
      expect(draft.document.componentNodeMap).toEqual({ abc: {}, def: {} });
    });
  });

  it('should be able to listSceneRuleMapIds', () => {
    const statements = { testRule: { expression: 0, target: 'target' } };
    const document = { ruleMap: { rule1: { statements }, rule2: { statements } } };
    const get = vi.fn().mockReturnValue({ document }); // fake out get call
    const set = vi.fn();

    // Act
    const { listSceneRuleMapIds } = createSceneDocumentSlice(set, get);
    const ruleIds = listSceneRuleMapIds();

    expect(get).toBeCalled();
    expect(ruleIds).toEqual(['rule1', 'rule2']);
  });

  it('should be able to getSceneRuleByMapId', () => {
    const statements = { testRule: { expression: 0, target: 'target' } };
    const document = { ruleMap: { rule1: { statements }, rule2: { statements } } };
    const get = vi.fn().mockReturnValue({ document }); // fake out get call
    const set = vi.fn();

    // Act
    const { getSceneRuleMapById } = createSceneDocumentSlice(set, get);
    const rule = getSceneRuleMapById('rule1');

    expect(get).toBeCalled();
    expect(rule).toEqual(document.ruleMap.rule1);
  });

  it('should not be able to getSceneRuleByMapId of undefined', () => {
    const statements = { testRule: { expression: 0, target: 'target' } };
    const document = { ruleMap: { rule1: { statements }, rule2: { statements } } };
    const get = vi.fn().mockReturnValue({ document }); // fake out get call
    const set = vi.fn();

    // Act
    const { getSceneRuleMapById } = createSceneDocumentSlice(set, get);
    getSceneRuleMapById(undefined);

    expect(get).not.toBeCalled();
  });

  it('should be able to updateSceneRuleByMapId', () => {
    const statements = { testRule: { expression: 0, target: 'target' } };
    const document = { ruleMap: { rule1: { statements }, rule2: { statements } } };
    const draft = { lastOperation: undefined, document };
    const get = vi.fn(); // fake out get call
    const set = vi.fn((callback) => callback(draft));

    // Act
    const { updateSceneRuleMapById } = createSceneDocumentSlice(set, get);
    updateSceneRuleMapById('rule1', { statements: { testRule: { expression: 1, target: 'target' } } } as any);

    expect(updateSceneRootEntity).not.toBeCalled();
    expect(draft.lastOperation!).toEqual('updateSceneRuleMapById');
    expect(draft.document.ruleMap.rule1.statements.testRule.expression).toEqual(1);
  });

  it('should be able to removeSceneRuleByMapId', () => {
    const statements = { testRule: { expression: 0, target: 'target' } };
    const document = { ruleMap: { rule1: { statements }, rule2: { statements } } };
    const draft = { lastOperation: undefined, document };
    const get = vi.fn(); // fake out get call
    const set = vi.fn((callback) => callback(draft));

    // Act
    const { removeSceneRuleMapById } = createSceneDocumentSlice(set, get);
    removeSceneRuleMapById('rule1');

    expect(updateSceneRootEntity).not.toBeCalled();
    expect(draft.lastOperation!).toEqual('removeSceneRuleMapById');
    expect(draft.document.ruleMap.rule1).toBeUndefined();
  });

  it('should be able to addComponentInternal', () => {
    const document = { nodeMap: { testNode: { components: [], properties: {} } }, componentNodeMap: {} };
    const draft = { lastOperation: undefined, document };
    const getSceneNodeByRef = vi.fn().mockReturnValue(document.nodeMap.testNode);
    const get = vi.fn().mockReturnValue({ getSceneNodeByRef }); // fake out get call
    const set = vi.fn((callback) => callback(draft));
    const comp = { ref: 'comp-1', type: 'abc' };

    // Act
    const { addComponentInternal } = createSceneDocumentSlice(set, get);
    addComponentInternal('testNode', comp);

    expect(draft.lastOperation!).toEqual('addComponentInternal');
    expect(get).toBeCalled();
    expect(getSceneNodeByRef).toBeCalledWith('testNode');
    expect(draft.document.nodeMap.testNode.components).toEqual([comp]);
    expect(draft.document.componentNodeMap['abc']['testNode']).toEqual([comp.ref]);
    expect(updateEntity).not.toBeCalled();
  });

  it('should not be able to addComponentInternal if not found', () => {
    const document = { nodeMap: { testNode: { components: [] } } };
    const draft = { lastOperation: undefined, document };
    const getSceneNodeByRef = vi.fn();
    const get = vi.fn().mockReturnValue({ getSceneNodeByRef }); // fake out get call
    const set = vi.fn((callback) => callback(draft));

    // Act
    const { addComponentInternal } = createSceneDocumentSlice(set, get);
    addComponentInternal('notHere', 'component' as any);

    expect(draft.lastOperation!).toBeUndefined();
    expect(get).toBeCalled();
    expect(getSceneNodeByRef).toBeCalledWith('notHere');
  });

  describe('updateComponentInternal', () => {
    [true, false].forEach((replace) => {
      it(`should be able to updateComponentInternal ${replace ? 'with' : 'without'} replacing`, () => {
        const document = {
          nodeMap: { testNode: { components: [{ ref: 'component1', data: 'original' }], properties: {} } },
        };
        const draft = { lastOperation: undefined, document };
        const getSceneNodeByRef = vi.fn().mockReturnValue(document.nodeMap.testNode);
        const getSceneProperty = vi.fn();
        const get = vi.fn().mockReturnValue({ getSceneNodeByRef, getSceneProperty }); // fake out get call
        const set = vi.fn((callback) => callback(draft));

        // Act
        const { updateComponentInternal } = createSceneDocumentSlice(set, get);
        updateComponentInternal('testNode', { ref: 'component1', data: 'updated' } as any, replace);

        expect(updateEntity).not.toBeCalled();
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
      const getSceneNodeByRef = vi.fn().mockImplementation((ref) => {
        if (ref === 'testNode') {
          return document.nodeMap.testNode;
        }
        return undefined;
      });
      const get = vi.fn().mockReturnValue({ getSceneNodeByRef }); // fake out get call
      const set = vi.fn((callback) => callback(draft));

      // Act
      const { updateComponentInternal } = createSceneDocumentSlice(set, get);
      expect(() => updateComponentInternal('testNode', { data: 'updated' } as any, false)).toThrow();
      expect(() => updateComponentInternal('notHere', { ref: 'component1', data: 'updated' } as any, false)).toThrow();
      expect(() => updateComponentInternal('testNode', { ref: 'notHere', data: 'updated' } as any, false)).toThrow();
    });
  });

  it(`should be able to removeComponent`, () => {
    const document = {
      nodeMap: { testNode: { components: [{ ref: 'component1', data: 'original', type: 'abc' }], properties: {} } },
      componentNodeMap: { abc: { testNode: ['component1'] } },
    };
    const draft = { lastOperation: undefined, document };
    const getSceneNodeByRef = vi.fn().mockReturnValue(document.nodeMap.testNode);
    const get = vi.fn().mockReturnValue({ getSceneNodeByRef }); // fake out get call
    const set = vi.fn((callback) => callback(draft));

    // Act
    const { removeComponent } = createSceneDocumentSlice(set, get);
    removeComponent('testNode', 'component1');

    expect(draft.lastOperation!).toEqual('removeComponent');
    expect(get).toBeCalled();
    expect(getSceneNodeByRef).toBeCalledWith('testNode');

    expect(draft.document.nodeMap.testNode.components).toHaveLength(0);
    expect(draft.document.componentNodeMap['abc']).toEqual({});
    expect(updateEntity).not.toBeCalled();
  });

  it(`should do nothing to removeComponent if unnecessary`, () => {
    const document = {
      nodeMap: { testNode: { components: [{ ref: 'component1', data: 'original' }] } },
    };
    const draft = { lastOperation: undefined, document };
    const getSceneNodeByRef = vi.fn().mockImplementation((ref) => {
      if (ref === 'testNode') {
        return document.nodeMap.testNode;
      }
      return undefined;
    });
    const get = vi.fn().mockReturnValue({ getSceneNodeByRef }); // fake out get call
    const set = vi.fn((callback) => callback(draft));

    // Act
    const { removeComponent } = createSceneDocumentSlice(set, get);
    removeComponent('notHere', 'component1');
    removeComponent('testNode', 'notHere');

    expect(get).toBeCalledTimes(2);

    expect(draft.document.nodeMap.testNode.components).toHaveLength(1);
  });

  it('should be able to getSceneProperty', () => {
    const document = {
      properties: { matterportModelId: 'abc' },
    };
    const get = vi.fn().mockReturnValue({ document }); // fake out get call
    const set = vi.fn();

    // Act
    const { getSceneProperty } = createSceneDocumentSlice(set, get);
    const result = getSceneProperty(KnownSceneProperty.MatterportModelId);
    const result2 = getSceneProperty(KnownSceneProperty.EnvironmentPreset, 'default');

    expect(get).toBeCalledTimes(2);
    expect(result).toEqual(document.properties.matterportModelId);
    expect(result2).toEqual('default');
  });

  it('should return default with getSceneProperty if no properties set', () => {
    const document = {};
    const get = vi.fn().mockReturnValue({ document }); // fake out get call
    const set = vi.fn();

    // Act
    const { getSceneProperty } = createSceneDocumentSlice(set, get);
    const result = getSceneProperty(KnownSceneProperty.EnvironmentPreset, 'default');

    expect(get).toBeCalled();
    expect(result).toEqual('default');
  });

  [{}, { properties: { environmentPreset: 'neutral' } }].forEach((document) => {
    it(`should be able to setSceneProperty ${document.properties ? 'with' : 'without'} set properties`, () => {
      const draft = { lastOperation: undefined, document };
      const get = vi.fn(); // fake out get call
      const set = vi.fn((callback) => callback(draft));

      // Act
      const { setSceneProperty } = createSceneDocumentSlice(set, get);
      setSceneProperty(KnownSceneProperty.EnvironmentPreset, 'setValue');

      expect(updateSceneRootEntity).not.toBeCalled();
      expect(draft.lastOperation!).toEqual('setSceneProperty');
      expect(draft.document.properties!.environmentPreset).toEqual('setValue');
    });
  });

  describe('set data binding config scene property', () => {
    [KnownComponentType.Tag, KnownComponentType.ModelShader].forEach((componentType) => {
      const componentTypeName = KnownComponentType[componentType];
      it(`should remove data binding for ${componentTypeName}`, () => {
        const component = {
          ref: 'ref',
          type: componentType,
          valueDataBinding: { dataBindingContext: { entityId: '${value1}', key2: 'value2' } },
        } as IAnchorComponentInternal;
        const document = { nodeMap: { testNode: { ref: 'testRef', components: [component] } } };
        const draft = { lastOperation: undefined, document };
        const get = vi.fn().mockReturnValue({ document }); // fake out get call
        const set = vi.fn((callback) => callback(draft));

        // Act
        const sceneDocumentSlice = createSceneDocumentSlice(set, get);
        sceneDocumentSlice.setSceneProperty(KnownSceneProperty.DataBindingConfig, {});

        expect(
          (draft.document.nodeMap.testNode.components[0] as IAnchorComponentInternal).valueDataBinding
            ?.dataBindingContext,
        ).toBeUndefined();
      });

      it('should remove data binding for overlay', () => {
        const component: IDataOverlayComponentInternal = {
          ref: 'ref',
          type: KnownComponentType.DataOverlay,
          subType: Component.DataOverlaySubType.OverlayPanel,
          dataRows: [],
          valueDataBindings: [
            {
              valueDataBinding: { dataBindingContext: { entityId: '${value1}', componentName: 'value2' } },
              bindingName: 'binding-aa',
            },
          ],
        };
        const document = { nodeMap: { testNode: { ref: 'testRef', components: [component] } } };
        const draft = { lastOperation: undefined, document };
        const get = vi.fn().mockReturnValue({ document }); // fake out get call
        const set = vi.fn((callback) => callback(draft));

        // Act
        const sceneDocumentSlice = createSceneDocumentSlice(set, get);
        sceneDocumentSlice.setSceneProperty(KnownSceneProperty.DataBindingConfig, {});

        expect(
          (draft.document.nodeMap.testNode.components[0] as IDataOverlayComponentInternal).valueDataBindings[0]
            .valueDataBinding?.dataBindingContext,
        ).toBeUndefined();
      });

      it("should do nothing if data binding context doesn't use data binding template", () => {
        const component = {
          ref: 'ref',
          type: componentType,
          valueDataBinding: { dataBindingContext: { entityId: 'value1', key2: 'value2' } },
        } as IAnchorComponentInternal;
        const document = { nodeMap: { testNode: { ref: 'testRef', components: [component] } } };
        const draft = { lastOperation: undefined, document };
        const get = vi.fn().mockReturnValue({ document }); // fake out get call
        const set = vi.fn((callback) => callback(draft));

        // Act
        const sceneDocumentSlice = createSceneDocumentSlice(set, get);
        sceneDocumentSlice.setSceneProperty(KnownSceneProperty.DataBindingConfig, {});

        expect(
          (draft.document.nodeMap.testNode.components[0] as IAnchorComponentInternal).valueDataBinding
            ?.dataBindingContext,
        ).toEqual({ entityId: 'value1', key2: 'value2' });
      });

      it(`should do nothing for ${componentTypeName} if data binding is empty`, () => {
        const component = {
          type: componentType,
        } as IAnchorComponentInternal;
        const document = { nodeMap: { testNode: { ref: 'testRef', components: [component] } } };
        const draft = { lastOperation: undefined, document };
        const get = vi.fn().mockReturnValue({ document }); // fake out get call
        const set = vi.fn((callback) => callback(draft));

        // Act
        const sceneDocumentSlice = createSceneDocumentSlice(set, get);
        sceneDocumentSlice.setSceneProperty(KnownSceneProperty.DataBindingConfig, {});

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
    const get = vi.fn();
    const set = vi.fn();
    get.mockReturnValueOnce({ document: { componentNodeMap: {} } });
    get.mockReturnValueOnce({ document });
    get.mockReturnValueOnce({ document });

    // Act
    const { getComponentRefByType } = createSceneDocumentSlice(set, get);
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
        (containsMatchingEntityComponent as vi.Mock).mockReturnValue(true);
        const document = { nodeMap: { testNode: { ref: 'testRef', components: [component] } } };
        const get = vi.fn().mockReturnValue({ document }); // fake out get call
        const set = vi.fn();

        // Act
        const { findSceneNodeRefBy } = createSceneDocumentSlice(set, get);
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
      (containsMatchingEntityComponent as vi.Mock).mockReturnValue(true);
      const document = {
        nodeMap: {
          testTagNode: { ref: 'tagRef', components: [tagComponent] },
          testShaderNode: { ref: 'shaderRef', components: [modelShaderComponent] },
        },
      };
      const get = vi.fn().mockReturnValue({ document }); // fake out get call
      const set = vi.fn();

      const { findSceneNodeRefBy } = createSceneDocumentSlice(set, get);

      const result1 = findSceneNodeRefBy('whatever', [KnownComponentType.Tag]);
      expect(containsMatchingEntityComponent).toBeCalledWith('whatever', undefined);
      expect(result1).toEqual(['tagRef']);

      const result2 = findSceneNodeRefBy('whatever', [KnownComponentType.MotionIndicator]);
      expect(result2).toEqual([]);

      const result3 = findSceneNodeRefBy('whatever');
      expect(result3).toEqual(['tagRef', 'shaderRef']);
    });
  });

  describe('update entity', () => {
    const documentBase = {
      rootNodeRefs: ['testNode'],
      properties: {
        [KnownSceneProperty.SceneRootEntityId]: 'sceneRootEntityId',
      },
      nodeMap: {
        testNode: {
          properties: {
            [SceneNodeRuntimeProperty.LayerIds]: ['layer1'],
          },
          ref: 'testNode',
          childRefs: [],
          components: [
            { ref: 'test-comp-1', type: 'abc' },
            { ref: 'test-comp-2', type: 'def' },
          ],
        },
      },
      componentNodeMap: {
        abc: { testNode: ['test-comp-1'] },
        def: { testNode: ['test-comp-2'] },
      },
    };

    it('should not call update entity for updateSceneNodeInternal action when skip flag is on', () => {
      const document = cloneDeep(documentBase);
      const draft = { lastOperation: undefined, document };
      const get = vi.fn().mockReturnValue(draft); // fake out get call
      const set = vi.fn((callback) => callback(draft));

      // Act
      const { updateSceneNodeInternal } = createSceneDocumentSlice(set, get);
      updateSceneNodeInternal('testNode', { name: 'test' }, false, true);

      // Assert
      expect(mergeDeep).toBeCalledWith(document.nodeMap.testNode, { name: 'test' });
      expect(draft.lastOperation!).toEqual('updateSceneNodeInternal');
      expect(updateEntity).not.toBeCalled();
    });

    it('should call update entity for updateSceneNodeInternal action', () => {
      const document = cloneDeep(documentBase);
      const draft = { lastOperation: undefined, document };
      const get = vi.fn().mockReturnValue(draft); // fake out get call
      const set = vi.fn((callback) => callback(draft));

      // Act
      const { updateSceneNodeInternal } = createSceneDocumentSlice(set, get);
      updateSceneNodeInternal('testNode', { name: 'test' });

      // Assert
      expect(mergeDeep).toBeCalledWith(document.nodeMap.testNode, { name: 'test' });
      expect(draft.lastOperation!).toEqual('updateSceneNodeInternal');
      expect(updateEntity).toBeCalledTimes(1);
      expect(updateEntity).toBeCalledWith(
        document.nodeMap.testNode,
        undefined,
        undefined,
        documentBase.nodeMap.testNode,
        'sceneRootEntityId',
      );
    });

    it('should call update entity for updateSceneNodeInternal action with components update', () => {
      const document = cloneDeep(documentBase);
      const draft = { lastOperation: undefined, document };
      const get = vi.fn().mockReturnValue(draft); // fake out get call
      const set = vi.fn((callback) => callback(draft));

      // Act
      const { updateSceneNodeInternal } = createSceneDocumentSlice(set, get);
      updateSceneNodeInternal('testNode', { name: 'test', components: [{ ref: 'tag-ref', type: 'Tag' }] });

      // Assert
      expect(mergeDeep).toBeCalledWith(document.nodeMap.testNode, {
        name: 'test',
        components: [{ ref: 'tag-ref', type: 'Tag' }],
      });
      expect(draft.lastOperation!).toEqual('updateSceneNodeInternal');
      expect(updateEntity).toBeCalledTimes(1);
      expect(updateEntity).toBeCalledWith(
        document.nodeMap.testNode,
        document.nodeMap.testNode.components,
        undefined,
        documentBase.nodeMap.testNode,
        'sceneRootEntityId',
      );
    });

    it('should call update entity for addComponentInternal action', () => {
      const document = cloneDeep(documentBase);
      const draft = { lastOperation: undefined, document };
      const getSceneNodeByRef = vi.fn().mockReturnValue(document.nodeMap.testNode);
      const get = vi.fn().mockReturnValue({ getSceneNodeByRef }); // fake out get call
      const set = vi.fn((callback) => callback(draft));
      const comp = { ref: 'comp-1', type: 'abc' };

      // Act
      const { addComponentInternal } = createSceneDocumentSlice(set, get);
      addComponentInternal('testNode', comp);

      expect(draft.lastOperation!).toEqual('addComponentInternal');
      expect(get).toBeCalled();
      expect(updateEntity).toBeCalledTimes(1);
      expect(updateEntity).toBeCalledWith(document.nodeMap.testNode, [comp]);
    });

    it('should call update entity for updateComponentInternal action', () => {
      const document = cloneDeep(documentBase);
      const draft = { lastOperation: undefined, document };
      const getSceneNodeByRef = vi.fn().mockReturnValue(document.nodeMap.testNode);
      const get = vi.fn().mockReturnValue({ getSceneNodeByRef }); // fake out get call
      const set = vi.fn((callback) => callback(draft));

      // Act
      const { updateComponentInternal } = createSceneDocumentSlice(set, get);
      updateComponentInternal('testNode', { ref: 'test-comp-2', type: 'updated' });

      expect(updateEntity).toBeCalledTimes(1);
      expect(updateEntity).toBeCalledWith(
        document.nodeMap.testNode,
        [{ type: 'def', ref: 'test-comp-2' }],
        ComponentUpdateType.UPDATE,
        documentBase.nodeMap.testNode,
      );
      expect(draft.lastOperation!).toEqual('updateComponentInternal');
    });

    it('should call delete entity for removeSceneNode action', async () => {
      const document = cloneDeep(documentBase);
      const draft = { lastOperation: undefined, document };
      const get = vi.fn().mockReturnValue({ document }); // fake out get call
      const set = vi.fn((callback) => callback(draft));
      const onFlashMessage = vi.fn();
      setOnFlashMessage(onFlashMessage);
      (deleteNodeEntity as vi.Mock).mockResolvedValue({});

      // Act
      const { removeSceneNode } = createSceneDocumentSlice(set, get);
      removeSceneNode('testNode');

      await flushPromises();

      expect(get).toBeCalled();
      expect(deleteNodeEntity).toBeCalledTimes(1);
      expect(deleteNodeEntity).toBeCalledWith('testNode');
      expect(draft.lastOperation!).toEqual('removeSceneNode');
      expect(onFlashMessage).toBeCalledTimes(1);
      expect(onFlashMessage).toBeCalledWith(expect.objectContaining({ type: 'success' }));
    });

    it('should call update entity for removeComponent action', async () => {
      const document = cloneDeep(documentBase);
      const draft = { lastOperation: undefined, document };
      const getSceneNodeByRef = vi.fn().mockReturnValue(document.nodeMap.testNode);
      const get = vi.fn().mockReturnValue({ getSceneNodeByRef }); // fake out get call
      const set = vi.fn((callback) => callback(draft));
      const onFlashMessage = vi.fn();
      setOnFlashMessage(onFlashMessage);
      (updateEntity as vi.Mock).mockResolvedValue({});

      // Act
      const { removeComponent } = createSceneDocumentSlice(set, get);
      removeComponent('testNode', 'test-comp-1');

      await flushPromises();

      expect(draft.lastOperation!).toEqual('removeComponent');
      expect(updateEntity).toBeCalledTimes(1);
      expect(updateEntity).toBeCalledWith(
        document.nodeMap.testNode,
        [{ type: 'abc', ref: 'test-comp-1' }],
        'DELETE',
        documentBase.nodeMap.testNode,
      );
      expect(onFlashMessage).toBeCalledTimes(1);
      expect(onFlashMessage).toBeCalledWith(expect.objectContaining({ type: 'success' }));
    });
  });
});
