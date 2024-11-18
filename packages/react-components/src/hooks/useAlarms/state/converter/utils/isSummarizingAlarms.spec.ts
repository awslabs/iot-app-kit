import {
  mockLoadingStatus,
  mockSuccessStatus,
} from '../../../../../testing/alarms/mockStatuses';
import { isSummarizingAlarms } from './isSummarizingAlarms';

describe('isSummarizingAlarms', () => {
  it('is true if any alarm requests asset or asset model queries are not successful', () => {
    expect(
      isSummarizingAlarms({
        request: {
          assetId: 'asset-1',
        },
        describeAssetQueryStatus: mockLoadingStatus,
        alarmDatas: [],
      })
    ).toBeTrue();

    expect(
      isSummarizingAlarms({
        request: {
          assetId: 'asset-1',
        },
        describeAssetModelQueryStatus: mockLoadingStatus,
        alarmDatas: [],
      })
    ).toBeTrue();

    expect(
      isSummarizingAlarms({
        request: {
          assetId: 'asset-1',
        },
        alarmDatas: [],
      })
    ).toBeTrue();
  });

  it('is false if all alarm requests asset or asset model queries are successful', () => {
    expect(
      isSummarizingAlarms({
        request: {
          assetId: 'asset-1',
        },
        describeAssetQueryStatus: mockSuccessStatus,
        alarmDatas: [],
      })
    ).toBeFalse();

    expect(
      isSummarizingAlarms({
        request: {
          assetId: 'asset-1',
        },
        describeAssetModelQueryStatus: mockSuccessStatus,
        alarmDatas: [],
      })
    ).toBeFalse();
  });
});
