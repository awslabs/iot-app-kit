import { SCENE_COMPONENT_TYPE_ID } from '../../common/entityModelConstants';
import { KnownComponentType, KnownSceneProperty } from '../../interfaces';

import { createSceneEntityComponent, updateSceneEntityComponent } from './sceneComponent';

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
