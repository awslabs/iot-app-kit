import {
  type CreateEntityCommandInput,
  type CreateEntityCommandOutput,
  type PropertyRequest,
  type UpdateEntityCommandInput,
  type UpdateEntityCommandOutput,
} from '@aws-sdk/client-iottwinmaker';

import {
  DEFAULT_LAYER_COMPONENT_NAME,
  DEFAULT_LAYER_RELATIONSHIP_NAME,
  DEFAULT_NODE_COMPONENT_NAME,
  LAYER_COMPONENT_TYPE_ID,
  LAYER_ROOT_ENTITY_ID,
  LayerType,
  layerPropertyNames,
} from '../../common/entityModelConstants';
import { getGlobalSettings } from '../../common/GlobalSettings';
import { generateUUID } from '../mathUtils';

export const LAYER_DEFAULT_REFRESH_INTERVAL = 30 * 1000;

export const createLayerId = (layerName: string): string => {
  return `LAYER_${layerName}_${generateUUID()}`;
};

export const createLayer = (layerName: string, type: LayerType): Promise<CreateEntityCommandOutput> | undefined => {
  const layerId = createLayerId(layerName);
  const input: CreateEntityCommandInput = {
    workspaceId: undefined,
    entityId: layerId,
    parentEntityId: LAYER_ROOT_ENTITY_ID,
    entityName: layerId,
    components: {
      [DEFAULT_LAYER_COMPONENT_NAME]: {
        componentTypeId: LAYER_COMPONENT_TYPE_ID,
        properties: {
          [layerPropertyNames.type]: {
            value: {
              stringValue: type,
            },
          },
        },
      },
    },
  };

  if (type === LayerType.Relationship) {
    input.components![DEFAULT_LAYER_COMPONENT_NAME].properties![layerPropertyNames.relationshipName] = {
      value: {
        stringValue: DEFAULT_LAYER_RELATIONSHIP_NAME,
      },
    };
  }
  // TODO: handle create query type layer

  return getGlobalSettings().twinMakerSceneMetadataModule?.createSceneEntity(input);
};

export const attachToLayerRequest = (layerId: string): Record<string, PropertyRequest> => {
  return {
    [DEFAULT_LAYER_RELATIONSHIP_NAME]: {
      value: {
        relationshipValue: {
          targetEntityId: layerId,
          targetComponentName: DEFAULT_LAYER_COMPONENT_NAME,
        },
      },
    },
  };
};

export const attachToLayer = (
  layerId: string,
  sceneEntityId: string,
): Promise<UpdateEntityCommandOutput> | undefined => {
  const updateSceneEntity: UpdateEntityCommandInput = {
    workspaceId: undefined,
    entityId: sceneEntityId,
    componentUpdates: {
      [DEFAULT_NODE_COMPONENT_NAME]: {
        propertyUpdates: attachToLayerRequest(layerId),
      },
    },
  };

  return getGlobalSettings().twinMakerSceneMetadataModule?.updateSceneEntity(updateSceneEntity);
};
