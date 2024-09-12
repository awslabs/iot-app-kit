import { renderHook, waitFor } from '@testing-library/react';
import { useAlarms } from './useAlarms';
import { AlarmData, AlarmProperty } from './types';
import {
  MOCK_ALARM_INPUT_PROPERTY_ID,
  MOCK_ASSET_ID,
  MOCK_COMPOSITE_MODEL_ID,
  iotSiteWiseClientMock,
  mockAlarmDataDescribeAlarmModel,
  mockAlarmDataDescribeAlarmModel2,
  mockAlarmDataDescribeAsset,
  mockAlarmDataGetAssetPropertyValue,
  mockInputProperty,
  mockStateAssetPropertyValue,
} from '../../testing/alarms';
import * as alarmAssetHook from './hookHelpers/useAlarmAssets';
import * as alarmCompositeProp from './hookHelpers/useLatestAlarmPropertyValue';
import * as alarmModelHook from './hookHelpers/useAlarmModels';

jest.mock('./hookHelpers/useAlarmAssets');
jest.mock('./hookHelpers/useLatestAlarmPropertyValue');
jest.mock('./hookHelpers/useAlarmModels');

const useAlarmAssetsMock = jest.spyOn(alarmAssetHook, 'useAlarmAssets');
const useLatestAlarmPropertyValueMock = jest.spyOn(
  alarmCompositeProp,
  'useLatestAlarmPropertyValue'
);
const useAlarmModelsMock = jest.spyOn(alarmModelHook, 'useAlarmModels');

describe('useAlarms', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should not transform AlarmData when no transform function supplied', async () => {
    useAlarmAssetsMock.mockReturnValue([mockAlarmDataDescribeAsset]);
    useLatestAlarmPropertyValueMock.mockReturnValue([
      mockAlarmDataGetAssetPropertyValue,
    ]);
    useAlarmModelsMock.mockReturnValue([mockAlarmDataDescribeAlarmModel]);

    const { result: alarmResults } = renderHook(() =>
      useAlarms({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [
          {
            assetId: MOCK_ASSET_ID,
            assetCompositeModelId: MOCK_COMPOSITE_MODEL_ID,
          },
        ],
      })
    );

    await waitFor(() =>
      expect(alarmResults.current).toMatchObject([
        mockAlarmDataDescribeAlarmModel,
      ])
    );

    expect(useAlarmAssetsMock).toBeCalledTimes(1);
    expect(useLatestAlarmPropertyValueMock).toBeCalledTimes(3);
    expect(useAlarmModelsMock).toBeCalledTimes(1);
  });

  it('should transform AlarmData according to supplied transform function', async () => {
    useAlarmAssetsMock.mockReturnValue([mockAlarmDataDescribeAsset]);
    useLatestAlarmPropertyValueMock.mockReturnValue([
      mockAlarmDataGetAssetPropertyValue,
    ]);
    useAlarmModelsMock.mockReturnValue([mockAlarmDataDescribeAlarmModel]);

    const transform = (alarmData: AlarmData): AlarmProperty | undefined =>
      alarmData.state;

    const expectedStateProperty: AlarmProperty = {
      property: mockAlarmDataDescribeAsset.state!.property,
      data: [mockStateAssetPropertyValue],
    };

    const { result: alarmResults } = renderHook(() =>
      useAlarms<AlarmProperty | undefined>({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [
          {
            assetId: MOCK_ASSET_ID,
            assetCompositeModelId: MOCK_COMPOSITE_MODEL_ID,
          },
        ],
        transform,
      })
    );

    await waitFor(() =>
      expect(alarmResults.current).toMatchObject([expectedStateProperty])
    );

    expect(useAlarmAssetsMock).toBeCalledTimes(1);
    expect(useLatestAlarmPropertyValueMock).toBeCalledTimes(3);
    expect(useAlarmModelsMock).toBeCalledTimes(1);
  });

  it('should return AlarmData with associated inputProperty', async () => {
    // Case where multiple alarms from the same asset have different alarm models
    const mockAlarmDataInputProperty: AlarmData = {
      ...mockAlarmDataDescribeAlarmModel,
      inputProperty: [mockInputProperty],
    };

    const mockAlarmDataInputProperty2: AlarmData = {
      ...mockAlarmDataDescribeAlarmModel,
      models: mockAlarmDataDescribeAlarmModel2.models,
      inputProperty: [mockInputProperty],
    };

    useAlarmAssetsMock.mockReturnValue([mockAlarmDataDescribeAsset]);
    useLatestAlarmPropertyValueMock.mockReturnValue([
      mockAlarmDataGetAssetPropertyValue,
    ]);
    useAlarmModelsMock.mockReturnValue([
      mockAlarmDataInputProperty,
      mockAlarmDataInputProperty2,
    ]);

    const { result: alarmResults } = renderHook(() =>
      useAlarms({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [
          {
            assetId: MOCK_ASSET_ID,
            inputPropertyId: MOCK_ALARM_INPUT_PROPERTY_ID,
          },
        ],
      })
    );

    await waitFor(() =>
      expect(alarmResults.current).toMatchObject([mockAlarmDataInputProperty])
    );

    expect(useAlarmAssetsMock).toBeCalledTimes(1);
    expect(useLatestAlarmPropertyValueMock).toBeCalledTimes(3);
    expect(useAlarmModelsMock).toBeCalledTimes(1);
  });
});
