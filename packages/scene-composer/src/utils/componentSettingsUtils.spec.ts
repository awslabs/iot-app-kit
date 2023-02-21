import { DEFAULT_TAG_GLOBAL_SETTINGS } from '../common/constants';
import { KnownComponentType } from '../interfaces';

import { componentSettingsSelector } from './componentSettingsUtils';

describe('componentSettingsUtils', () => {
  describe('componentSettingsSelector', () => {
    it('should return default tag settings', () => {
      const state = { getSceneProperty: jest.fn() } as any;
      const tagSettings = componentSettingsSelector(state, KnownComponentType.Tag);
      expect(tagSettings).toEqual(DEFAULT_TAG_GLOBAL_SETTINGS);
    });

    it('should return tag settings from scene', () => {
      const expected = { scale: 1.6, autoRescale: true };
      const state = { getSceneProperty: jest.fn().mockReturnValue({ Tag: expected }) } as any;
      const tagSettings = componentSettingsSelector(state, KnownComponentType.Tag);
      expect(tagSettings).toEqual(expected);
    });

    it('should return empty settings for unknown component type', () => {
      const state = { getSceneProperty: jest.fn() } as any;
      const settings = componentSettingsSelector(state, 'Random' as any);
      expect(settings).toEqual({});
    });
  });
});
