import { renderHook, waitFor } from '@testing-library/react';
import { useAlarms } from './useAlarms';
import type { AlarmData, AlarmDataInternal, AlarmProperty } from './types';
import {
  MOCK_ALARM_INPUT_PROPERTY_ID,
  MOCK_ALARM_INPUT_PROPERTY_ID_2,
  MOCK_ASSET_ID,
  MOCK_COMPOSITE_MODEL_ID,
  iotSiteWiseClientMock,
  mockAlarmDataDescribeAlarmModel,
  mockAlarmDataDescribeAlarmModel2,
  mockAlarmDataDescribeAsset,
  mockAlarmDataGetAssetPropertyValue,
  mockAssetProperties,
  mockStateAssetPropertyValue,
} from '../../testing/alarms';
import * as alarmAssetHook from './hookHelpers/useAlarmAssets';
import * as alarmCompositeProp from './hookHelpers/useLatestAlarmPropertyValues';
import * as alarmModelHook from './hookHelpers/useAlarmModels';
import { type AssetProperty } from '@aws-sdk/client-iotsitewise';

jest.mock('./hookHelpers/useAlarmAssets');
jest.mock('./hookHelpers/useLatestAlarmPropertyValues');
jest.mock('./hookHelpers/useAlarmModels');

const useAlarmAssetsMock = jest.spyOn(alarmAssetHook, 'useAlarmAssets');
const useLatestAlarmPropertyValuesMock = jest.spyOn(
  alarmCompositeProp,
  'useLatestAlarmPropertyValues'
);
const useAlarmModelsMock = jest.spyOn(alarmModelHook, 'useAlarmModels');

const mockRequest = {
  assetId: MOCK_ASSET_ID,
  assetCompositeModelId: MOCK_COMPOSITE_MODEL_ID,
};

const mockAlarmDataInternal = {
  ...mockAlarmDataDescribeAlarmModel,
  request: mockRequest,
  properties: mockAssetProperties,
} satisfies AlarmDataInternal;

/**
 * TODO: need to update tests so that they test
 * actual AlarmData. Skpping for now.
 */
