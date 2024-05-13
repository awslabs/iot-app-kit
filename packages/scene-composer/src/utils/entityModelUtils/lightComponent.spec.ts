import { PropertyUpdateType } from '@aws-sdk/client-iottwinmaker';

import { DEFAULT_LIGHT_SETTINGS_MAP } from '../../common/constants';
import { componentTypeToId } from '../../common/entityModelConstants';
import { ILightComponent, KnownComponentType } from '../../interfaces';
import { LightType } from '../../models/SceneModels';

import {
  createLightEntityComponent,
  parseLightComp,
  updateLightEntityComponent,
  LightComponentProperty,
} from './lightComponent';

const ambientLight: ILightComponent = {
  type: KnownComponentType.Light,
  lightType: LightType.Ambient,
  lightSettings: DEFAULT_LIGHT_SETTINGS_MAP.Ambient,
};

const pointLight: ILightComponent = {
  type: KnownComponentType.Light,
  lightType: LightType.Point,
  lightSettings: DEFAULT_LIGHT_SETTINGS_MAP.Point,
};

const directionalLight: ILightComponent = {
  type: KnownComponentType.Light,
  lightType: LightType.Directional,
  lightSettings: DEFAULT_LIGHT_SETTINGS_MAP.Directional,
};

const hemisphereLight: ILightComponent = {
  type: KnownComponentType.Light,
  lightType: LightType.Hemisphere,
  lightSettings: DEFAULT_LIGHT_SETTINGS_MAP.Hemisphere,
};

describe('createLightEntityComponent', () => {
  it('should return expected ambient light component', () => {
    expect(createLightEntityComponent(ambientLight)).toEqual({
      componentTypeId: componentTypeToId[KnownComponentType.Light],
      properties: {
        lightType: {
          value: {
            stringValue: LightType.Ambient,
          },
        },
        lightSettings_color: {
          value: {
            stringValue: DEFAULT_LIGHT_SETTINGS_MAP.Ambient.color,
          },
        },
        lightSettings_intensity: {
          value: {
            doubleValue: DEFAULT_LIGHT_SETTINGS_MAP.Ambient.intensity,
          },
        },
      },
    });
  });

  it('should return expected directional light component', () => {
    expect(createLightEntityComponent(directionalLight)).toEqual({
      componentTypeId: componentTypeToId[KnownComponentType.Light],
      properties: {
        lightType: {
          value: {
            stringValue: LightType.Directional,
          },
        },
        lightSettings_color: {
          value: {
            stringValue: DEFAULT_LIGHT_SETTINGS_MAP.Directional.color,
          },
        },
        lightSettings_intensity: {
          value: {
            doubleValue: DEFAULT_LIGHT_SETTINGS_MAP.Directional.intensity,
          },
        },
        lightSettings_castShadow: {
          value: {
            booleanValue: DEFAULT_LIGHT_SETTINGS_MAP.Directional.castShadow,
          },
        },
      },
    });
  });

  it('should return expected hemisphere light component', () => {
    expect(createLightEntityComponent(hemisphereLight)).toEqual({
      componentTypeId: componentTypeToId[KnownComponentType.Light],
      properties: {
        lightType: {
          value: {
            stringValue: LightType.Hemisphere,
          },
        },
        lightSettings_color: {
          value: {
            stringValue: DEFAULT_LIGHT_SETTINGS_MAP.Hemisphere.color,
          },
        },
        lightSettings_intensity: {
          value: {
            doubleValue: DEFAULT_LIGHT_SETTINGS_MAP.Hemisphere.intensity,
          },
        },
        lightSettings_groundColor: {
          value: {
            stringValue: DEFAULT_LIGHT_SETTINGS_MAP.Hemisphere.groundColor,
          },
        },
      },
    });
  });

  it('should return expected point light component', () => {
    expect(createLightEntityComponent(pointLight)).toEqual({
      componentTypeId: componentTypeToId[KnownComponentType.Light],
      properties: {
        lightType: {
          value: {
            stringValue: LightType.Point,
          },
        },
        lightSettings_color: {
          value: {
            stringValue: DEFAULT_LIGHT_SETTINGS_MAP.Point.color,
          },
        },
        lightSettings_intensity: {
          value: {
            doubleValue: DEFAULT_LIGHT_SETTINGS_MAP.Point.intensity,
          },
        },
        lightSettings_castShadow: {
          value: {
            booleanValue: DEFAULT_LIGHT_SETTINGS_MAP.Point.castShadow,
          },
        },
        lightSettings_distance: {
          value: {
            doubleValue: DEFAULT_LIGHT_SETTINGS_MAP.Point.distance,
          },
        },
        lightSettings_decay: {
          value: {
            doubleValue: DEFAULT_LIGHT_SETTINGS_MAP.Point.decay,
          },
        },
      },
    });
  });

  it('should return expected point light component without distance and decay settings', () => {
    expect(
      createLightEntityComponent({
        ...pointLight,
        lightSettings: { ...pointLight.lightSettings, distance: undefined, decay: undefined },
      }),
    ).toEqual({
      componentTypeId: componentTypeToId[KnownComponentType.Light],
      properties: {
        lightType: {
          value: {
            stringValue: LightType.Point,
          },
        },
        lightSettings_color: {
          value: {
            stringValue: DEFAULT_LIGHT_SETTINGS_MAP.Point.color,
          },
        },
        lightSettings_intensity: {
          value: {
            doubleValue: DEFAULT_LIGHT_SETTINGS_MAP.Point.intensity,
          },
        },
        lightSettings_castShadow: {
          value: {
            booleanValue: DEFAULT_LIGHT_SETTINGS_MAP.Point.castShadow,
          },
        },
      },
    });
  });
});

