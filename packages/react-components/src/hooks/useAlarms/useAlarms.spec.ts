import { renderHook, waitFor } from '@testing-library/react';
import { useAlarms } from './useAlarms';
import { AlarmData, AlarmProperty } from './types';
import {
  MOCK_ASSET_ID,
  MOCK_COMPOSITE_MODEL_ID,
  iotSiteWiseClientMock,
  mockAlarmDataDescribeAsset,
} from '../../testing/alarms';
import * as hooks from './hookHelpers';

jest.mock('./hookHelpers');

const useAlarmAssetsMock = jest.spyOn(hooks, 'useAlarmAssets');

describe('useAlarms', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should not transform AlarmData when no transform function supplied', async () => {
    useAlarmAssetsMock.mockReturnValue([mockAlarmDataDescribeAsset]);

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
      expect(alarmResults.current).toMatchObject([mockAlarmDataDescribeAsset])
    );

    expect(useAlarmAssetsMock).toBeCalled();
  });

  it('should transform AlarmData according to supplied transform function', async () => {
    useAlarmAssetsMock.mockReturnValue([mockAlarmDataDescribeAsset]);

    const transform = (alarmData: AlarmData): AlarmProperty | undefined =>
      alarmData.state;

    const expectedStateProperty: AlarmProperty = {
      property: mockAlarmDataDescribeAsset.state!.property,
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
  });
});
