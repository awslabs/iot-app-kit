/* eslint-disable */
const mockGetGlobalSettings = jest.fn();
jest.doMock('../../src/common/GlobalSettings', () => {
  const originalModule = jest.requireActual('../../src/common/GlobalSettings');
  return {
    ...originalModule,
    getGlobalSettings: mockGetGlobalSettings,
  };
});

import * as THREE from 'three';

import { DefaultAnchorStatus, IotTwinMakerNumberNamespace, SceneResourceType } from '../../src/interfaces';
import {
  convertToIotTwinMakerNamespace,
  getSceneResourceInfo,
  parseColorWithAlpha,
} from '../../src/utils/sceneResourceUtils';
jest.mock('../../src/utils/styleUtils', () => ({ colors: { errorRed: '#EE0000' } }));

/* eslint-enable */

describe('sceneResourceUtils', () => {
  describe('convertToIotTwinMakerNamespace', () => {
    it('should convert icon & color to scene resource with namespace', () => {
      const iconTargetResult = convertToIotTwinMakerNamespace(SceneResourceType.Icon, 'MockIcon');
      expect(iconTargetResult).toBe('iottwinmaker.common.icon:MockIcon');

      const colorTargetResult = convertToIotTwinMakerNamespace(SceneResourceType.Color, '#FF00FF');
      expect(colorTargetResult).toBe('iottwinmaker.common.color:#FF00FF');
    });

    it('should return the original string for unknown type', () => {
      const result = convertToIotTwinMakerNamespace('UnknownTyped' as any, 'UnknownValue');
      expect(result).toBe('UnknownValue');
    });
  });

  describe('getSceneResourceInfo', () => {
    it('should return expected value for valid input', () => {
      const iconTargetResult = getSceneResourceInfo('iottwinmaker.common.icon:Warning');
      expect(iconTargetResult.type).toBe(SceneResourceType.Icon);
      expect(iconTargetResult.value).toBe(DefaultAnchorStatus.Warning);

      const colorTargetResult = getSceneResourceInfo('iottwinmaker.common.color:red');
      expect(colorTargetResult.type).toBe(SceneResourceType.Color);
      expect(colorTargetResult.value).toBe('red');

      const numberTargetResult = getSceneResourceInfo('iottwinmaker.common.number');
      expect(numberTargetResult.type).toBe(SceneResourceType.Number);
      expect(numberTargetResult.value).toBe(IotTwinMakerNumberNamespace);
    });

    it('should fallback to Info icon if input is empty', () => {
      const result1 = getSceneResourceInfo(undefined);
      expect(result1.type).toBe(SceneResourceType.Icon);
      expect(result1.value).toBe(DefaultAnchorStatus.Info);

      const result2 = getSceneResourceInfo('');
      expect(result2.type).toBe(SceneResourceType.Icon);
      expect(result2.value).toBe(DefaultAnchorStatus.Info);
    });

    it('should fallback to Info icon if input is invalid', () => {
      const result = getSceneResourceInfo('com.mycompany.icon:Info');
      expect(result.type).toBe(SceneResourceType.Icon);
      expect(result.value).toBe(DefaultAnchorStatus.Info);
    });

    it('should fallback to Info icon if icon name is invalid', () => {
      const result = getSceneResourceInfo('iottwinmaker.common.icon:Unknown');
      expect(result.type).toBe(SceneResourceType.Icon);
      expect(result.value).toBe(DefaultAnchorStatus.Info);
    });

    it('should fallback to red if color is invalid', () => {
      const result = getSceneResourceInfo('iottwinmaker.common.color:');
      expect(result.type).toBe(SceneResourceType.Color);
      expect(result.value).toBe('#EE0000');
    });
  });

  describe('parseColorWithAlpha', () => {
    it('should return correct color with named color', () => {
      const result = parseColorWithAlpha('red');
      expect(result?.alpha).toEqual(1);
      expect(result?.color).toEqual(new THREE.Color('red'));
    });

    it('should return correct color with rgb color', () => {
      const result = parseColorWithAlpha('rgb(255,0,0)');
      expect(result?.alpha).toEqual(1);
      expect(result?.color).toEqual(new THREE.Color('rgb(255,0,0)'));
    });

    it('should return correct color with rgba color', () => {
      const result = parseColorWithAlpha('rgba(255,0,0,0.5)');
      expect(result?.alpha).toEqual(0.5);
      expect(result?.color).toEqual(new THREE.Color('rgb(255,0,0)'));
    });

    it('should return correct color with hsla color', () => {
      const result = parseColorWithAlpha('hsla(120,50%,50%,0.5)');
      expect(result?.alpha).toEqual(0.5);
      expect(result?.color).toEqual(new THREE.Color('hsl(120,50%,50%)'));
    });
  });
});