describe('updateLightEntityComponent', () => {
  it('should return expected ambient light component', () => {
    expect(updateLightEntityComponent(ambientLight)).toEqual({
      componentTypeId: componentTypeToId[KnownComponentType.Light],
      propertyUpdates: expect.objectContaining({
        lightType: {
          value: {
            stringValue: LightType.Ambient,
          },
        },
      }),
    });
  });

  it('should return reset point light values not supplied', () => {
    expect(
      updateLightEntityComponent(
        {
          type: KnownComponentType.Light,
          lightType: LightType.Point,
          lightSettings: {
            color: DEFAULT_LIGHT_SETTINGS_MAP.Point.color,
            intensity: DEFAULT_LIGHT_SETTINGS_MAP.Point.intensity,
            castShadow: DEFAULT_LIGHT_SETTINGS_MAP.Point.castShadow,
          },
        },
        pointLight,
      ),
    ).toEqual({
      componentTypeId: componentTypeToId[KnownComponentType.Light],
      propertyUpdates: {
        lightType: {
          value: {
            stringValue: LightType.Point,
          },
        },
        lightSettings_color: {
          value: {
            stringValue: DEFAULT_LIGHT_SETTINGS_MAP.Point.color,
          },
        },
        lightSettings_intensity: {
          value: {
            doubleValue: DEFAULT_LIGHT_SETTINGS_MAP.Point.intensity,
          },
        },
        lightSettings_castShadow: {
          value: {
            booleanValue: DEFAULT_LIGHT_SETTINGS_MAP.Point.castShadow,
          },
        },
        [LightComponentProperty.LightSettingsDecay]: {
          updateType: PropertyUpdateType.RESET_VALUE,
        },
        [LightComponentProperty.LightSettingsDistance]: {
          updateType: PropertyUpdateType.RESET_VALUE,
        },
      },
    });
  });

  it('should return reset point light values when changing light type', () => {
    expect(updateLightEntityComponent(ambientLight, pointLight)).toEqual({
      componentTypeId: componentTypeToId[KnownComponentType.Light],
      propertyUpdates: {
        lightType: {
          value: {
            stringValue: LightType.Ambient,
          },
        },
        lightSettings_color: {
          value: {
            stringValue: DEFAULT_LIGHT_SETTINGS_MAP.Ambient.color,
          },
        },
        lightSettings_intensity: {
          value: {
            doubleValue: DEFAULT_LIGHT_SETTINGS_MAP.Ambient.intensity,
          },
        },
        [LightComponentProperty.LightSettingsDecay]: {
          updateType: PropertyUpdateType.RESET_VALUE,
        },
        [LightComponentProperty.LightSettingsDistance]: {
          updateType: PropertyUpdateType.RESET_VALUE,
        },
        [LightComponentProperty.LightSettingsCastShadow]: {
          updateType: PropertyUpdateType.RESET_VALUE,
        },
      },
    });
  });

  it('should return reset hemisphere light values when changing light type', () => {
    expect(updateLightEntityComponent(ambientLight, hemisphereLight)).toEqual({
      componentTypeId: componentTypeToId[KnownComponentType.Light],
      propertyUpdates: {
        lightType: {
          value: {
            stringValue: LightType.Ambient,
          },
        },
        lightSettings_color: {
          value: {
            stringValue: DEFAULT_LIGHT_SETTINGS_MAP.Ambient.color,
          },
        },
        lightSettings_intensity: {
          value: {
            doubleValue: DEFAULT_LIGHT_SETTINGS_MAP.Ambient.intensity,
          },
        },
        [LightComponentProperty.LightSettingsGroundColor]: {
          updateType: PropertyUpdateType.RESET_VALUE,
        },
      },
    });
  });
});

