import { KnownComponentType } from '../interfaces';

export const MAX_PROPERTY_STRING_LENGTH = 2048;

// Scene Nodes
const SCENE_COMPONENT_TYPE_ID_PREFIX = 'com.amazon.iottwinmaker.3d';
export const SCENE_COMPONENT_TYPE_ID = `${SCENE_COMPONENT_TYPE_ID_PREFIX}.scene`;
export const NODE_COMPONENT_TYPE_ID = `${SCENE_COMPONENT_TYPE_ID_PREFIX}.node`;
export const LAYER_COMPONENT_TYPE_ID = `${SCENE_COMPONENT_TYPE_ID_PREFIX}.layer`;
export const componentTypeToId: Record<KnownComponentType, string> = {
  Tag: `${SCENE_COMPONENT_TYPE_ID_PREFIX}.component.tag`,
  DataOverlay: `${SCENE_COMPONENT_TYPE_ID_PREFIX}.component.dataoverlay`,
  ModelRef: `${SCENE_COMPONENT_TYPE_ID_PREFIX}.component.modelref`,
  ModelShader: `${SCENE_COMPONENT_TYPE_ID_PREFIX}.component.modelshader`,
  SubModelRef: `${SCENE_COMPONENT_TYPE_ID_PREFIX}.component.submodelref`,
  Animation: `${SCENE_COMPONENT_TYPE_ID_PREFIX}.component.animation`,
  MotionIndicator: `${SCENE_COMPONENT_TYPE_ID_PREFIX}.component.motionindicator`,
  Light: `${SCENE_COMPONENT_TYPE_ID_PREFIX}.component.light`,
  Camera: `${SCENE_COMPONENT_TYPE_ID_PREFIX}.component.camera`,
  EntityBinding: NODE_COMPONENT_TYPE_ID, // EntityBinding is saved at node component
  PlaneGeometry: `test.${SCENE_COMPONENT_TYPE_ID_PREFIX}.component.planegeometry`, //Remove .test with GA
};
export const DEFAULT_ENTITY_BINDING_RELATIONSHIP_NAME = 'isVisualOf';
export const DEFAULT_PARENT_RELATIONSHIP_NAME = 'isChildOf';
export const SUB_MODEL_REF_PARENT_RELATIONSHIP_NAME = 'parentRef';
export const DEFAULT_NODE_COMPONENT_NAME = 'Node';
export const SCENE_ROOT_ENTITY_ID = 'SCENES_EntityId';
export const SCENE_ROOT_ENTITY_COMPONENT_NAME = 'Scene';
export const SCENE_ROOT_ENTITY_NAME = '$SCENES';

// Matterport
export const MATTERPORT_TAG_LAYER_PREFIX = 'Matterport_Tag_';

// Layer
export const DEFAULT_LAYER_RELATIONSHIP_NAME = 'inLayerOf';
export const DEFAULT_LAYER_COMPONENT_NAME = 'Layer';
export const LAYER_ROOT_ENTITY_ID = 'LAYERS_EntityId';
export const LAYER_ROOT_ENTITY_NAME = '$LAYERS';
export enum LayerType {
  Relationship = 'Relationship',
  Query = 'Query',
}
export const layerPropertyNames = {
  type: 'type',
  queryString: 'queryString',
  relationshipName: 'relationshipName',
};
