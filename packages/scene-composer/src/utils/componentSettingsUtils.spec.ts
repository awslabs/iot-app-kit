import { DEFAULT_OVERLAY_GLOBAL_SETTINGS, DEFAULT_TAG_GLOBAL_SETTINGS } from '../common/constants';
import { KnownComponentType } from '../interfaces';
import { useStore } from '../store';

import { componentSettingsSelector } from './componentSettingsUtils';

describe('componentSettingsUtils', () => {
  describe('componentSettingsSelector', () => {
    it('should return default tag settings', () => {
      const state = { ...useStore('default').getState(), getSceneProperty: jest.fn() };
      const tagSettings = componentSettingsSelector(state, KnownComponentType.Tag);
      expect(tagSettings).toEqual(DEFAULT_TAG_GLOBAL_SETTINGS);
    });

    it('should return default overlay settings', () => {
      const state = { ...useStore('default').getState(), getSceneProperty: jest.fn() };
      const settings = componentSettingsSelector(state, KnownComponentType.DataOverlay);
      expect(settings).toEqual(DEFAULT_OVERLAY_GLOBAL_SETTINGS);
    });

    it('should return tag settings from scene', () => {
      const expected = { scale: 1.6, autoRescale: true };
      const state = {
        ...useStore('default').getState(),
        getSceneProperty: jest.fn().mockReturnValue({ Tag: expected }),
      };
      const tagSettings = componentSettingsSelector(state, KnownComponentType.Tag);
      expect(tagSettings).toEqual(expected);
    });

    it('should return empty settings for unknown component type', () => {
      const state = { ...useStore('default').getState(), getSceneProperty: jest.fn() };
      const settings = componentSettingsSelector(state, 'Random' as KnownComponentType);
      expect(settings).toEqual({});
    });
  });
});
