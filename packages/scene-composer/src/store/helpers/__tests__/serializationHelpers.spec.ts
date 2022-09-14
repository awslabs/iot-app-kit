import SerializationHelpers, { exportsForTesting } from '../serializationHelpers';
import { ERROR_MESSAGE_DICT, ErrorCode, ErrorLevel, IModelRefComponent, KnownComponentType } from '../../..';
import { generateUUID } from '../../../utils/mathUtils';
import { Component } from '../../../models/SceneModels';
import { ISceneDocumentInternal, ISceneNodeInternal } from '../..';

jest.mock('../../../utils/mathUtils', () => ({
  ...jest.requireActual('../../../utils/mathUtils'),
  generateUUID: jest.fn(),
}));

describe('serializationHelpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should appropriately create model ref componentAs or log errors when calling createModelRefComponent', () => {
    (generateUUID as jest.Mock).mockReturnValueOnce('test-uuid').mockReturnValueOnce('other-test-uuid');

    const errorCollector = [];
    const glb = exportsForTesting.createModelRefComponent(
      { modelType: 'GLB' } as any,
      errorCollector,
    ) as unknown as ISceneNodeInternal;
    const gltf = exportsForTesting.createModelRefComponent(
      { modelType: 'GLTF' } as any,
      errorCollector,
    ) as unknown as ISceneNodeInternal;
    const error = exportsForTesting.createModelRefComponent({ modelType: 'OBJ' } as any, errorCollector);

    expect(glb.ref).toEqual('test-uuid');
    expect(gltf.ref).toEqual('other-test-uuid');
    expect(error).toBeUndefined();
    expect(errorCollector).toHaveLength(1);
    expect(errorCollector[0]).toEqual({
      level: ErrorLevel.WARNING,
      code: ErrorCode.SC_ERROR_LOAD_SCENE,
      message: ERROR_MESSAGE_DICT.UNKNOWN_MODEL_REF_MODEL_TYPE,
      context: {
        modelType: 'OBJ',
      },
    });
  });

  it('should appropriately create tag components or log errors when calling createTagComponent', () => {
    (generateUUID as jest.Mock).mockReturnValue('test-uuid');

    const component = {
      icon: 'testIcon',
      ruleBasedMapId: 42,
      valueDataBinding: { dataBindingContext: 'dataBindingContext' },
      navLink: 'https://test-nav.link',
    };
    const resolver = jest.fn();
    resolver.mockReturnValueOnce('here is a map');
    resolver.mockReturnValueOnce(undefined);
    const errorCollector = [];
    const tag = exportsForTesting.createTagComponent(component as any, resolver, errorCollector);
    const error = exportsForTesting.createTagComponent(component as any, resolver, errorCollector);

    expect(tag).toEqual({
      ref: 'test-uuid',
      type: 'Tag',
      icon: component.icon,
      ruleBasedMapId: component.ruleBasedMapId,
      valueDataBinding: component.valueDataBinding,
      navLink: component.navLink,
    });

    expect(error).toEqual(tag);
    expect(errorCollector).toHaveLength(1);
    expect(errorCollector[0]).toEqual({
      level: ErrorLevel.WARNING,
      code: ErrorCode.SC_ERROR_LOAD_SCENE,
      message: ERROR_MESSAGE_DICT.INVALID_RULE,
      context: {
        ruleId: 42,
      },
    });
  });

  it('should appropriately create camera components or log errors when calling createCameraComponent', () => {
    const resolver = jest.fn();
    exportsForTesting.createCameraComponent({ cameraIndex: 1 } as any, resolver, []);
    expect(resolver).toHaveBeenCalledWith(Component.Type.Camera, 1);
  });

  it('should appropriately create light components or log errors when calling createLightComponent', () => {
    (generateUUID as jest.Mock).mockReturnValueOnce('test-uuid');

    const light = { lightType: 'Ambient', lightSettings: { volume: 'full' } };
    expect(exportsForTesting.createLightComponent(light as any, [])).toEqual({
      ref: 'test-uuid',
      type: 'Light',
      lightType: 'Ambient',
      lightSettings: {
        color: 0xffffff,
        intensity: 1,
        volume: 'full',
      },
    });
  });

  it('should appropriately create model shader component or log errors when calling createModelShaderComponent', () => {
    (generateUUID as jest.Mock).mockReturnValueOnce('test-uuid');

    const modelShaderComponent = exportsForTesting.createModelShaderComponent({ shader: 'test' } as any, []);
    expect(modelShaderComponent).toEqual({ ref: 'test-uuid', shader: 'test' });
  });

  it('should appropriately create motion indicator components or log errors when calling createMotionIndicatorComponent', () => {
    (generateUUID as jest.Mock).mockReturnValueOnce('test-uuid');

    const component = {
      shape: 'LinearPlane',
      valueDataBindings: {
        speed: {
          ruleBasedMapId: 42,
          valueDataBinding: { dataBindingContext: 'dataBindingContext' },
        },
      },
      config: {
        numOfRepeatInY: 2,
        backgroundColorOpacity: 1,
      },
    };
    const resolver = jest.fn();
    resolver.mockReturnValueOnce('here is a map');
    resolver.mockReturnValueOnce(undefined);
    const errorCollector = [];
    const motionIndicator = exportsForTesting.createMotionIndicatorComponent(
      component as any,
      resolver,
      errorCollector,
    );
    const error = exportsForTesting.createMotionIndicatorComponent(component as any, resolver, errorCollector);

    expect(motionIndicator).toEqual({
      ref: 'test-uuid',
      type: 'MotionIndicator',
      valueDataBindings: component.valueDataBindings,
      shape: component.shape,
      config: component.config,
    });

    expect(error).toEqual(motionIndicator);
    expect(errorCollector).toHaveLength(1);
    expect(errorCollector[0]).toEqual({
      level: ErrorLevel.WARNING,
      code: ErrorCode.SC_ERROR_LOAD_SCENE,
      message: ERROR_MESSAGE_DICT.INVALID_RULE,
      context: {
        ruleId: 42,
      },
    });
  });

  it('should create a scene node when calling createSceneNodeInternal', () => {
    (generateUUID as jest.Mock).mockReturnValueOnce('test-uuid');

    const sceneNode = {
      ref: 'a2a91acc-3a47-4875-a146-b95741aedc2a',
      name: 'testNode',
      transform: {
        position: [0, 1, 2],
        rotation: [180, 90, 0],
        scale: [1, 1, 1],
      },
      transformConstraint: { snapToFloor: true },
      components: [
        {
          ref: 'a2a91acc-3a47-4875-a146-b95741aedc2a',
          type: 'testComponent',
        },
      ],
      parentRef: 'testParent',
      childRefs: ['testChild'],
      properties: { hiddenWhileImmersive: true },
    };

    const sceneNodeInternal = exportsForTesting.createSceneNodeInternal(sceneNode as any);
    expect(sceneNodeInternal).toEqual({
      ref: 'test-uuid',
      name: sceneNode.name,
      transform: sceneNode.transform,
      transformConstraint: sceneNode.transformConstraint,
      components: [],
      parentRef: undefined,
      childRefs: [],
      properties: { hiddenWhileImmersive: true },
    });
  });

  it('should create an indexed object resolver when calling createObjectResolver which validates input', () => {
    (generateUUID as jest.Mock).mockReturnValueOnce('test-uuid');

    const scene = {
      specVersion: '1.0',
      version: '1.0',
      nodes: [],
      rootNodeIndexes: 0,
      rules: [{ testRule: [{ expression: 0, target: 'testTag' }] }],
      cameras: [{ cameraType: 'Perspective' }],
    };

    const indexedResolver = exportsForTesting.createObjectResolver(scene as any);

    // Camera
    expect(indexedResolver(Component.Type.Camera, 0)).toEqual({
      cameraType: 'Perspective',
      far: 1000,
      fov: 53.13,
      near: 0.1,
      zoom: 1,
      ref: 'test-uuid',
      type: 'Camera',
    });
    expect(() => indexedResolver(Component.Type.Camera, 1)).toThrow();
    expect(() => indexedResolver(Component.Type.Camera, -1)).toThrow();

    // Rule
    expect(indexedResolver('Rule', 0)).toEqual({ testRule: [{ expression: 0, target: 'testTag' }] });
    expect(() => indexedResolver('Rule', 1)).toThrow();
    expect(() => indexedResolver('Rule', -1)).toThrow();

    // Other
    expect(() => indexedResolver(Component.Type.Light, 0)).toThrow();
  });

  describe('parseSceneContent', () => {
    it('should return a scene when calling parseSceneContent', () => {
      const scene = {
        specVersion: '1.0',
        version: '1.0',
        nodes: [{ lightType: 'Ambient', lightSettings: { volume: 'full' } }],
        rootNodeIndexes: 0,
        rules: [{ testRule: [{ expression: 0, target: 'testTag' }] }],
        cameras: [{ cameraType: 'Perspective' }],
      };

      const json = JSON.stringify(scene);
      expect(exportsForTesting.parseSceneContent(json, [])).toEqual(scene);
    });

    it('should throw an error without specVersion', () => {
      const scene = {
        version: '1.0',
        nodes: [{ lightType: 'Ambient', lightSettings: { volume: 'full' } }],
        rootNodeIndexes: 0,
        rules: [{ testRule: [{ expression: 0, target: 'testTag' }] }],
        cameras: [{ cameraType: 'Perspective' }],
      };

      const json = JSON.stringify(scene);
      expect(() => exportsForTesting.parseSceneContent(json, [])).toThrow();
    });

    it('should throw an error with Legacy specVersion', () => {
      const scene = {
        specVersion: '1',
        version: '1.0',
        nodes: [{ lightType: 'Ambient', lightSettings: { volume: 'full' } }],
        rootNodeIndexes: 0,
        rules: [{ testRule: [{ expression: 0, target: 'testTag' }] }],
        cameras: [{ cameraType: 'Perspective' }],
      };

      const json = JSON.stringify(scene);
      expect(() => exportsForTesting.parseSceneContent(json, [])).toThrow();
    });

    it('should throw an error with long specVersion', () => {
      const scene = {
        specVersion: '1.0.0',
        version: '1.0',
        nodes: [{ lightType: 'Ambient', lightSettings: { volume: 'full' } }],
        rootNodeIndexes: 0,
        rules: [{ testRule: [{ expression: 0, target: 'testTag' }] }],
        cameras: [{ cameraType: 'Perspective' }],
      };

      const json = JSON.stringify(scene);
      expect(() => exportsForTesting.parseSceneContent(json, [])).toThrow();
    });

    it('should throw an error with newer major spec version', () => {
      const scene = {
        specVersion: '2.0',
        version: '1.0',
        nodes: [{ lightType: 'Ambient', lightSettings: { volume: 'full' } }],
        rootNodeIndexes: 0,
        rules: [{ testRule: [{ expression: 0, target: 'testTag' }] }],
        cameras: [{ cameraType: 'Perspective' }],
      };

      const json = JSON.stringify(scene);
      expect(() => exportsForTesting.parseSceneContent(json, [])).toThrow();
    });

    it('should report an error with newer minor spec version', () => {
      const scene = {
        specVersion: '1.1',
        version: '1.0',
        nodes: [{ lightType: 'Ambient', lightSettings: { volume: 'full' } }],
        rootNodeIndexes: 0,
        rules: [{ testRule: [{ expression: 0, target: 'testTag' }] }],
        cameras: [{ cameraType: 'Perspective' }],
      };
      const errorCollector = [];

      const json = JSON.stringify(scene);
      expect(exportsForTesting.parseSceneContent(json, errorCollector)).toEqual(scene);
      expect(errorCollector).toHaveLength(1);
    });
  });

  describe('deserializeComponent', () => {
    const resolver = jest.fn();
    beforeEach(() => {
      (generateUUID as jest.Mock).mockReturnValueOnce('test-uuid');
      jest.clearAllMocks();
    });

    it('should create a modelRef', () => {
      const component = {
        type: Component.Type.ModelRef,
        modelType: 'GLB',
      } as Component.ModelRef;

      const node = {} as ISceneNodeInternal;

      const deserializedComponent = exportsForTesting.deserializeComponent(
        component as any,
        node,
        resolver,
        [],
        {},
      ) as IModelRefComponent;

      expect(deserializedComponent?.ref).toEqual('test-uuid');
      expect(deserializedComponent?.type).toEqual(component.type);
      expect(deserializedComponent?.modelType).toEqual(component.modelType);
    });

    it('should create a tag', () => {
      const component = {
        type: Component.Type.Tag,
        ref: 'test-uuid',
        icon: 'testIcon',
        ruleBasedMapId: '42',
        valueDataBinding: { dataBindingContext: 'dataBindingContext' },
        navLink: 'https://test-nav.link',
      } as Component.Tag;

      const node = {} as ISceneNodeInternal;

      const deserializedComponent = exportsForTesting.deserializeComponent(component, node, resolver, [], {});

      expect(deserializedComponent).toEqual(component);
    });

    it('should create a camera', () => {
      const component = {
        type: Component.Type.Camera,
        ref: 'test-uuid',
        cameraIndex: 0,
      } as Component.Camera;

      const node = {} as ISceneNodeInternal;

      exportsForTesting.deserializeComponent(component, node, resolver, [], {});

      expect(resolver).toHaveBeenCalledWith(Component.Type.Camera, 0);
    });

    it('should create a sub model', () => {
      const component = {
        type: Component.Type.SubModelRef,
        ref: 'test-uuid',
        parentRef: 'parentRef',
        selector: 'Mixer1',
      } as Component.SubModelRef;

      const node = { parentRef: 'parentRef' } as ISceneNodeInternal;

      const result = exportsForTesting.deserializeComponent(component, node, resolver, [], {});

      expect(result).toMatchSnapshot();
    });

    it('should create a light', () => {
      const component = {
        type: Component.Type.Light,
        ref: 'test-uuid',
        lightType: 'Ambient',
        lightSettings: {
          color: 0xffffff,
          intensity: 1,
          volume: 'full',
        },
      } as Component.Light;

      const node = {} as ISceneNodeInternal;

      const deserializedComponent = exportsForTesting.deserializeComponent(component, node, resolver, [], {});

      expect(deserializedComponent).toEqual(component);
    });

    it('should create a modelShader', () => {
      const component = {
        type: Component.Type.ModelShader,
        ref: 'test-uuid',
      } as Component.ModelShader;

      const node = {} as ISceneNodeInternal;

      const deserializedComponent = exportsForTesting.deserializeComponent(component, node, resolver, [], {});

      expect(deserializedComponent).toEqual(component);
    });

    it('should create a motion indicator when enabled', () => {
      const component = {
        type: Component.Type.MotionIndicator,
        ref: 'test-uuid',
        shape: 'LinearPlane',
        valueDataBindings: {
          speed: {
            ruleBasedMapId: '42',
            valueDataBinding: { dataBindingContext: 'dataBindingContext' },
          },
        },
        config: {
          numOfRepeatInY: 2,
          backgroundColorOpacity: 1,
        },
      } as Component.MotionIndicator;

      const node = {} as ISceneNodeInternal;

      const deserializedComponent = exportsForTesting.deserializeComponent(component, node, resolver, [], {});

      expect(deserializedComponent).toEqual(component);
      expect(
        exportsForTesting.deserializeComponent(component, node, resolver, [], { disableMotionIndicator: true }),
      ).toBeUndefined();
    });
  });

  it('should create a document state from a given scene', () => {
    jest.clearAllMocks();
    let idCount = 0;
    (generateUUID as jest.Mock).mockImplementation(() => {
      idCount++;
      return 'test-uuid' + idCount;
    });
    const scene = {
      specVersion: '1.1',
      version: '1.0',
      nodes: [
        {
          components: [
            {
              type: Component.Type.ModelRef,
              name: 'rootObj',
              modelType: 'GLB',
            },
          ],
          transform: {
            position: [0, 1, 2],
          },
        },
        {
          components: [
            {
              type: Component.Type.Tag,
              icon: 'testIcon',
              ruleBasedMapId: 0,
              valueDataBinding: { dataBindingContext: 'dataBindingContext' },
              navLink: 'https://test-nav.link',
            },
          ],
          transform: {
            position: [0, 1, 2],
          },
        },
        {
          components: [
            {
              type: Component.Type.Camera,
              cameraIndex: 0,
            },
          ],
          transform: {
            position: [0, 1, 2],
          },
        },
        {
          components: [
            {
              type: Component.Type.Light,
              lightType: 'Ambient',
              lightSettings: {
                color: 0xffffff,
                intensity: 1,
                volume: 'full',
              },
            },
          ],
          transform: {
            position: [0, 1, 2],
          },
        },
        {
          components: [
            {
              type: Component.Type.ModelShader,
            },
          ],
          transform: {
            position: [0, 1, 2],
          },
        },
      ],
      rootNodeIndexes: [0, 1, 2, 3],
      rules: [{ statements: [{ expression: 0, target: 'testTag' }] }],
      cameras: [{ cameraType: 'Perspective' }],
    };
    const componentNodeMap = {
      [Component.Type.ModelRef]: { 'test-uuid1': [expect.stringContaining('test-uuid')] },
      [Component.Type.Tag]: { 'test-uuid2': [expect.stringContaining('test-uuid')] },
      [Component.Type.Camera]: { 'test-uuid3': [expect.stringContaining('test-uuid')] },
      [Component.Type.Light]: { 'test-uuid4': [expect.stringContaining('test-uuid')] },
      [Component.Type.ModelShader]: { 'test-uuid5': [expect.stringContaining('test-uuid')] },
    };

    const documentState = exportsForTesting.createDocumentState(scene as any, [], {}) as ISceneDocumentInternal;

    expect(documentState.rootNodeRefs).toEqual(['test-uuid1', 'test-uuid2', 'test-uuid3', 'test-uuid4']);
    expect('test-uuid1' in documentState.nodeMap).toEqual(true);
    expect('test-uuid2' in documentState.nodeMap).toEqual(true);
    expect('test-uuid3' in documentState.nodeMap).toEqual(true);
    expect('test-uuid4' in documentState.nodeMap).toEqual(true);
    expect(documentState.componentNodeMap).toEqual(componentNodeMap);
  });

  it('should convert the nodes for serialization', () => {
    let uuidIndex = 0;
    (generateUUID as jest.Mock).mockImplementation(() => {
      return `test-uuid-${uuidIndex++}`;
    });
    const node = {
      ref: 'a2a91acc-3a47-4875-a146-b95741aedc2a',
      name: 'testNode',
      transform: {
        position: [0, 1, 2],
        rotation: [180, 90, 0],
        scale: [1, 1, 1],
      },
      transformConstraint: { snapToFloor: true },
      components: [
        {
          ref: 'a2a91acc-3a47-4875-a146-b95741aedc2a',
          type: 'Camera',
          cameraIndex: 0,
        },
        {
          ref: 'a2a91acc-3a47-4875-a146-b95741aedc2a',
          type: 'testComponent',
          details: { stuff: 'testStuff' },
        },
      ],
      parentRef: 'testParent',
      childRefs: ['testNode'],
      properties: { hiddenWhileImmersive: true },
    };
    const sceneNodeInternal = exportsForTesting.createSceneNodeInternal(node as any);
    sceneNodeInternal.components = [...(node.components as any)];
    sceneNodeInternal.childRefs = node.childRefs;
    const nodes = {
      testNode: sceneNodeInternal,
    };

    const mappedObjectCollector = { Node: { testNode: 0 } };
    const indexedObjectCollector = { testNode: [KnownComponentType.Camera] };

    const convertedNodes = exportsForTesting.convertNodes(nodes, mappedObjectCollector, indexedObjectCollector);

    const expected = [
      {
        children: [0], // This is circular but done for ease of testing
        components: [
          {
            cameraIndex: 0,
            type: 'Camera',
          },
          {
            details: {
              stuff: 'testStuff',
            },
            type: 'testComponent',
          },
        ],
        name: 'testNode',
        transform: node.transform,
        transformConstraint: node.transformConstraint,
        properties: { hiddenWhileImmersive: true },
      },
    ];
    expect(convertedNodes).toEqual(expected);
  });

  it('should convert a nodeRef and index map to an array of indices when calling convertNodeIndexes', () => {
    const nodeRefs = ['node1', 'node2'];
    const indexMap = { node1: 1, node2: 0 };

    expect(exportsForTesting.convertNodeIndexes(nodeRefs, indexMap)).toEqual([1, 0]);
  });

  it('should strip of refs when converting a Component to an external component when calling convertComponent', () => {
    const testComponent = {
      ref: 'a2a91acc-3a47-4875-a146-b95741aedc2a',
      type: 'Camera',
      cameraIndex: 0,
    };

    const expectedComponent = {
      type: 'Camera',
      cameraIndex: 0,
    };

    expect(exportsForTesting.convertComponent(testComponent)).toEqual(expectedComponent);
  });

  it('should convert rules', () => {
    const rules = {
      testRule: {
        statements: [
          {
            expression: 0,
            target: 'testTag',
          },
          {
            expression: 5,
            target: 'testTag2',
          },
        ],
      },
      testRule2: {
        statements: [
          {
            expression: 0,
            target: 'testTag3',
          },
        ],
      },
    };

    expect(exportsForTesting.convertRules(rules as any)).toEqual({
      testRule: {
        statements: [
          {
            expression: 0,
            target: 'testTag',
          },
          {
            expression: 5,
            target: 'testTag2',
          },
        ],
      },
      testRule2: {
        statements: [
          {
            expression: 0,
            target: 'testTag3',
          },
        ],
      },
    });
  });

  it('should serialize and deserialize a sceneDocument appropriately when calling serialize, deserialize', () => {
    (generateUUID as jest.Mock).mockReturnValue('test-uuid');

    const scene = {
      specVersion: '1.0',
      version: '1.0',
      nodes: [
        {
          type: Component.Type.ModelRef,
          name: 'rootObj',
          modelType: 'GLB',
          transform: {
            position: [0, 1, 2],
          },
        },
        {
          type: Component.Type.Tag,
          icon: 'testIcon',
          ruleBasedMapId: 42,
          valueDataBinding: { dataBindingContext: 'dataBindingContext' },
          navLink: 'https://test-nav.link',
          transform: {
            position: [0, 1, 2],
          },
        },
        {
          type: Component.Type.Camera,
          cameraIndex: 0,
          transform: {
            position: [0, 1, 2],
          },
        },
        {
          type: Component.Type.Light,
          lightType: 'Ambient',
          lightSettings: {
            color: 0xffffff,
            intensity: 1,
            volume: 'full',
          },
          transform: {
            position: [0, 1, 2],
          },
        },
        {
          type: Component.Type.ModelShader,
          transform: {
            position: [0, 1, 2],
          },
        },
      ],
      rootNodeIndexes: [0, 1, 2, 3],
      rules: [{ statements: [{ expression: 0, target: 'testTag' }] }],
      cameras: [{ cameraType: 'Perspective' }],
    };
    const sceneDocument = exportsForTesting.createDocumentState(scene as any, [], {});

    const json = SerializationHelpers.document.serialize(sceneDocument!, '1.0');

    expect(SerializationHelpers.document.deserialize(json)).toEqual({
      document: { ...sceneDocument },
      errors: [],
    });
  });

  it('will fail to deserialize non-json when calling desrialize', () => {
    expect(SerializationHelpers.document.deserialize('not json').errors).toHaveLength(1);
  });
});
