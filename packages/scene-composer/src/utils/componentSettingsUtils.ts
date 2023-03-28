import { RootState } from '../store';
import { KnownSceneProperty, IComponentSettings, KnownComponentType } from '../interfaces';
import { DEFAULT_OVERLAY_GLOBAL_SETTINGS, DEFAULT_TAG_GLOBAL_SETTINGS } from '../common/constants';

export const componentSettingsSelector = (state: RootState, componentType: KnownComponentType): IComponentSettings => {
  const settings = state.getSceneProperty(KnownSceneProperty.ComponentSettings)?.[componentType];
  if (settings) {
    return settings;
  } else {
    // When the settings is not in scene file, return the default setting for each component type.
    switch (componentType) {
      case KnownComponentType.Tag:
        return DEFAULT_TAG_GLOBAL_SETTINGS;
      case KnownComponentType.DataOverlay:
        return DEFAULT_OVERLAY_GLOBAL_SETTINGS;
      default:
        return {};
    }
  }
};
