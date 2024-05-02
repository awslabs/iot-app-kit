import { isNumber } from 'lodash';

import {
  CURRENT_MAJOR_VERSION,
  CURRENT_MINOR_VERSION,
  CURRENT_VERSION,
  DEFAULT_CAMERA_SETTINGS,
  DEFAULT_DISTANCE_UNIT,
  DEFAULT_LIGHT_SETTINGS_MAP,
  LEGACY_VERSION,
} from '../../common/constants';
import { ERROR_MESSAGE_DICT, ErrorCode, ErrorLevel, SceneComposerRuntimeError } from '../../common/errors';
import {
  KnownComponentType,
  KnownSceneProperty,
  IFogSettings,
  IGroundPlaneSettings,
  ISceneBackgroundSetting,
  DEFAULT_FOG_COLOR,
  DEFAULT_FOG_NEAR,
  DEFAULT_FOG_FAR,
  DEFAULT_SCENE_BACKGROUND_COLOR,
  DEFAULT_GROUND_PLANE_COLOR,
} from '../../interfaces';
import DebugLogger from '../../logger/DebugLogger';
import { Component, DistanceUnit, ModelType, Node, Scene } from '../../models/SceneModels';
import { isDynamicNode } from '../../utils/entityModelUtils/sceneUtils';
import { colorToHexString, generateUUID } from '../../utils/mathUtils';
import {
  IAnchorComponentInternal,
  IAnimationComponentInternal,
  ICameraComponentInternal,
  IColorOverlayComponentInternal,
  IDataOverlayComponentInternal,
  IDeserializationResult,
  IEntityBindingComponentInternal,
  ILightComponentInternal,
  IModelRefComponentInternal,
  IMotionIndicatorComponentInternal,
  IRuleBasedMapInternal,
  ISceneComponentInternal,
  ISceneDocumentInternal,
  ISceneNodeInternal,
  ISerializationErrorDetails,
  ISubModelRefComponentInternal,
  SceneNodeRuntimeProperty,
  isISceneComponentInternal,
  IPlaneGeometryComponentInternal,
} from '../internalInterfaces';
import { isValidHexCode } from '../../utils/colorUtils';

import { addComponentToComponentNodeMap } from './componentMapHelpers';

const LOG = new DebugLogger('serializationHelpers');

/**
 * ResolvableObjectTypes and IndexedObjectResolver are helpers to parse the
 * deserialized scene document as it uses indexes to point to referenced
 * objects.
 *
 * Resolveable objects are all known components and rules, more can be added
 * later.
 *
 * TODO: Rules are special as they uses strings instead of array position as
 * index, we may change it to be consistent.
 */
export type ResolvableObjectTypes = Component.Type | 'Rule';
export type IndexedObjectResolver = (objectType: ResolvableObjectTypes, index?: number | string) => any | undefined;
export interface IDeserializeOptions {
  disableMotionIndicator?: boolean;
}

/******************************************************************************
 * Comopnent Deserializer
 *****************************************************************************/
function validateRuleBasedMapId(
  ruleBasedMapId: string | undefined,
  resolver: IndexedObjectResolver,
  errorCollector: ISerializationErrorDetails[],
) {
  if (ruleBasedMapId) {
    const ruleBasedMap = resolver?.('Rule', ruleBasedMapId);
    if (!ruleBasedMap) {
      // We should later change this to an input validation error
      LOG.warn('unable to find the rule by id ' + ruleBasedMapId + '.');
      errorCollector.push({
        level: ErrorLevel.WARNING,
        code: ErrorCode.SC_ERROR_LOAD_SCENE,
        message: ERROR_MESSAGE_DICT.INVALID_RULE,
        context: {
          ruleId: ruleBasedMapId,
        },
      });
    }
  }
}

function createSubModelRefComponent(
  component: Component.SubModelRef,
  parentRef?: string,
  _errorCollector?: ISerializationErrorDetails[],
): ISubModelRefComponentInternal | undefined {
  const { selector, parentRef: _oldRef, ...compProps } = component;

  return {
    ref: generateUUID(),
    parentRef,
    selector,
    ...compProps,
  };
}

