import { ComponentRequest, ComponentUpdateRequest, DataValue } from '@aws-sdk/client-iottwinmaker';
import { isEmpty } from 'lodash';

import { IComponentSettingsMap, IDataBindingConfig, ISceneDocument } from '../../interfaces';
import { SCENE_COMPONENT_TYPE_ID } from '../../common/entityModelConstants';
import { CURRENT_VERSION } from '../../common/constants';

enum SceneComponentProperty {
  SpecVersion = 'specVersion',
  Version = 'version',
  Unit = 'unit',
  RuleStatements = 'rule_statements',
  PropertiesEnvironmentPreset = 'properties_environmentPreset',
  PropertiesDataBindingConfig = 'properties_dataBindingConfig',
  PropertiesComponentSettings = 'properties_componentSettings',
  PropertiesMatterportModelId = 'properties_matterportModelId',
  ConnectedToLayers = 'connectedToLayers',
  PropertiesTagCustomColors = 'properties_tagCustomColors',
  PropertiesLayerDefaultRefreshInterval = 'properties_layerDefaultRefreshInterval',
}

enum DataBindingConfigPropertyKey {
  FieldMapping = 'fieldMapping',
  Template = 'template',
}

export const createSceneEntityComponent = (
  scene: Omit<ISceneDocument, 'nodeMap' | 'rootNodeRefs'>,
): ComponentRequest => {
  const comp: ComponentRequest = {
    componentTypeId: SCENE_COMPONENT_TYPE_ID,
    properties: {
      [SceneComponentProperty.SpecVersion]: {
        value: {
          stringValue: scene.specVersion ?? CURRENT_VERSION,
        },
      },
      [SceneComponentProperty.Version]: {
        value: {
          stringValue: scene.version,
        },
      },
    },
  };

  if (scene.unit) {
    comp.properties![SceneComponentProperty.Unit] = {
      value: {
        stringValue: scene.unit,
      },
    };
  }
  if (!isEmpty(scene.ruleMap)) {
    const ruleMap = scene.ruleMap;
    const value: DataValue = {
      mapValue: {},
    };

    Object.keys(ruleMap).forEach((ruleId) => {
      const statements: DataValue = {
        listValue: ruleMap[ruleId].statements.map((statement) => ({ stringValue: JSON.stringify(statement) })),
      };

      value.mapValue![ruleId] = statements;
    });

    comp.properties![SceneComponentProperty.RuleStatements] = {
      value,
    };
  }
  if (scene.properties?.environmentPreset) {
    comp.properties![SceneComponentProperty.PropertiesEnvironmentPreset] = {
      value: {
        stringValue: scene.properties.environmentPreset,
      },
    };
  }
  if (scene.properties?.dataBindingConfig !== undefined) {
    const config = scene.properties.dataBindingConfig as IDataBindingConfig;
    const fieldMapping: DataValue = { mapValue: {} };
    Object.keys(config.fieldMapping).forEach((k) => {
      fieldMapping.mapValue![k] = {
        stringValue: JSON.stringify(config.fieldMapping[k]),
      };
    });
    const value: DataValue = {
      mapValue: {
        [DataBindingConfigPropertyKey.FieldMapping]: fieldMapping,
      },
    };

    if (config.template) {
      const template: DataValue = { mapValue: {} };
      Object.keys(config.template).forEach((k) => {
        template.mapValue![k] = {
          stringValue: config.template![k],
        };
      });
      value.mapValue![DataBindingConfigPropertyKey.Template] = template;
    }

    comp.properties![SceneComponentProperty.PropertiesDataBindingConfig] = {
      value,
    };
  }
  if (scene.properties?.componentSettings !== undefined && !isEmpty(scene.properties?.componentSettings)) {
    const settings = scene.properties.componentSettings as IComponentSettingsMap;

    const value: DataValue = {
      mapValue: {},
    };

    Object.keys(settings).forEach((type) => {
      const settingsValue: DataValue = {
        mapValue: {},
      };
      Object.keys(settings[type]).forEach((k) => {
        settingsValue.mapValue![k] = {
          stringValue: String(settings[type][k]),
        };
      });

      if (!isEmpty(settingsValue.mapValue)) {
        value.mapValue![type] = settingsValue;
      }
    });

    comp.properties![SceneComponentProperty.PropertiesComponentSettings] = {
      value,
    };
  }
  if (scene.properties?.matterportModelId) {
    comp.properties![SceneComponentProperty.PropertiesMatterportModelId] = {
      value: {
        stringValue: scene.properties.matterportModelId,
      },
    };
  }
  if (scene.properties?.layerIds && !isEmpty(scene.properties?.layerIds)) {
    comp.properties![SceneComponentProperty.ConnectedToLayers] = {
      value: {
        listValue: (scene.properties.layerIds as string[]).map((id) => ({ relationshipValue: { targetEntityId: id } })),
      },
    };
  }
  if (scene.properties?.tagCustomColors) {
    comp.properties![SceneComponentProperty.PropertiesTagCustomColors] = {
      value: {
        listValue: (scene.properties.tagCustomColors as string[]).map((color) => ({ stringValue: color })),
      },
    };
  }
  if (scene.properties?.layerDefaultRefreshInterval) {
    comp.properties![SceneComponentProperty.PropertiesLayerDefaultRefreshInterval] = {
      value: {
        integerValue: scene.properties.layerDefaultRefreshInterval,
      },
    };
  }

  return comp;
};

export const updateSceneEntityComponent = (
  scene: Omit<ISceneDocument, 'nodeMap' | 'rootNodeRefs'>,
): ComponentUpdateRequest => {
  const request = createSceneEntityComponent(scene);
  return {
    componentTypeId: request.componentTypeId,
    propertyUpdates: request.properties,
  };
};