describe('parseLightComp', () => {
  it('should parse to expected ambient light component', () => {
    expect(
      parseLightComp({
        properties: [
          {
            propertyName: 'lightType',
            propertyValue: 'Ambient',
          },
          {
            propertyName: 'lightSettings_color',
            propertyValue: DEFAULT_LIGHT_SETTINGS_MAP.Ambient.color,
          },
          {
            propertyName: 'lightSettings_intensity',
            propertyValue: DEFAULT_LIGHT_SETTINGS_MAP.Ambient.intensity,
          },
        ],
      }),
    ).toEqual({
      ref: expect.any(String),
      ...ambientLight,
    });
  });

  it('should parse to expected directional light component', () => {
    expect(
      parseLightComp({
        properties: [
          {
            propertyName: 'lightType',
            propertyValue: 'Directional',
          },
          {
            propertyName: 'lightSettings_color',
            propertyValue: DEFAULT_LIGHT_SETTINGS_MAP.Directional.color,
          },
          {
            propertyName: 'lightSettings_intensity',
            propertyValue: DEFAULT_LIGHT_SETTINGS_MAP.Directional.intensity,
          },
        ],
      }),
    ).toEqual({
      ref: expect.any(String),
      ...directionalLight,
    });
  });

  it('should parse to expected hemisphere light component', () => {
    expect(
      parseLightComp({
        properties: [
          {
            propertyName: 'lightType',
            propertyValue: 'Hemisphere',
          },
          {
            propertyName: 'lightSettings_color',
            propertyValue: DEFAULT_LIGHT_SETTINGS_MAP.Hemisphere.color,
          },
          {
            propertyName: 'lightSettings_intensity',
            propertyValue: DEFAULT_LIGHT_SETTINGS_MAP.Hemisphere.intensity,
          },
          {
            propertyName: 'lightSettings_groundColor',
            propertyValue: DEFAULT_LIGHT_SETTINGS_MAP.Hemisphere.groundColor,
          },
        ],
      }),
    ).toEqual({
      ref: expect.any(String),
      ...hemisphereLight,
    });
  });

  it('should parse to expected point light component', () => {
    expect(
      parseLightComp({
        properties: [
          {
            propertyName: 'lightType',
            propertyValue: 'Point',
          },
          {
            propertyName: 'lightSettings_color',
            propertyValue: DEFAULT_LIGHT_SETTINGS_MAP.Point.color,
          },
          {
            propertyName: 'lightSettings_intensity',
            propertyValue: DEFAULT_LIGHT_SETTINGS_MAP.Point.intensity,
          },
        ],
      }),
    ).toEqual({
      ref: expect.any(String),
      ...pointLight,
    });
  });
});