function createModelRefComponent(
  component: Component.ModelRef,
  errorCollector: ISerializationErrorDetails[],
): IModelRefComponentInternal | undefined {
  const { modelType } = component;

  if ([ModelType.GLB, ModelType.GLTF, ModelType.Tiles3D].indexOf(modelType) === -1) {
    LOG.warn(`fileType not supported ${modelType}, the component will be skipped.`);
    errorCollector.push({
      level: ErrorLevel.WARNING,
      code: ErrorCode.SC_ERROR_LOAD_SCENE,
      message: ERROR_MESSAGE_DICT.UNKNOWN_MODEL_REF_MODEL_TYPE,
      context: {
        modelType: modelType,
      },
    });
    return;
  }

  return Object.assign({}, { ref: generateUUID() }, { ...component });
}

function createTagComponent(
  component: Component.Tag,
  resolver: IndexedObjectResolver,
  errorCollector: ISerializationErrorDetails[],
): IAnchorComponentInternal | undefined {
  const icon = component.icon;
  const ruleBasedMapId = component.ruleBasedMapId;
  const valueDataBinding = component.valueDataBinding;

  validateRuleBasedMapId(ruleBasedMapId, resolver, errorCollector);

  return {
    ref: generateUUID(),
    type: 'Tag',
    icon,
    chosenColor: component.chosenColor,
    customIcon: component.customIcon,
    ruleBasedMapId,
    valueDataBinding: {
      ...(valueDataBinding || {}),
    },
    navLink: component.navLink,
    offset: component.offset,
  };
}

function createCameraComponent(
  camera: Component.Camera,
  resolver: IndexedObjectResolver,
  _errorCollector: ISerializationErrorDetails[],
): ICameraComponentInternal | undefined {
  // If the camera is from a scene document which is indexed
  const cameraIndex = camera.cameraIndex;

  return resolver(Component.Type.Camera, cameraIndex);
}

function createLightComponent(
  light: Component.Light,
  _errorCollector: ISerializationErrorDetails[],
): ILightComponentInternal | undefined {
  // TODO: LightSettings should be validated

  // merge light settings with default settings so that all fields have valid default values
  const defaultLightSettings = DEFAULT_LIGHT_SETTINGS_MAP[light.lightType];
  const lightSettings = Object.assign({}, defaultLightSettings, light.lightSettings);
  if (lightSettings.color) {
    lightSettings.color = colorToHexString(lightSettings.color);
  }
  const groundColor = (lightSettings as Component.IHemisphereLightSettings).groundColor;
  if (groundColor) {
    (lightSettings as Component.IHemisphereLightSettings).groundColor = colorToHexString(groundColor);
  }

  return {
    ref: generateUUID(),
    type: KnownComponentType.Light,
    lightType: light.lightType,
    lightSettings,
  };
}

function createModelShaderComponent(
  component: Component.ModelShader,
  _errorCollector: ISerializationErrorDetails[],
): IColorOverlayComponentInternal {
  return Object.assign({}, { ref: generateUUID() }, { ...component });
}

function createMotionIndicatorComponent(
  component: Component.MotionIndicator,
  resolver: IndexedObjectResolver,
  errorCollector: ISerializationErrorDetails[],
): IMotionIndicatorComponentInternal | undefined {
  Object.values(component.valueDataBindings).forEach((map) => {
    validateRuleBasedMapId(map.ruleBasedMapId, resolver, errorCollector);
  });

  // defaultSpeed was saved as string in older version, convert it to number here
  const defaultSpeed = component.config.defaultSpeed !== undefined ? Number(component.config.defaultSpeed) : undefined;
  return {
    ref: generateUUID(),
    type: KnownComponentType.MotionIndicator,
    shape: component.shape,
    valueDataBindings: component.valueDataBindings,
    config: { ...component.config, defaultSpeed },
  };
}

function createDataOverlayComponent(
  component: Component.DataOverlay,
  _resolver: IndexedObjectResolver,
  _errorCollector: ISerializationErrorDetails[],
): IDataOverlayComponentInternal | undefined {
  return Object.assign({}, { ref: generateUUID() }, { ...component });
}

function createPlaneGeometryComponent(component: Component.Plane): IPlaneGeometryComponentInternal | undefined {
  return Object.assign({}, { ref: generateUUID() }, { ...component });
}

function createEntityBindingComponent(
  component: Component.EntityBindingComponent,
): IEntityBindingComponentInternal | undefined {
  return Object.assign({}, { ref: generateUUID() }, { ...component });
}

