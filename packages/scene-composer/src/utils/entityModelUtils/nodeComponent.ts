import { ComponentRequest, ComponentUpdateRequest, ComponentUpdateType } from '@aws-sdk/client-iottwinmaker';
import { DocumentType } from '@aws-sdk/types';
import { isEmpty } from 'lodash';

import { IEntityBindingComponent, ISceneNode } from '../../interfaces';
import {
  DEFAULT_ENTITY_BINDING_RELATIONSHIP_NAME,
  NODE_COMPONENT_TYPE_ID,
  componentTypeToId,
} from '../../common/entityModelConstants';
import { ISceneComponentInternal, ISceneNodeInternal } from '../../store';
import { SceneNodeRuntimeProperty } from '../../store/internalInterfaces';

import { attachToLayerRequest } from './sceneLayerUtils';
import { parseTagComp } from './tagComponent';
import { parseOverlayComp } from './overlayComponent';
import { parseModelRefComp } from './modelRefComponent';
import { parseCameraComp } from './cameraComponent';
import { parseMotionIndicatorComp } from './motionIndicatorComponent';

enum NodeComponentProperty {
  Name = 'name',
  TransformPosition = 'transform_position',
  TransformRotation = 'transform_rotation',
  TransformScale = 'transform_scale',
  TransformConstraintSnapToFloor = 'transformConstraint_snapToFloor',
  Properties = 'properties',
}

export const createNodeEntityComponent = (node: ISceneNode, layerId?: string): ComponentRequest => {
  const comp: ComponentRequest = {
    componentTypeId: NODE_COMPONENT_TYPE_ID,
    properties: {
      [NodeComponentProperty.Name]: {
        value: {
          stringValue: node.name ?? 'Node',
        },
      },
    },
  };
  if (node.transform?.position) {
    comp.properties![NodeComponentProperty.TransformPosition] = {
      value: {
        listValue: node.transform.position.map((v) => ({ doubleValue: v })),
      },
    };
  }
  if (node.transform?.rotation) {
    comp.properties![NodeComponentProperty.TransformRotation] = {
      value: {
        listValue: node.transform.rotation.map((v) => ({ doubleValue: v })),
      },
    };
  }
  if (node.transform?.scale) {
    comp.properties![NodeComponentProperty.TransformScale] = {
      value: {
        listValue: node.transform.scale.map((v) => ({ doubleValue: v })),
      },
    };
  }
  if (node.transformConstraint?.snapToFloor !== undefined) {
    comp.properties![NodeComponentProperty.TransformConstraintSnapToFloor] = {
      value: {
        booleanValue: node.transformConstraint.snapToFloor,
      },
    };
  }
  if (layerId) {
    comp.properties = Object.assign(comp.properties!, attachToLayerRequest(layerId));
  }

  const params = {};
  Object.keys(node.properties || {}).forEach((k) => {
    if (Object.values(SceneNodeRuntimeProperty).includes(k as SceneNodeRuntimeProperty)) {
      return;
    }
    const value = node.properties![k];
    if (value !== undefined) {
      params[k] = { stringValue: String(value) };
    }
  });
  if (!isEmpty(params)) {
    comp.properties![NodeComponentProperty.Properties] = {
      value: {
        mapValue: params,
      },
    };
  }

  return comp;
};

export const updateNodeEntityComponent = (
  node: ISceneNode,
  layerId?: string,
  updateType?: ComponentUpdateType,
): ComponentUpdateRequest => {
  const request = createNodeEntityComponent(node, layerId);
  const entityBinding = node.components?.find((component) => component.type === 'EntityBinding');
  const entityId = (entityBinding as IEntityBindingComponent)?.valueDataBinding?.dataBindingContext?.entityId;

  if (entityId) {
    request.properties![DEFAULT_ENTITY_BINDING_RELATIONSHIP_NAME] = {
      value: {
        relationshipValue: {
          targetEntityId: entityId,
        },
      },
    };
  } else if (updateType === 'DELETE') {
    // TODO: handle clear entity binding
    console.error('Delete Entity Binding is not currently supported.');
  }

  return {
    componentTypeId: request.componentTypeId,
    propertyUpdates: request.properties,
  };
};

const parseNodeComponents = (components: DocumentType): ISceneComponentInternal[] => {
  const results: ISceneComponentInternal[] = [];
  if (isEmpty(components) || !(components instanceof Array)) {
    return [];
  }

  components.forEach((comp) => {
    if (!comp) {
      return;
    }
    switch (comp['componentTypeId']) {
      case componentTypeToId.Tag: {
        const tag = parseTagComp(comp);
        if (tag) {
          results.push(tag);
        }
        break;
      }
      case componentTypeToId.DataOverlay: {
        const overlay = parseOverlayComp(comp);
        if (overlay) {
          results.push(overlay);
        }
        break;
      }
      case componentTypeToId.ModelRef: {
        const modelRef = parseModelRefComp(comp);
        if (modelRef) {
          results.push(modelRef);
        }
        break;
      }
      case componentTypeToId.Camera: {
        const camera = parseCameraComp(comp);
        if (camera) {
          results.push(camera);
        }
        break;
      }
      case componentTypeToId.MotionIndicator: {
        const indicator = parseMotionIndicatorComp(comp);
        if (indicator) {
          results.push(indicator);
        }
        break;
      }
      case NODE_COMPONENT_TYPE_ID:
        // Ignore node component
        break;
      default:
        console.warn('Unknown scene component type', comp['componentTypeId']);
        break;
    }
  });

  return results;
};

export const parseNode = (entity: DocumentType, nodeCompo: DocumentType): ISceneNodeInternal | undefined => {
  if (!nodeCompo?.['properties'] || !entity?.['entityId']) {
    return undefined;
  }

  const properties =
    nodeCompo['properties'].find((p) => p['propertyName'] === NodeComponentProperty.Properties)?.propertyValue ?? {};

  Object.keys(properties).forEach((k) => {
    properties[k] = k === 'alwaysVisible' || k === 'hiddenWhileImmersive' ? Boolean(properties[k]) : properties[k];
  });

  const node: ISceneNodeInternal = {
    ref: entity['entityId'],
    childRefs: [],
    name: nodeCompo['properties'].find((p) => p.propertyName === NodeComponentProperty.Name)?.propertyValue ?? 'Node',
    components: parseNodeComponents(entity['components']),
    transform: {
      position: nodeCompo['properties'].find((p) => p['propertyName'] === NodeComponentProperty.TransformPosition)
        ?.propertyValue ?? [0, 0, 0],
      scale: nodeCompo['properties'].find((p) => p['propertyName'] === NodeComponentProperty.TransformScale)
        ?.propertyValue ?? [1, 1, 1],
      rotation: nodeCompo['properties'].find((p) => p['propertyName'] === NodeComponentProperty.TransformRotation)
        ?.propertyValue ?? [0, 0, 0],
    },
    transformConstraint: {
      snapToFloor: nodeCompo['properties'].find(
        (p) => p['propertyName'] === NodeComponentProperty.TransformConstraintSnapToFloor,
      )?.propertyValue,
    },
    properties,
  };

  return node;
};
