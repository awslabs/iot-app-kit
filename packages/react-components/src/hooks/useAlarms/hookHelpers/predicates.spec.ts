import {
  MOCK_ALARM_INPUT_PROPERTY_ID,
  MOCK_ASSET_ID,
  MOCK_ASSET_MODEL_ID,
  MOCK_COMPOSITE_MODEL_ID,
  mockStateAssetProperty,
} from '../../../testing/alarms';
import { AlarmProperty, AlarmRequest } from '../types';
import {
  isAlarmProperty,
  isAssetModelRequest,
  isAssetRequest,
} from './predicates';

const alarmAssetModelRequest: AlarmRequest = {
  assetModelId: MOCK_ASSET_MODEL_ID,
};

const alarmAssetRequest: AlarmRequest = {
  assetId: MOCK_ASSET_ID,
};
const alarmAssetCompositeModelRequest: AlarmRequest = {
  assetId: MOCK_ASSET_ID,
  assetCompositeModelId: MOCK_COMPOSITE_MODEL_ID,
};
const alarmInputPropertyRequest: AlarmRequest = {
  assetId: MOCK_ASSET_ID,
  inputPropertyId: MOCK_ALARM_INPUT_PROPERTY_ID,
};

describe('alarm request predicates', () => {
  test('isAssetModelRequest should return true when request has an assetModelId', () => {
    expect(isAssetModelRequest(alarmAssetModelRequest)).toBe(true);
  });

  test('isAssetRequest should return true when request has an assetId', () => {
    expect(isAssetRequest(alarmAssetRequest)).toBe(true);
    expect(isAssetRequest(alarmAssetCompositeModelRequest)).toBe(true);
    expect(isAssetRequest(alarmInputPropertyRequest)).toBe(true);
  });

  test('isAssetModelRequest should return false when request has an assetId', () => {
    expect(isAssetModelRequest(alarmAssetRequest)).toBe(false);
    expect(isAssetModelRequest(alarmAssetCompositeModelRequest)).toBe(false);
    expect(isAssetModelRequest(alarmInputPropertyRequest)).toBe(false);
  });

  test('isAssetRequest should return false when request has an assetModelId', () => {
    expect(isAssetRequest(alarmAssetModelRequest)).toBe(false);
  });

  test('isAlarmProperty should return true when provided an AlarmProperty', () => {
    const mockAlarmProperty: AlarmProperty = {
      property: mockStateAssetProperty,
    };
    expect(isAlarmProperty(mockAlarmProperty)).toBe(true);
  });

  test('isAlarmProperty should return false when other AlarmData property', () => {
    const mockIncorrectAlarmProperty: AlarmProperty =
      'assetId' as unknown as AlarmProperty;
    expect(isAlarmProperty(mockIncorrectAlarmProperty)).toBe(false);
  });
});