function deserializeComponent(
  component: Component.IComponent,
  node: ISceneNodeInternal,
  resolver: IndexedObjectResolver,
  errorCollector: ISerializationErrorDetails[],
  options: IDeserializeOptions,
): ISceneComponentInternal | undefined {
  switch (component.type) {
    case Component.Type.ModelRef: {
      return createModelRefComponent(component as Component.ModelRef, errorCollector);
    }
    case Component.Type.SubModelRef: {
      return createSubModelRefComponent(component as Component.SubModelRef, node.parentRef, errorCollector);
    }
    case Component.Type.Animation: {
      return createAnimationRefComponent(component as Component.Animation, errorCollector);
    }
    case Component.Type.Tag: {
      return createTagComponent(component as Component.Tag, resolver, errorCollector);
    }
    case Component.Type.Camera: {
      // Camera is special as in the Scene serialization format it only
      // stores a pointer to the Camera setting.
      // We don't consider the camera index as a way to reference existing
      // cameras. Each camera will be instantiated as individual instance.
      return createCameraComponent(component as Component.Camera, resolver, errorCollector);
    }
    case Component.Type.Light: {
      return createLightComponent(component as Component.Light, errorCollector);
    }
    case Component.Type.ModelShader: {
      return createModelShaderComponent(component as Component.ModelShader, errorCollector);
    }
    case Component.Type.MotionIndicator: {
      if (options.disableMotionIndicator) {
        LOG.info('skip deserializing motion indicator component since the component is disabled');
        return undefined;
      }

      return createMotionIndicatorComponent(component as Component.MotionIndicator, resolver, errorCollector);
    }
    case Component.Type.DataOverlay: {
      return createDataOverlayComponent(component as Component.DataOverlay, resolver, errorCollector);
    }
    case Component.Type.EntityBinding: {
      return createEntityBindingComponent(component as Component.EntityBindingComponent);
    }
    case Component.Type.PlaneGeometry: {
      return createPlaneGeometryComponent(component as Component.Plane);
    }
    default: {
      LOG.warn(`component not supported type[${component.type}]. It will be ignored.`);

      errorCollector.push({
        level: ErrorLevel.WARNING,
        code: ErrorCode.SC_ERROR_LOAD_SCENE,
        message: ERROR_MESSAGE_DICT.UNKNOWN_COMPONENT_TYPE,
        context: {
          componentType: component.type,
        },
      });
    }
  }
}

/******************************************************************************
 * Document Deserializer
 *****************************************************************************/

function parseSceneContent(sceneDocument: string, errorCollector: ISerializationErrorDetails[]): Scene {
  let json: any;

  try {
    json = JSON.parse(sceneDocument);
  } catch (error) {
    throw new SceneComposerRuntimeError({
      level: ErrorLevel.FATAL,
      code: ErrorCode.SC_ERROR_LOAD_SCENE,
      message: ERROR_MESSAGE_DICT.INVALID_DOCUMENT,
      context: {
        cause: 'not a valid JSON document',
      },
    });
  }

  const scene = json as Scene;

  const specVersion = scene.specVersion;
  if (!specVersion) {
    throw new SceneComposerRuntimeError({
      level: ErrorLevel.FATAL,
      code: ErrorCode.SC_ERROR_LOAD_SCENE,
      message: ERROR_MESSAGE_DICT.INVALID_DOCUMENT,
      context: {
        cause: 'unable to find specVersion',
      },
    });
  }

  if (typeof specVersion !== 'string') {
    throw new SceneComposerRuntimeError({
      level: ErrorLevel.FATAL,
      code: ErrorCode.SC_ERROR_LOAD_SCENE,
      message: ERROR_MESSAGE_DICT.INVALID_DOCUMENT,
      context: {
        cause: 'specVersion is not a string',
      },
    });
  }

  if (specVersion === LEGACY_VERSION) {
    throw new SceneComposerRuntimeError({
      level: ErrorLevel.FATAL,
      code: ErrorCode.SC_ERROR_LOAD_SCENE,
      message: ERROR_MESSAGE_DICT.INVALID_DOCUMENT,
      context: {
        cause:
          'the scene is created in private-beta and is no longer supported. ' +
          'Please reach out to your account manager for a solution',
      },
    });
  }

  const versionParts = specVersion
    .split('.')
    .map((part) => Number.parseInt(part))
    .filter((n) => Number.isSafeInteger(n));

  if (versionParts.length !== 2) {
    throw new SceneComposerRuntimeError({
      level: ErrorLevel.FATAL,
      code: ErrorCode.SC_ERROR_LOAD_SCENE,
      message: ERROR_MESSAGE_DICT.INVALID_DOCUMENT,
      context: {
        cause: 'specVersion is not well-formatted',
      },
    });
  }

  const majorVersion = versionParts[0];
  const minorVersion = versionParts[1];

  if (majorVersion > CURRENT_MAJOR_VERSION) {
    throw new SceneComposerRuntimeError({
      level: ErrorLevel.FATAL,
      code: ErrorCode.SC_ERROR_LOAD_SCENE,
      message: ERROR_MESSAGE_DICT.SPECVERSION_MAJOR_VERSION_TOO_NEW,
      context: {
        cause: 'specVersion is not supported',
        sourceMajorVersion: `${majorVersion}`,
        supportedMajorVersion: `${CURRENT_MAJOR_VERSION}`,
      },
    });
  }

  if (minorVersion > CURRENT_MINOR_VERSION) {
    errorCollector.push({
      level: ErrorLevel.WARNING,
      code: ErrorCode.SC_ERROR_LOAD_SCENE,
      message: ERROR_MESSAGE_DICT.SPECVERSION_MINOR_VERSION_TOO_NEW,
      context: {
        sourceMinorVersion: `${minorVersion}`,
        supportedMinorVersion: `${CURRENT_MINOR_VERSION}`,
      },
    });
  }

  return scene;
}