describe.skip('useAlarms', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should not transform AlarmData when no transform function supplied', async () => {
    useAlarmAssetsMock.mockReturnValue([mockAlarmDataDescribeAsset]);
    useLatestAlarmPropertyValuesMock.mockReturnValue([
      mockAlarmDataGetAssetPropertyValue,
    ]);
    useAlarmModelsMock.mockReturnValue([mockAlarmDataInternal]);

    const { result: alarmResults } = renderHook(() =>
      useAlarms({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [mockRequest],
      })
    );

    await waitFor(() =>
      expect(alarmResults.current).toMatchObject([
        mockAlarmDataDescribeAlarmModel as AlarmData,
      ])
    );

    expect(useAlarmAssetsMock).toBeCalledTimes(1);
    expect(useLatestAlarmPropertyValuesMock).toBeCalledTimes(2);
    expect(useAlarmModelsMock).toBeCalledTimes(1);
  });

  it('should transform AlarmData according to supplied transform function', async () => {
    useAlarmAssetsMock.mockReturnValue([mockAlarmDataDescribeAsset]);
    useLatestAlarmPropertyValuesMock.mockReturnValue([
      mockAlarmDataGetAssetPropertyValue,
    ]);
    useAlarmModelsMock.mockReturnValue([mockAlarmDataInternal]);

    const transform = (alarmData: AlarmData): AlarmProperty | undefined =>
      alarmData.state;

    const expectedStateProperty: AlarmProperty = {
      property: mockAlarmDataDescribeAsset.state!.property,
      data: [mockStateAssetPropertyValue],
    };

    const { result: alarmResults } = renderHook(() =>
      useAlarms<AlarmProperty | undefined>({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [mockRequest],
        transform,
      })
    );

    await waitFor(() =>
      expect(alarmResults.current).toMatchObject([expectedStateProperty])
    );

    expect(useAlarmAssetsMock).toBeCalledTimes(1);
    expect(useLatestAlarmPropertyValuesMock).toBeCalledTimes(2);
    expect(useAlarmModelsMock).toBeCalledTimes(1);
  });

  it('should return AlarmData with associated inputProperty from request', async () => {
    const mockInputPropertyRequest = {
      assetId: MOCK_ASSET_ID,
      inputPropertyId: MOCK_ALARM_INPUT_PROPERTY_ID,
    };

    const mockAssetProperty = {
      id: MOCK_ALARM_INPUT_PROPERTY_ID,
      name: 'alarmInputName',
      dataType: 'STRING',
    } satisfies AssetProperty;

    const mockAlarmDataInternalAlarmModel = {
      ...mockAlarmDataDescribeAlarmModel,
      request: mockInputPropertyRequest,
      properties: [mockAssetProperty],
    } satisfies AlarmDataInternal;

    const mockAlarmDataInternalAlarmModel2 = {
      ...mockAlarmDataDescribeAlarmModel2,
      request: mockInputPropertyRequest,
      properties: [mockAssetProperty],
    } satisfies AlarmDataInternal;

    useAlarmAssetsMock.mockReturnValue([mockAlarmDataDescribeAsset]);
    useLatestAlarmPropertyValuesMock.mockReturnValue([
      mockAlarmDataGetAssetPropertyValue,
    ]);
    // Case where multiple alarms from the same asset have different alarm models
    useAlarmModelsMock.mockReturnValue([
      mockAlarmDataInternalAlarmModel,
      mockAlarmDataInternalAlarmModel2,
    ]);

    const expectedAlarmData: AlarmData = {
      ...mockAlarmDataDescribeAlarmModel,
      inputProperty: [
        {
          property: mockAssetProperty,
        },
      ],
    };

    const { result: alarmResults } = renderHook(() =>
      useAlarms({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [mockInputPropertyRequest],
      })
    );

    await waitFor(() =>
      expect(alarmResults.current).toMatchObject([expectedAlarmData])
    );

    expect(useAlarmAssetsMock).toBeCalledTimes(1);
    expect(useLatestAlarmPropertyValuesMock).toBeCalledTimes(2);
    expect(useAlarmModelsMock).toBeCalledTimes(1);
  });

  it('should return AlarmData with inputProperty from alarm model', async () => {
    const mockAssetProperty1 = {
      id: MOCK_ALARM_INPUT_PROPERTY_ID,
      name: 'alarmInputName',
      dataType: 'STRING',
    } satisfies AssetProperty;

    const mockAssetProperty2 = {
      id: MOCK_ALARM_INPUT_PROPERTY_ID_2,
      name: 'alarmInputName2',
      dataType: 'STRING',
    } satisfies AssetProperty;

    const mockAlarmDataInternalAlarmModel = {
      ...mockAlarmDataDescribeAlarmModel,
      request: mockRequest,
      properties: [mockAssetProperty1, mockAssetProperty2],
    } satisfies AlarmDataInternal;

    const mockAlarmDataInternalAlarmModel2 = {
      ...mockAlarmDataDescribeAlarmModel2,
      request: mockRequest,
      properties: [mockAssetProperty1, mockAssetProperty2],
    } satisfies AlarmDataInternal;

    const expectedAlarmData1: AlarmData = {
      ...mockAlarmDataDescribeAlarmModel,
      inputProperty: [
        {
          property: mockAssetProperty1,
        },
      ],
    };

    const expectedAlarmData2: AlarmData = {
      ...mockAlarmDataDescribeAlarmModel2,
      inputProperty: [
        {
          property: mockAssetProperty2,
        },
      ],
    };

    useAlarmAssetsMock.mockReturnValue([mockAlarmDataDescribeAsset]);
    useLatestAlarmPropertyValuesMock.mockReturnValue([
      mockAlarmDataGetAssetPropertyValue,
    ]);
    // Case where multiple alarms from the same asset have different alarm models
    useAlarmModelsMock.mockReturnValue([
      mockAlarmDataInternalAlarmModel,
      mockAlarmDataInternalAlarmModel2,
    ]);

    const { result: alarmResults } = renderHook(() =>
      useAlarms({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [mockRequest],
      })
    );

    await waitFor(() =>
      expect(alarmResults.current).toMatchObject([
        expectedAlarmData1,
        expectedAlarmData2,
      ])
    );

    expect(useAlarmAssetsMock).toBeCalledTimes(1);
    expect(useLatestAlarmPropertyValuesMock).toBeCalledTimes(2);
    expect(useAlarmModelsMock).toBeCalledTimes(1);
  });
});
