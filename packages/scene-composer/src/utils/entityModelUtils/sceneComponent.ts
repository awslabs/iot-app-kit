import {
  ComponentRequest,
  ComponentUpdateRequest,
  DataValue,
  GetEntityCommandOutput,
} from '@aws-sdk/client-iottwinmaker';
import { isEmpty, isFinite } from 'lodash';

import {
  IComponentSettingsMap,
  IDataBindingConfig,
  IOverlaySettings,
  IRuleBasedMap,
  IRuleStatement,
  ISceneDocument,
  ITagSettings,
  KnownComponentType,
  KnownSceneProperty,
} from '../../interfaces';
import { SCENE_COMPONENT_TYPE_ID } from '../../common/entityModelConstants';
import { CURRENT_VERSION, DEFAULT_DISTANCE_UNIT, DEFAULT_TAG_GLOBAL_SETTINGS } from '../../common/constants';
import { ISceneDocumentInternal } from '../../store';

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

export const parseSceneCompFromEntity = (entity: GetEntityCommandOutput): ISceneDocumentInternal | undefined => {
  const comp = Object.values(entity.components || {}).find((c) => c.componentTypeId === SCENE_COMPONENT_TYPE_ID);
  if (!comp || !comp.properties) {
    return undefined;
  }
  const specVersion = comp.properties[SceneComponentProperty.SpecVersion]?.value?.stringValue;
  const version = comp.properties[SceneComponentProperty.Version]?.value?.stringValue;
  if (!specVersion || !version) {
    return undefined;
  }

  const ruleMap: Record<string, IRuleBasedMap> = {};
  const ruleProp = comp.properties[SceneComponentProperty.RuleStatements]?.value?.mapValue;
  Object.keys(ruleProp || {}).forEach((id) => {
    ruleMap[id] = { statements: [] };
    const statements = ruleProp?.[id].listValue;
    statements?.forEach((statement) => {
      const parsedStatement = JSON.parse(statement.stringValue || '');
      if (!(parsedStatement as IRuleStatement).expression || !(parsedStatement as IRuleStatement).target) {
        throw new Error('Invalid rule statement');
      }

      ruleMap[id].statements.push(parsedStatement);
    });
  });

  const dataBindingConfig: IDataBindingConfig = { fieldMapping: {}, template: {} };
  const dataBindingConfigProp = comp.properties[SceneComponentProperty.PropertiesDataBindingConfig]?.value?.mapValue;
  const fieldMappingProp = dataBindingConfigProp?.[DataBindingConfigPropertyKey.FieldMapping].mapValue;
  if (fieldMappingProp) {
    Object.keys(fieldMappingProp).forEach((key) => {
      dataBindingConfig.fieldMapping[key] = JSON.parse(fieldMappingProp[key].stringValue || '');
    });
  }
  const templateProp = dataBindingConfigProp?.[DataBindingConfigPropertyKey.Template].mapValue;
  if (templateProp) {
    Object.keys(templateProp).forEach((key) => {
      if (templateProp[key].stringValue) {
        dataBindingConfig.template![key] = templateProp[key].stringValue!;
      }
    });
  }

  const componentSettings: IComponentSettingsMap = {};
  const componentSettingsProp = comp.properties[SceneComponentProperty.PropertiesComponentSettings]?.value?.mapValue;
  if (componentSettingsProp?.[KnownComponentType.Tag]) {
    const tagSettingsProp = componentSettingsProp[KnownComponentType.Tag].mapValue;
    const scaleValue = Number(tagSettingsProp?.['scale']?.stringValue);
    const tagSettings: ITagSettings = {
      scale: isFinite(scaleValue) ? scaleValue : DEFAULT_TAG_GLOBAL_SETTINGS.scale,
      autoRescale: tagSettingsProp?.['autoRescale']?.stringValue === 'true',
      enableOcclusion: tagSettingsProp?.['enableOcclusion']?.stringValue === 'true',
    };
    componentSettings[KnownComponentType.Tag] = tagSettings;
  }
  if (componentSettingsProp?.[KnownComponentType.DataOverlay]) {
    const overlaySettingsProp = componentSettingsProp[KnownComponentType.DataOverlay].mapValue;
    const overlaySettings: IOverlaySettings = {
      overlayPanelVisible: overlaySettingsProp?.['overlayPanelVisible']?.stringValue === 'true',
    };
    componentSettings[KnownComponentType.DataOverlay] = overlaySettings;
  }

  const document: ISceneDocumentInternal = {
    version,
    specVersion,
    unit: comp.properties[SceneComponentProperty.Unit]?.value?.stringValue || DEFAULT_DISTANCE_UNIT,
    ruleMap,
    nodeMap: {},
    componentNodeMap: {},
    rootNodeRefs: [],
    properties: {
      [KnownSceneProperty.SceneRootEntityId]: entity.entityId,
      [KnownSceneProperty.EnvironmentPreset]:
        comp.properties[SceneComponentProperty.PropertiesEnvironmentPreset]?.value?.stringValue,
      [KnownSceneProperty.DataBindingConfig]: dataBindingConfig,
      [KnownSceneProperty.ComponentSettings]: componentSettings,
      [KnownSceneProperty.MatterportModelId]:
        comp.properties[SceneComponentProperty.PropertiesMatterportModelId]?.value?.stringValue,
      [KnownSceneProperty.LayerIds]: comp.properties[SceneComponentProperty.ConnectedToLayers]?.value?.listValue?.map(
        (layer) => layer.relationshipValue?.targetEntityId,
      ),
      [KnownSceneProperty.TagCustomColors]: comp.properties[
        SceneComponentProperty.PropertiesTagCustomColors
      ]?.value?.listValue?.map((color) => color.stringValue),
      [KnownSceneProperty.LayerDefaultRefreshInterval]:
        comp.properties[SceneComponentProperty.PropertiesLayerDefaultRefreshInterval]?.value?.integerValue,
    },
  };

  return document;
};