// This is a helper function used to transform serialized node format.
// We transform one node a time, thus the children of the node is not processed.
// Components are also not processed here because the serialized node format
// requires two-pass parsing. We'll first generate all nodes then resolve
// all the referenced values in the second pass.
function createSceneNodeInternal(deserializedNode: Node) {
  const uuid = generateUUID();
  const result: ISceneNodeInternal = {
    ref: uuid,
    name: deserializedNode.name || uuid,
    transform: {
      position: deserializedNode.transform.position ?? [0, 0, 0],
      rotation: deserializedNode.transform.rotation ?? [0, 0, 0],
      scale: deserializedNode.transform.scale ?? [1, 1, 1],
    },
    transformConstraint: deserializedNode.transformConstraint ?? {},
    properties: deserializedNode.properties ? deserializedNode.properties : {},

    // This function just convert a single node, does not fill these fields
    components: [],
    parentRef: undefined,
    childRefs: [],
  };

  return result;
}

function createAnimationRefComponent(
  component: Component.Animation,
  _errorCollector?: ISerializationErrorDetails[],
): IAnimationComponentInternal | undefined {
  const { currentAnimations, uri, ...compProps } = component;
  return {
    ref: generateUUID(),
    currentAnimations,
    uri,
    ...compProps,
  };
}

// Handling indexed/referenced values as we pulled them from the serialized format
function createObjectResolver(scene: Scene): IndexedObjectResolver {
  const cameraComponents = scene.cameras
    ? scene.cameras.map((camera) => {
        const cameraComponent: ICameraComponentInternal = {
          type: KnownComponentType.Camera,
          ...DEFAULT_CAMERA_SETTINGS,
          ...camera,
          ref: generateUUID(),
        };
        return cameraComponent;
      })
    : [];

  // TODO: add more validations to ensure the rules are valid.
  const rules = scene.rules;

  const resolver: IndexedObjectResolver = (objectType, index) => {
    if (index === undefined) {
      return undefined;
    }

    if (objectType === Component.Type.Camera) {
      if ((index as number) < 0 || (index as number) >= cameraComponents.length) {
        throw new SceneComposerRuntimeError({
          level: ErrorLevel.FATAL,
          code: ErrorCode.SC_ERROR_LOAD_SCENE,
          message: ERROR_MESSAGE_DICT.INVALID_DOCUMENT,
          context: {
            cause: 'Camera index out of bound ' + index,
          },
        });
      }
      return cameraComponents[index];
    } else if (objectType === 'Rule') {
      if (!rules || !(index in rules)) {
        throw new SceneComposerRuntimeError({
          level: ErrorLevel.FATAL,
          code: ErrorCode.SC_ERROR_LOAD_SCENE,
          message: ERROR_MESSAGE_DICT.INVALID_DOCUMENT,
          context: {
            cause: `Rule#[${index}] not found`,
          },
        });
      }
      return rules[index];
    } else {
      throw new SceneComposerRuntimeError({
        level: ErrorLevel.FATAL,
        code: ErrorCode.SC_ERROR_LOAD_SCENE,
        message: ERROR_MESSAGE_DICT.INVALID_DOCUMENT,
        context: {
          cause: `Unable to resolve the object type ${objectType}`,
        },
      });
    }
  };

  return resolver;
}

