import { type TwinMakerSceneMetadataModule } from '@iot-app-kit/source-iottwinmaker';

import { setTwinMakerSceneMetadataModule } from '../../common/GlobalSettings';
import {
  LayerType,
  LAYER_ROOT_ENTITY_ID,
  DEFAULT_LAYER_COMPONENT_NAME,
  LAYER_COMPONENT_TYPE_ID,
  layerPropertyNames,
  DEFAULT_LAYER_RELATIONSHIP_NAME,
  DEFAULT_NODE_COMPONENT_NAME,
} from '../../common/entityModelConstants';

import { attachToLayer, attachToLayerRequest, createLayer, createLayerId } from './sceneLayerUtils';

jest.mock('../mathUtils', () => ({
  generateUUID: jest.fn(() => 'random-uuid'),
}));

describe('createLayerId', () => {
  it('should return expected scene layer entityId', () => {
    expect(createLayerId('test')).toEqual('LAYER_test_random-uuid');
  });
});

describe('createLayer', () => {
  const createSceneEntity = jest.fn();
  const mockMetadataModule: Partial<TwinMakerSceneMetadataModule> = {
    createSceneEntity,
  };

  it('should call createSceneEntity with expected input', () => {
    setTwinMakerSceneMetadataModule(mockMetadataModule as unknown as TwinMakerSceneMetadataModule);

    createLayer('test', LayerType.Relationship);

    expect(createSceneEntity).toBeCalledWith({
      workspaceId: undefined,
      entityId: createLayerId('test'),
      parentEntityId: LAYER_ROOT_ENTITY_ID,
      entityName: createLayerId('test'),
      components: {
        [DEFAULT_LAYER_COMPONENT_NAME]: {
          componentTypeId: LAYER_COMPONENT_TYPE_ID,
          properties: {
            [layerPropertyNames.type]: {
              value: {
                stringValue: LayerType.Relationship,
              },
            },
            [layerPropertyNames.relationshipName]: {
              value: {
                stringValue: DEFAULT_LAYER_RELATIONSHIP_NAME,
              },
            },
          },
        },
      },
    });
  });
});

describe('attachToLayerRequest', () => {
  it('should return expected request', () => {
    expect(attachToLayerRequest('test')).toEqual({
      [DEFAULT_LAYER_RELATIONSHIP_NAME]: {
        value: {
          relationshipValue: {
            targetEntityId: 'test',
            targetComponentName: DEFAULT_LAYER_COMPONENT_NAME,
          },
        },
      },
    });
  });
});

describe('attachToLayer', () => {
  const updateSceneEntity = jest.fn();
  const mockMetadataModule: Partial<TwinMakerSceneMetadataModule> = {
    updateSceneEntity,
  };

  it('should return expected request', () => {
    setTwinMakerSceneMetadataModule(mockMetadataModule as unknown as TwinMakerSceneMetadataModule);

    attachToLayer('layer', 'entity');

    expect(updateSceneEntity).toBeCalledWith({
      workspaceId: undefined,
      entityId: 'entity',
      componentUpdates: {
        [DEFAULT_NODE_COMPONENT_NAME]: {
          propertyUpdates: {
            [DEFAULT_LAYER_RELATIONSHIP_NAME]: {
              value: {
                relationshipValue: {
                  targetEntityId: 'layer',
                  targetComponentName: DEFAULT_LAYER_COMPONENT_NAME,
                },
              },
            },
          },
        },
      },
    });
  });
});
