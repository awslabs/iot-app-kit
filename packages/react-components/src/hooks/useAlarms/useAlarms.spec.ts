import { renderHook, waitFor } from '@testing-library/react';
import { useAlarms } from './useAlarms';
import { AlarmData, AlarmProperty } from './types';
import {
  MOCK_ASSET_ID,
  MOCK_COMPOSITE_MODEL_ID,
  iotSiteWiseClientMock,
  mockAlarmDataDescribeAsset,
  mockAlarmDataGetAssetPropertyValue,
  mockStateAssetPropertyValue,
} from '../../testing/alarms';
import * as alarmAssetHook from './hookHelpers/useAlarmAssets';
import * as alarmCompositeProp from './hookHelpers/useLatestAlarmPropertyValue';

jest.mock('./hookHelpers/useAlarmAssets');
jest.mock('./hookHelpers/useLatestAlarmPropertyValue');

const useAlarmAssetsMock = jest.spyOn(alarmAssetHook, 'useAlarmAssets');
const useLatestAlarmPropertyValueMock = jest.spyOn(
  alarmCompositeProp,
  'useLatestAlarmPropertyValue'
);

describe('useAlarms', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should not transform AlarmData when no transform function supplied', async () => {
    useAlarmAssetsMock.mockReturnValue([mockAlarmDataDescribeAsset]);
    useLatestAlarmPropertyValueMock.mockReturnValue([
      mockAlarmDataGetAssetPropertyValue,
    ]);

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
        mockAlarmDataGetAssetPropertyValue,
      ])
    );

    expect(useAlarmAssetsMock).toBeCalled();
    expect(useLatestAlarmPropertyValueMock).toBeCalledTimes(3);
  });

  it('should transform AlarmData according to supplied transform function', async () => {
    useAlarmAssetsMock.mockReturnValue([mockAlarmDataDescribeAsset]);
    useLatestAlarmPropertyValueMock.mockReturnValue([
      mockAlarmDataGetAssetPropertyValue,
    ]);

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

    expect(useAlarmAssetsMock).toBeCalled();
    expect(useLatestAlarmPropertyValueMock).toBeCalledTimes(3);
  });
});