function createDocumentState(
  scene: Scene,
  errorCollector: ISerializationErrorDetails[],
  options: IDeserializeOptions,
): ISceneDocumentInternal | undefined {
  const resolver = createObjectResolver(scene);

  // - First pass: build nodes and generate a ref for each node
  const internalNodes = scene.nodes.map((deserializedNode) => {
    // parent, children and components will be set in the second pass
    const internalNode = createSceneNodeInternal(deserializedNode);
    return internalNode;
  });

  const componentNodeMap = {};

  // - Second pass: create components and resolve all references
  internalNodes.forEach((internalNode, nodeIndex) => {
    const node = scene.nodes[nodeIndex];

    // Create components
    const components = node.components
      ?.map((component) => {
        const comp = deserializeComponent(component, internalNodes[nodeIndex], resolver, errorCollector, options);
        if (comp?.type) {
          if (!componentNodeMap[comp.type]) {
            componentNodeMap[comp.type] = {};
          }
          addComponentToComponentNodeMap(componentNodeMap[comp.type], internalNode.ref, comp.ref);
        }
        return comp;
      })
      .filter(isISceneComponentInternal);
    internalNode.components = components ?? [];

    // Link parent and children
    node.children?.forEach((childIndex) => {
      if (childIndex < 0 || childIndex >= internalNodes.length) {
        throw new SceneComposerRuntimeError({
          level: ErrorLevel.FATAL,
          code: ErrorCode.SC_ERROR_LOAD_SCENE,
          message: ERROR_MESSAGE_DICT.INVALID_DOCUMENT,
          context: {
            cause: `Invalid child#[${childIndex}] found in node#[${nodeIndex}]`,
          },
        });
      }
      const childNode = internalNodes[childIndex];
      internalNode.childRefs.push(childNode.ref);
      childNode.parentRef = internalNode.ref;
    });
  });

  // Rules
  let internalRuleMap: Record<string, IRuleBasedMapInternal> = {};

  if (scene.rules) {
    internalRuleMap = Object.fromEntries(
      Object.keys(scene.rules).map((key) => {
        const rule = scene.rules![key];
        const statements = rule.statements;
        return [
          key,
          {
            statements: statements.map((s) => ({
              expression: s.expression,
              target: s.target,
              targetMetadata: s.targetMetadata,
            })),
          },
        ];
      }),
    );
  }

  if (scene.properties) {
    if (scene.properties[KnownSceneProperty.FogCustomColors]) {
      scene.properties[KnownSceneProperty.FogCustomColors] = (
        scene.properties[KnownSceneProperty.FogCustomColors] as string[]
      ).filter((color) => isValidHexCode(color));
    }
    if (scene.properties[KnownSceneProperty.BackgroundCustomColors]) {
      scene.properties[KnownSceneProperty.BackgroundCustomColors] = (
        scene.properties[KnownSceneProperty.BackgroundCustomColors] as string[]
      ).filter((color) => isValidHexCode(color));
    }
    if (scene.properties[KnownSceneProperty.GroundCustomColors]) {
      scene.properties[KnownSceneProperty.GroundCustomColors] = (
        scene.properties[KnownSceneProperty.GroundCustomColors] as string[]
      ).filter((color) => isValidHexCode(color));
    }
    if (scene.properties[KnownSceneProperty.FogSettings]) {
      const fogSettings = scene.properties[KnownSceneProperty.FogSettings] as IFogSettings;
      fogSettings.color = isValidHexCode(fogSettings.color) ? fogSettings.color : DEFAULT_FOG_COLOR;
      fogSettings.near = fogSettings.near && fogSettings.near > 0 ? fogSettings.near : DEFAULT_FOG_NEAR;
      fogSettings.far = fogSettings.far && fogSettings.far > 0 ? fogSettings.far : DEFAULT_FOG_FAR;
      scene.properties[KnownSceneProperty.FogSettings] = fogSettings;
    }
    if (scene.properties[KnownSceneProperty.SceneBackgroundSettings]) {
      const backgroundSettings = scene.properties[
        KnownSceneProperty.SceneBackgroundSettings
      ] as ISceneBackgroundSetting;
      backgroundSettings.color = backgroundSettings.color
        ? isValidHexCode(backgroundSettings.color)
          ? backgroundSettings.color
          : DEFAULT_SCENE_BACKGROUND_COLOR
        : undefined;
      scene.properties[KnownSceneProperty.SceneBackgroundSettings] = backgroundSettings;
    }
    if (scene.properties[KnownSceneProperty.GroundPlaneSettings]) {
      const groundPlaneSettings = scene.properties[KnownSceneProperty.GroundPlaneSettings] as IGroundPlaneSettings;
      groundPlaneSettings.color = groundPlaneSettings.color
        ? isValidHexCode(groundPlaneSettings.color)
          ? groundPlaneSettings.color
          : DEFAULT_GROUND_PLANE_COLOR
        : undefined;
      groundPlaneSettings.opacity =
        groundPlaneSettings.opacity >= 0 && groundPlaneSettings.opacity <= 1 ? groundPlaneSettings.opacity : 0;
      scene.properties[KnownSceneProperty.GroundPlaneSettings] = groundPlaneSettings;
    }
  }

  const nodeMap = Object.fromEntries(internalNodes.map((node) => [node.ref, node]));

  const document: ISceneDocumentInternal = {
    nodeMap: nodeMap,
    componentNodeMap,
    rootNodeRefs: scene.rootNodeIndexes.map((index) => internalNodes[index].ref),
    ruleMap: internalRuleMap,
    unit: scene.unit ?? DEFAULT_DISTANCE_UNIT,
    version: scene.version,
    specVersion: scene.specVersion ?? CURRENT_VERSION,
    properties: scene.properties || {},
  };

  return document;
}

