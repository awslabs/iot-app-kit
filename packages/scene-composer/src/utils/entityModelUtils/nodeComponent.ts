import { ComponentRequest, ComponentUpdateRequest } from '@aws-sdk/client-iottwinmaker';
import { isEmpty } from 'lodash';

import { ISceneNode } from '../../interfaces';
import { NODE_COMPONENT_TYPE_ID } from '../../common/entityModelConstants';

import { attachToLayerRequest } from './sceneLayerUtils';

export const createNodeEntityComponent = (node: ISceneNode, layerId?: string): ComponentRequest => {
  const comp: ComponentRequest = {
    componentTypeId: NODE_COMPONENT_TYPE_ID,
    properties: {
      name: {
        value: {
          stringValue: node.name ?? 'Node',
        },
      },
    },
  };
  if (node.transform?.position) {
    comp.properties!['transform_position'] = {
      value: {
        listValue: node.transform.position.map((v) => ({ doubleValue: v })),
      },
    };
  }
  if (node.transform?.rotation) {
    comp.properties!['transform_rotation'] = {
      value: {
        listValue: node.transform.rotation.map((v) => ({ doubleValue: v })),
      },
    };
  }
  if (node.transform?.scale) {
    comp.properties!['transform_scale'] = {
      value: {
        listValue: node.transform.scale.map((v) => ({ doubleValue: v })),
      },
    };
  }
  if (node.transformConstraint?.snapToFloor !== undefined) {
    comp.properties!['transformConstraint_snapToFloor'] = {
      value: {
        booleanValue: node.transformConstraint.snapToFloor,
      },
    };
  }
  if (layerId) {
    comp.properties = Object.assign(comp.properties!, attachToLayerRequest(layerId));
  }
  if (!isEmpty(node.properties)) {
    const params = {};
    Object.keys(node.properties).forEach((k) => {
      params[k] = { stringValue: encodeURI(node.properties![k]) };
    });
    comp.properties!['properties'] = {
      value: {
        mapValue: params,
      },
    };
  }

  return comp;
};

export const updateNodeEntityComponent = (node: ISceneNode, layerId?: string): ComponentUpdateRequest => {
  const request = createNodeEntityComponent(node, layerId);
  return {
    componentTypeId: request.componentTypeId,
    propertyUpdates: request.properties,
  };
};
