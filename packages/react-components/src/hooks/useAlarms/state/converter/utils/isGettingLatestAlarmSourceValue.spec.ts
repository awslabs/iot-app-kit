import {
  mockLoadingStatus,
  mockSuccessStatus,
} from '../../../../../testing/alarms/mockStatuses';
import { isGettingLatestAlarmSourceValue } from './isGettingLatestAlarmSourceValue';

describe('isGettingLatestAlarmSourceValue', () => {
  it('is true if any alarm datas source queries are not successful', () => {
    expect(
      isGettingLatestAlarmSourceValue({
        request: {
          assetId: 'asset-1',
        },
        alarmDatas: [
          {
            getLatestAlarmSourceValueQueryStatus: mockLoadingStatus,
          },
          {
            getLatestAlarmSourceValueQueryStatus: mockSuccessStatus,
          },
          {
            getLatestAlarmSourceValueQueryStatus: mockLoadingStatus,
          },
        ],
      })
    ).toBeTrue();
  });

  it('is true if all alarm datas source queries are not successful', () => {
    expect(
      isGettingLatestAlarmSourceValue({
        request: {
          assetId: 'asset-1',
        },
        alarmDatas: [
          {
            getLatestAlarmSourceValueQueryStatus: mockLoadingStatus,
          },
          {
            getLatestAlarmSourceValueQueryStatus: mockLoadingStatus,
          },
          {
            getLatestAlarmSourceValueQueryStatus: mockLoadingStatus,
          },
        ],
      })
    ).toBeTrue();
  });

  it('is false if all alarm datas source queries are successful', () => {
    expect(
      isGettingLatestAlarmSourceValue({
        request: {
          assetId: 'asset-1',
        },
        alarmDatas: [
          {
            getLatestAlarmSourceValueQueryStatus: mockSuccessStatus,
          },
          {
            getLatestAlarmSourceValueQueryStatus: mockSuccessStatus,
          },
          {
            getLatestAlarmSourceValueQueryStatus: mockSuccessStatus,
          },
        ],
      })
    ).toBeFalse();
  });
});
