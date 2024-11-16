import { type GetEntityCommandOutput } from '@aws-sdk/client-iottwinmaker';

import { RESERVED_LAYER_ID, SCENE_COMPONENT_TYPE_ID } from '../../common/entityModelConstants';
import {
  type IDataBindingConfig,
  type IOverlaySettings,
  type IRuleBasedMap,
  type ITagSettings,
  KnownComponentType,
  KnownSceneProperty,
} from '../../interfaces';
import { type ISceneDocumentInternal } from '../../store';
import { DEFAULT_DISTANCE_UNIT, DEFAULT_TAG_GLOBAL_SETTINGS } from '../../common/constants';

import { createSceneEntityComponent, parseSceneCompFromEntity, updateSceneEntityComponent } from './sceneComponent';

describe('createSceneEntityComponent', () => {
  it('should return expected scene component with basic fields', () => {
    const result = createSceneEntityComponent({
      specVersion: '1.0',
      version: '1',
      ruleMap: {},
    });

    expect(result.properties).toEqual({
      specVersion: {
        value: { stringValue: '1.0' },
      },
      version: {
        value: { stringValue: '1' },
      },
    });
  });

  it('should return expected scene component with all fields', () => {
    const result = createSceneEntityComponent({
      specVersion: '1.0',
      version: '1',
      ruleMap: {
        alarmRule: {
          statements: [
            {
              expression: "alarm_status == 'ACTIVE'",
              target: 'iottwinmaker.common.icon:Error',
            },
            {
              expression: "alarm_status == 'ACKNOWLEDGED'",
              target: 'iottwinmaker.common.icon:Warning',
            },
            {
              expression: "alarm_status == 'SNOOZE_DISABLED'",
              target: 'iottwinmaker.common.icon:Warning',
            },
            {
              expression: "alarm_status == 'NORMAL'",
              target: 'iottwinmaker.common.icon:Info',
            },
          ],
        },
        tagRule: {
          statements: [
            {
              expression: "alarm_status == 'NORMAL'",
              target: 'iottwinmaker.common.icon:Info',
              targetMetadata: {
                color: '#d13313',
                iconName: 'file-lines',
                iconPrefix: 'fas',
              },
            },
          ],
        },
      },
      unit: 'meters',
      properties: {
        [KnownSceneProperty.ComponentSettings]: {
          [KnownComponentType.Tag]: {
            scale: 2.5,
            autoRescale: true,
            enableOcclusion: false,
          },
          [KnownComponentType.DataOverlay]: {
            overlayPanelVisible: false,
          },
        },
        [KnownSceneProperty.DataBindingConfig]: {
          fieldMapping: {
            entityId: ['sel_entity'],
            componentName: ['sel_comp'],
          },
          template: {
            sel_entity: 'room1',
            sel_comp: 'temperatureSensor2',
          },
        },
        [KnownSceneProperty.EnvironmentPreset]: 'neutral',
        [KnownSceneProperty.LayerDefaultRefreshInterval]: 4000,
        [KnownSceneProperty.LayerIds]: ['layer-1111', 'layer-2222'],
        [KnownSceneProperty.MatterportModelId]: 'matterport-id',
        [KnownSceneProperty.TagCustomColors]: ['#FFFFFF', '#123456'],
      },
    });

    expect(result.properties).toEqual({
      specVersion: {
        value: { stringValue: '1.0' },
      },
      version: {
        value: { stringValue: '1' },
      },
      rule_statements: {
        value: {
          mapValue: {
            alarmRule: {
              listValue: [
                {
                  stringValue: `{"expression":"alarm_status == 'ACTIVE'","target":"iottwinmaker.common.icon:Error"}`,
                },
                {
                  stringValue: `{"expression":"alarm_status == 'ACKNOWLEDGED'","target":"iottwinmaker.common.icon:Warning"}`,
                },
                {
                  stringValue: `{"expression":"alarm_status == 'SNOOZE_DISABLED'","target":"iottwinmaker.common.icon:Warning"}`,
                },
                {
                  stringValue: `{"expression":"alarm_status == 'NORMAL'","target":"iottwinmaker.common.icon:Info"}`,
                },
              ],
            },
            tagRule: {
              listValue: [
                {
                  stringValue: `{"expression":"alarm_status == 'NORMAL'","target":"iottwinmaker.common.icon:Info","targetMetadata":{"color":"#d13313","iconName":"file-lines","iconPrefix":"fas"}}`,
                },
              ],
            },
          },
        },
      },
      unit: {
        value: { stringValue: 'meters' },
      },
      properties_componentSettings: {
        value: {
          mapValue: {
            Tag: {
              mapValue: {
                scale: { stringValue: '2.5' },
                autoRescale: { stringValue: 'true' },
                enableOcclusion: { stringValue: 'false' },
              },
            },
            DataOverlay: {
              mapValue: {
                overlayPanelVisible: { stringValue: 'false' },
              },
            },
          },
        },
      },
      properties_dataBindingConfig: {
        value: {
          mapValue: {
            fieldMapping: {
              mapValue: {
                entityId: { stringValue: JSON.stringify(['sel_entity']) },
                componentName: { stringValue: JSON.stringify(['sel_comp']) },
              },
            },
            template: {
              mapValue: {
                sel_entity: { stringValue: 'room1' },
                sel_comp: { stringValue: 'temperatureSensor2' },
              },
            },
          },
        },
      },
      properties_environmentPreset: {
        value: { stringValue: 'neutral' },
      },
      properties_layerDefaultRefreshInterval: {
        value: { integerValue: 4000 },
      },
      connectedToLayers: {
        value: {
          listValue: [
            {
              relationshipValue: {
                targetEntityId: 'layer-1111',
              },
            },
            {
              relationshipValue: {
                targetEntityId: 'layer-2222',
              },
            },
          ],
        },
      },
      properties_tagCustomColors: {
        value: {
          listValue: [{ stringValue: '#FFFFFF' }, { stringValue: '#123456' }],
        },
      },
      properties_matterportModelId: {
        value: {
          stringValue: 'matterport-id',
        },
      },
    });
  });
});