function deserializeDocument(sceneContent: string, options?: IDeserializeOptions): IDeserializationResult {
  const errorCollector: ISerializationErrorDetails[] = [];

  const result: IDeserializationResult = {
    document: undefined,
    errors: [],
  };

  try {
    const scene = parseSceneContent(sceneContent, errorCollector);
    result.document = createDocumentState(scene, errorCollector, options || {});
  } catch (error: any) {
    LOG.error('failed to parse the scene', error);

    if (error instanceof SceneComposerRuntimeError) {
      errorCollector.push(error.details);
    } else {
      errorCollector.push({
        level: ErrorLevel.FATAL,
        code: ErrorCode.SC_ERROR_LOAD_SCENE,
        message: ERROR_MESSAGE_DICT.UNKNOWN_ERROR,
        context: {
          cause: error.message ?? ERROR_MESSAGE_DICT.UNKNOWN_ERROR,
        },
      });
    }
  }

  result.errors = errorCollector;

  return result;
}

/******************************************************************************
 * Document Serializer
 *****************************************************************************/

function convertNodes(
  nodes: Record<string, ISceneNodeInternal>,
  mappedObjectCollector: Record<string, Record<string, any>>,
  indexedObjectCollector: Record<string, Array<any>>,
): Node[] {
  const nodeRefToIndexMap = mappedObjectCollector.Node!;

  // create nodes first
  const exportedNodes: Node[] = [];
  Object.getOwnPropertyNames(nodes).forEach((nodeRef) => {
    const node = nodes[nodeRef]!;
    // Do not serialize dynamic nodes
    if (isDynamicNode(node)) {
      return;
    }

    const convertedComponents: any[] = [];

    node.components.forEach((component) => {
      if (component.type === KnownComponentType.Camera) {
        // Handle camera component
        const camera = component as ICameraComponentInternal;
        if (!indexedObjectCollector[KnownComponentType.Camera]) {
          indexedObjectCollector[KnownComponentType.Camera] = [];
        }
        const cameraArray = indexedObjectCollector[KnownComponentType.Camera]!;
        const len = cameraArray.length;
        const { ref: _ref, type: _type, ...cameraComponent } = convertComponent(camera) as ICameraComponentInternal;
        cameraArray.push(cameraComponent);
        const indexedCameraComponent: Component.Camera = {
          type: Component.Type.Camera,
          cameraIndex: len,
        };
        convertedComponents.push(indexedCameraComponent);
      } else {
        // Handle generic components
        const convertedComponent = convertComponent(component);
        convertedComponents.push(convertedComponent);
      }
    });

    // Do not serialize runtime scene node properties
    const properties = {};
    Object.keys(node.properties).forEach((key) => {
      if (!Object.values(SceneNodeRuntimeProperty).includes(key as SceneNodeRuntimeProperty)) {
        properties[key] = node.properties[key];
      }
    });

    exportedNodes.push({
      name: node.name,
      transform: node.transform,
      transformConstraint: node.transformConstraint,
      children: undefined,
      components: convertedComponents,
      properties,
    });

    nodeRefToIndexMap[node.ref] = exportedNodes.length - 1;
  });

  // filling the children
  for (const key in nodes) {
    const node = nodes[key];
    const index = nodeRefToIndexMap[key]!;
    const exportedNode = exportedNodes[index];
    if (exportedNode && node.childRefs && node.childRefs.length > 0) {
      // we know the indexMap will not return undefined
      exportedNode.children = node.childRefs.map((ref) => nodeRefToIndexMap[ref]).filter((index) => isNumber(index));
    }
  }

  return exportedNodes;
}

