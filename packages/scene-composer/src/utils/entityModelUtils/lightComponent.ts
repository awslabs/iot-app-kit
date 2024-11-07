import { type ComponentRequest, type ComponentUpdateRequest, PropertyUpdateType } from '@aws-sdk/client-iottwinmaker';
import { type DocumentType } from '@aws-sdk/types';

import { type ILightComponent, KnownComponentType } from '../../interfaces';
import { componentTypeToId } from '../../common/entityModelConstants';
import { type ILightComponentInternal } from '../../store';
import { generateUUID } from '../mathUtils';
import { type Component, LightType } from '../../models/SceneModels';
import { DEFAULT_LIGHT_SETTINGS_MAP } from '../../common/constants';

export enum LightComponentProperty {
  LightType = 'lightType',
  LightSettingsColor = 'lightSettings_color',
  LightSettingsIntensity = 'lightSettings_intensity',
  LightSettingsCastShadow = 'lightSettings_castShadow',
  LightSettingsDistance = 'lightSettings_distance',
  LightSettingsDecay = 'lightSettings_decay',
  LightSettingsGroundColor = 'lightSettings_groundColor',
}

export const createLightEntityComponent = (light: ILightComponent): ComponentRequest => {
  const comp: ComponentRequest = {
    componentTypeId: componentTypeToId[KnownComponentType.Light],
    properties: {
      [LightComponentProperty.LightType]: {
        value: {
          stringValue: light.lightType,
        },
      },
    },
  };

  if (light.lightSettings.color !== undefined) {
    comp.properties![LightComponentProperty.LightSettingsColor] = {
      value: {
        stringValue: light.lightSettings.color,
      },
    };
  }
  if (light.lightSettings.intensity !== undefined) {
    comp.properties![LightComponentProperty.LightSettingsIntensity] = {
      value: {
        doubleValue: light.lightSettings.intensity,
      },
    };
  }
  if ((light.lightSettings as Component.IPointLightSettings).castShadow !== undefined) {
    comp.properties![LightComponentProperty.LightSettingsCastShadow] = {
      value: {
        booleanValue: (light.lightSettings as Component.IPointLightSettings).castShadow,
      },
    };
  }
  if ((light.lightSettings as Component.IPointLightSettings).distance !== undefined) {
    comp.properties![LightComponentProperty.LightSettingsDistance] = {
      value: {
        doubleValue: (light.lightSettings as Component.IPointLightSettings).distance,
      },
    };
  }
  if ((light.lightSettings as Component.IPointLightSettings).decay !== undefined) {
    comp.properties![LightComponentProperty.LightSettingsDecay] = {
      value: {
        doubleValue: (light.lightSettings as Component.IPointLightSettings).decay,
      },
    };
  }
  if ((light.lightSettings as Component.IHemisphereLightSettings).groundColor !== undefined) {
    comp.properties![LightComponentProperty.LightSettingsGroundColor] = {
      value: {
        stringValue: (light.lightSettings as Component.IHemisphereLightSettings).groundColor,
      },
    };
  }

  return comp;
};

export const updateLightEntityComponent = (
  light: ILightComponent,
  oldComponent?: ILightComponent,
): ComponentUpdateRequest => {
  const request = createLightEntityComponent(light);
  if (oldComponent?.lightType === LightType.Point) {
    if (light.lightType === LightType.Point) {
      if (!('distance' in light.lightSettings) && 'distance' in oldComponent.lightSettings) {
        request.properties![LightComponentProperty.LightSettingsDistance] = {
          updateType: PropertyUpdateType.RESET_VALUE,
        };
      }
      if (!('decay' in light.lightSettings) && 'decay' in oldComponent.lightSettings) {
        request.properties![LightComponentProperty.LightSettingsDecay] = {
          updateType: PropertyUpdateType.RESET_VALUE,
        };
      }
    } else {
      request.properties![LightComponentProperty.LightSettingsDistance] = {
        updateType: PropertyUpdateType.RESET_VALUE,
      };
      request.properties![LightComponentProperty.LightSettingsDecay] = {
        updateType: PropertyUpdateType.RESET_VALUE,
      };
      request.properties![LightComponentProperty.LightSettingsCastShadow] = {
        updateType: PropertyUpdateType.RESET_VALUE,
      };
    }
  }
  if (oldComponent?.lightType === LightType.Hemisphere && light.lightType !== LightType.Hemisphere) {
    request.properties![LightComponentProperty.LightSettingsGroundColor] = {
      updateType: PropertyUpdateType.RESET_VALUE,
    };
  }
  return {
    componentTypeId: request.componentTypeId,
    propertyUpdates: request.properties,
  };
};

export const parseLightComp = (comp: DocumentType): ILightComponentInternal | undefined => {
  if (!comp?.['properties']) {
    return undefined;
  }

  const lightType =
    comp['properties'].find((p) => p['propertyName'] === LightComponentProperty.LightType)?.propertyValue ??
    LightType.Directional;

  const castShadow =
    comp['properties'].find((p) => p['propertyName'] === LightComponentProperty.LightSettingsCastShadow)
      ?.propertyValue ?? DEFAULT_LIGHT_SETTINGS_MAP[lightType].castShadow;
  const distance =
    comp['properties'].find((p) => p['propertyName'] === LightComponentProperty.LightSettingsDistance)?.propertyValue ??
    DEFAULT_LIGHT_SETTINGS_MAP[lightType].distance;
  const decay =
    comp['properties'].find((p) => p['propertyName'] === LightComponentProperty.LightSettingsDecay)?.propertyValue ??
    DEFAULT_LIGHT_SETTINGS_MAP[lightType].decay;
  const groundColor =
    comp['properties'].find((p) => p['propertyName'] === LightComponentProperty.LightSettingsGroundColor)
      ?.propertyValue ?? DEFAULT_LIGHT_SETTINGS_MAP[lightType].groundColor;

  const lightComp: ILightComponentInternal = {
    ref: generateUUID(),
    type: KnownComponentType.Light,
    lightType,
    lightSettings: {
      color:
        comp['properties'].find((p) => p['propertyName'] === LightComponentProperty.LightSettingsColor)
          ?.propertyValue ?? DEFAULT_LIGHT_SETTINGS_MAP[lightType].color,
      intensity:
        comp['properties'].find((p) => p['propertyName'] === LightComponentProperty.LightSettingsIntensity)
          ?.propertyValue ?? DEFAULT_LIGHT_SETTINGS_MAP[lightType].intensity,
    },
  };

  switch (lightType) {
    case LightType.Directional:
      (lightComp.lightSettings as Component.IDirectionalLightSettings) = {
        ...lightComp.lightSettings,
        castShadow,
      };
      break;
    case LightType.Hemisphere:
      (lightComp.lightSettings as Component.IHemisphereLightSettings) = {
        ...lightComp.lightSettings,
        groundColor,
      };
      break;
    case LightType.Point:
      (lightComp.lightSettings as Component.IPointLightSettings) = {
        ...lightComp.lightSettings,
        castShadow,
      };
      if (distance !== undefined) {
        (lightComp.lightSettings as Component.IPointLightSettings).distance = distance;
      }
      if (decay !== undefined) {
        (lightComp.lightSettings as Component.IPointLightSettings).decay = decay;
      }
      break;
  }

  return lightComp;
};