describe('updateSceneEntityComponent', () => {
  it('should update a model ref component', () => {
    expect(
      updateSceneEntityComponent({
        specVersion: '1.0',
        version: '1',
        ruleMap: {},
      }),
    ).toEqual({
      componentTypeId: SCENE_COMPONENT_TYPE_ID,
      propertyUpdates: {
        specVersion: {
          value: { stringValue: '1.0' },
        },
        version: {
          value: { stringValue: '1' },
        },
      },
    });
  });
});

describe('parseSceneCompFromEntity', () => {
  const emptyEntity: GetEntityCommandOutput = {
    entityId: 'random-eid',
    entityName: 'random-ename',
    arn: 'random-arn',
    status: { state: 'ACTIVE' },
    workspaceId: 'random-wid',
    parentEntityId: undefined,
    hasChildEntities: undefined,
    creationDateTime: undefined,
    updateDateTime: undefined,
    $metadata: {},
  };
  const requiredProperties = {
    version: {
      value: {
        stringValue: '1',
      },
    },
    specVersion: {
      value: {
        stringValue: '1',
      },
    },
  };

  it('should return undefined when expected component does not exist', () => {
    const sceneEntity: GetEntityCommandOutput = {
      ...emptyEntity,
      components: {
        random: { componentTypeId: 'random' },
      },
    };

    expect(parseSceneCompFromEntity(sceneEntity)).toBeUndefined();
  });

  it('should return undefined when specVersion does not exist', () => {
    const sceneEntity: GetEntityCommandOutput = {
      ...emptyEntity,
      components: {
        Scene: {
          componentTypeId: SCENE_COMPONENT_TYPE_ID,
          properties: {
            version: requiredProperties.version,
          },
        },
      },
    };

    expect(parseSceneCompFromEntity(sceneEntity)).toBeUndefined();
  });

  it('should return undefined when version does not exist', () => {
    const sceneEntity: GetEntityCommandOutput = {
      ...emptyEntity,
      components: {
        Scene: {
          componentTypeId: SCENE_COMPONENT_TYPE_ID,
          properties: {
            specVersion: requiredProperties.specVersion,
          },
        },
      },
    };

    expect(parseSceneCompFromEntity(sceneEntity)).toBeUndefined();
  });

  it('should return empty scene with default values', () => {
    const sceneEntity: GetEntityCommandOutput = {
      ...emptyEntity,
      components: {
        Scene: { componentTypeId: SCENE_COMPONENT_TYPE_ID, properties: requiredProperties },
      },
    };
    const expected: ISceneDocumentInternal = {
      unit: DEFAULT_DISTANCE_UNIT,
      ruleMap: {},
      nodeMap: {},
      componentNodeMap: {},
      rootNodeRefs: [],
      version: '1',
      specVersion: '1',
      properties: {
        [KnownSceneProperty.SceneRootEntityId]: emptyEntity.entityId,
        [KnownSceneProperty.DataBindingConfig]: { fieldMapping: {}, template: {} },
        [KnownSceneProperty.ComponentSettings]: {},
        [KnownSceneProperty.EnvironmentPreset]: undefined,
        [KnownSceneProperty.LayerDefaultRefreshInterval]: undefined,
        [KnownSceneProperty.LayerIds]: [RESERVED_LAYER_ID],
        [KnownSceneProperty.TagCustomColors]: undefined,
        [KnownSceneProperty.MatterportModelId]: undefined,
      },
    };

    expect(parseSceneCompFromEntity(sceneEntity)).toEqual(expected);
  });

  it('should return error with when rule statement is missing expression', () => {
    const sceneEntity: GetEntityCommandOutput = {
      ...emptyEntity,
      components: {
        Scene: {
          componentTypeId: SCENE_COMPONENT_TYPE_ID,
          properties: {
            ...requiredProperties,
            rule_statements: {
              value: {
                mapValue: {
                  alarm: {
                    listValue: [{ stringValue: JSON.stringify({ target: 'alarm on target' }) }],
                  },
                },
              },
            },
          },
        },
      },
    };

    try {
      parseSceneCompFromEntity(sceneEntity);
    } catch (e) {
      expect(e.message).toEqual('Invalid rule statement');
    }
  });

  it('should return error with when rule statement is missing target', () => {
    const sceneEntity: GetEntityCommandOutput = {
      ...emptyEntity,
      components: {
        Scene: {
          componentTypeId: SCENE_COMPONENT_TYPE_ID,
          properties: {
            ...requiredProperties,
            rule_statements: {
              value: {
                mapValue: {
                  alarm: {
                    listValue: [{ stringValue: JSON.stringify({ expression: 'alarm on' }) }],
                  },
                },
              },
            },
          },
        },
      },
    };

    try {
      parseSceneCompFromEntity(sceneEntity);
    } catch (e) {
      expect(e.message).toEqual('Invalid rule statement');
    }
  });

  it('should return scene with expected rules map', () => {
    const ruleStatement1 = { expression: 'alarm on', target: 'alarm on target' };
    const ruleStatement2 = { expression: 'alarm off', target: 'alarm off target' };

    const sceneEntity: GetEntityCommandOutput = {
      ...emptyEntity,
      components: {
        Scene: {
          componentTypeId: SCENE_COMPONENT_TYPE_ID,
          properties: {
            ...requiredProperties,
            rule_statements: {
              value: {
                mapValue: {
                  alarm: {
                    listValue: [
                      { stringValue: JSON.stringify(ruleStatement1) },
                      { stringValue: JSON.stringify(ruleStatement2) },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    };
    const expected: Record<string, IRuleBasedMap> = {
      alarm: {
        statements: [ruleStatement1, ruleStatement2],
      },
    };

    expect(parseSceneCompFromEntity(sceneEntity)?.ruleMap).toEqual(expected);
  });

  it('should return scene with expected data binding config', () => {
    const config: IDataBindingConfig = {
      fieldMapping: {
        entityId: ['sel_entity'],
        componentName: ['sel_comp'],
      },
      template: {
        sel_entity: 'room1',
        sel_comp: 'temperatureSensor2',
      },
    };

    const sceneEntity: GetEntityCommandOutput = {
      ...emptyEntity,
      components: {
        Scene: {
          componentTypeId: SCENE_COMPONENT_TYPE_ID,
          properties: {
            ...requiredProperties,
            properties_dataBindingConfig: {
              value: {
                mapValue: {
                  fieldMapping: {
                    mapValue: {
                      entityId: {
                        stringValue: JSON.stringify(config.fieldMapping.entityId),
                      },
                      componentName: {
                        stringValue: JSON.stringify(config.fieldMapping.componentName),
                      },
                    },
                  },
                  template: {
                    mapValue: {
                      sel_entity: {
                        stringValue: config.template!.sel_entity,
                      },
                      sel_comp: {
                        stringValue: config.template!.sel_comp,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    expect(parseSceneCompFromEntity(sceneEntity)?.properties?.[KnownSceneProperty.DataBindingConfig]).toEqual(config);
  });

  it('should return scene with expected component settings with default values', () => {
    const sceneEntity: GetEntityCommandOutput = {
      ...emptyEntity,
      components: {
        Scene: {
          componentTypeId: SCENE_COMPONENT_TYPE_ID,
          properties: {
            ...requiredProperties,
            properties_componentSettings: {
              value: {
                mapValue: {
                  [KnownComponentType.Tag]: {
                    mapValue: {},
                  },
                  [KnownComponentType.DataOverlay]: {
                    mapValue: {},
                  },
                },
              },
            },
          },
        },
      },
    };
    const expected = {
      [KnownComponentType.Tag]: DEFAULT_TAG_GLOBAL_SETTINGS,
      [KnownComponentType.DataOverlay]: {
        overlayPanelVisible: false,
      },
    };

    expect(parseSceneCompFromEntity(sceneEntity)?.properties?.[KnownSceneProperty.ComponentSettings]).toEqual(expected);
  });

  it('should return scene with expected component settings with custom values', () => {
    const tagSettings: ITagSettings = {
      scale: 4.4,
      autoRescale: true,
      enableOcclusion: false,
    };
    const overlaySettings: IOverlaySettings = {
      overlayPanelVisible: false,
    };

    const sceneEntity: GetEntityCommandOutput = {
      ...emptyEntity,
      components: {
        Scene: {
          componentTypeId: SCENE_COMPONENT_TYPE_ID,
          properties: {
            ...requiredProperties,
            properties_componentSettings: {
              value: {
                mapValue: {
                  [KnownComponentType.Tag]: {
                    mapValue: {
                      scale: {
                        stringValue: '4.4',
                      },
                      autoRescale: {
                        stringValue: 'true',
                      },
                      enableOcclusion: {
                        stringValue: 'false',
                      },
                    },
                  },
                  [KnownComponentType.DataOverlay]: {
                    mapValue: {
                      overlayPanelVisible: {
                        stringValue: 'false',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    };
    const expected = {
      [KnownComponentType.Tag]: tagSettings,
      [KnownComponentType.DataOverlay]: overlaySettings,
    };

    expect(parseSceneCompFromEntity(sceneEntity)?.properties?.[KnownSceneProperty.ComponentSettings]).toEqual(expected);
  });

  it('should return scene with other known scene properties', () => {
    const sceneEntity: GetEntityCommandOutput = {
      ...emptyEntity,
      components: {
        Scene: {
          componentTypeId: SCENE_COMPONENT_TYPE_ID,
          properties: {
            ...requiredProperties,
            properties_environmentPreset: {
              value: {
                stringValue: 'neutral',
              },
            },
            properties_matterportModelId: {
              value: {
                stringValue: 'matterport-id',
              },
            },
            connectedToLayers: {
              value: {
                listValue: [
                  { relationshipValue: { targetEntityId: 'layer-1' } },
                  { relationshipValue: { targetEntityId: 'layer-2' } },
                ],
              },
            },
            properties_tagCustomColors: {
              value: {
                listValue: [{ stringValue: 'red' }, { stringValue: 'blue' }],
              },
            },
            properties_layerDefaultRefreshInterval: {
              value: {
                integerValue: 1223,
              },
            },
          },
        },
      },
    };
    const expected = {
      [KnownSceneProperty.SceneRootEntityId]: emptyEntity.entityId,
      [KnownSceneProperty.EnvironmentPreset]: 'neutral',
      [KnownSceneProperty.DataBindingConfig]: {
        fieldMapping: {},
        template: {},
      },
      [KnownSceneProperty.ComponentSettings]: {},
      [KnownSceneProperty.MatterportModelId]: 'matterport-id',
      [KnownSceneProperty.LayerIds]: [RESERVED_LAYER_ID],
      [KnownSceneProperty.TagCustomColors]: ['red', 'blue'],
      [KnownSceneProperty.LayerDefaultRefreshInterval]: 1223,
    };

    expect(parseSceneCompFromEntity(sceneEntity)?.properties).toEqual(expected);
  });
});