function convertNodeIndexes(nodeRefs: string[], indexMap: Record<string, number>): number[] {
  return nodeRefs.map((ref) => indexMap[ref]).filter((index) => isNumber(index));
}

// Component is really flexible so what this function does is just a shape change
function convertComponent(component: ISceneComponentInternal): Component.IComponent {
  const { ref: _ref, ...componentWithoutRef } = component;

  // TODO: we may add some more validations here.
  return componentWithoutRef as unknown as Component.IComponent;
}

// Does nothing at the moment. This is here as a means of preparation should we have a difference
function convertRules(ruleMap: Record<string, IRuleBasedMapInternal>) {
  return Object.fromEntries(
    Object.keys(ruleMap).map((ruleId) => {
      const ruleBasedMap = ruleMap[ruleId];
      const statements = ruleBasedMap.statements.map((s) => ({
        expression: s.expression,
        target: s.target,
        targetMetadata: s.targetMetadata,
      }));
      return [
        ruleId,
        {
          statements: statements,
        },
      ];
    }),
  );
}

function serializeDocument(document: ISceneDocumentInternal, specVersion: string, ...stringifyArgs): string {
  if (specVersion !== CURRENT_VERSION) {
    throw new Error(`Unsupported specVersion: ${specVersion}`);
  }

  const ruleBasedMapInDoc = document?.ruleMap;
  const rules = convertRules(ruleBasedMapInDoc);
  const mappedObjectCollector: Record<string, Record<string, any>> = {};
  const indexedObjectCollector: Record<string, Array<any>> = {};
  mappedObjectCollector.Rule = rules;
  mappedObjectCollector.Node = {};

  const exportedNodes = convertNodes(document.nodeMap, mappedObjectCollector, indexedObjectCollector);

  const exportedScene = {
    specVersion: CURRENT_VERSION,
    version: document.version,
    unit: document.unit as DistanceUnit,

    properties: document.properties,

    nodes: exportedNodes,
    rootNodeIndexes: convertNodeIndexes(document.rootNodeRefs, mappedObjectCollector.Node!),

    cameras: indexedObjectCollector[KnownComponentType.Camera]
      ? (indexedObjectCollector[KnownComponentType.Camera] as any[])
      : [],

    rules,
  };

  return JSON.stringify(exportedScene, ...stringifyArgs);
}

export default {
  document: {
    deserialize: deserializeDocument,
    serialize: serializeDocument,
  },
};

export const exportsForTesting = {
  createModelRefComponent,
  createTagComponent,
  createCameraComponent,
  createLightComponent,
  createModelShaderComponent,
  createMotionIndicatorComponent,
  createDataOverlayComponent,
  createEntityBindingComponent,
  createAnimationRefComponent,
  createPlaneGeometryComponent,
  deserializeComponent,
  parseSceneContent,
  createSceneNodeInternal,
  createObjectResolver,
  createDocumentState,
  convertNodes,
  convertNodeIndexes,
  convertComponent,
  convertRules,
};
