import {
  AssetCompositeModel,
  AssetModelCompositeModel,
} from '@aws-sdk/client-iotsitewise';
import { ALARM_COMPOSITE_MODEL_TYPE } from '../../hooks/useAlarms/constants';
import {
  mockSourceAssetModelProperty,
  mockSourceAssetProperty,
  mockStateAssetModelProperty,
  mockStateAssetProperty,
  mockTypeAssetModelProperty,
  mockTypeAssetProperty,
} from './mockProperties';
import {
  MOCK_COMPOSITE_MODEL_ID,
  MOCK_COMPOSITE_MODEL_ID_2,
  MOCK_COMPOSITE_MODEL_NAME,
  MOCK_COMPOSITE_MODEL_NAME_2,
} from './mockIds';

export const mockAlarmCompositeModel = {
  name: MOCK_COMPOSITE_MODEL_NAME,
  type: ALARM_COMPOSITE_MODEL_TYPE,
  properties: [
    mockStateAssetProperty,
    mockTypeAssetProperty,
    mockSourceAssetProperty,
  ],
  id: MOCK_COMPOSITE_MODEL_ID,
} satisfies AssetCompositeModel;

export const mockAlarmCompositeModel2 = {
  name: MOCK_COMPOSITE_MODEL_NAME_2,
  type: ALARM_COMPOSITE_MODEL_TYPE,
  properties: [
    mockStateAssetProperty,
    mockTypeAssetProperty,
    mockSourceAssetProperty,
  ],
  id: MOCK_COMPOSITE_MODEL_ID_2,
} satisfies AssetCompositeModel;

export const mockAlarmModelCompositeModel = {
  name: MOCK_COMPOSITE_MODEL_NAME,
  type: ALARM_COMPOSITE_MODEL_TYPE,
  properties: [
    mockStateAssetModelProperty,
    mockTypeAssetModelProperty,
    mockSourceAssetModelProperty,
  ],
  id: MOCK_COMPOSITE_MODEL_ID,
} satisfies AssetModelCompositeModel;

export const mockAlarmModelCompositeModel2 = {
  name: MOCK_COMPOSITE_MODEL_NAME_2,
  type: ALARM_COMPOSITE_MODEL_TYPE,
  properties: [
    mockStateAssetModelProperty,
    mockTypeAssetModelProperty,
    mockSourceAssetModelProperty,
  ],
  id: MOCK_COMPOSITE_MODEL_ID_2,
} satisfies AssetModelCompositeModel;
