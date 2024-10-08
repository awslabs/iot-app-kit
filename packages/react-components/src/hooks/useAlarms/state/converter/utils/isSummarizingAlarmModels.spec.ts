import {
  mockLoadingStatus,
  mockSuccessStatus,
} from '../../../../../testing/alarms/mockStatuses';
import { isSummarizingAlarmModels } from './isSummarizingAlarmModels';

describe('isSummarizingAlarmModels', () => {
  it('is true if any alarm datas models queries are not successful', () => {
    expect(
      isSummarizingAlarmModels({
        request: {
          assetId: 'asset-1',
        },
        alarmDatas: [
          {
            describeAlarmModelsQueryStatus: mockLoadingStatus,
          },
          {
            describeAlarmModelsQueryStatus: mockSuccessStatus,
          },
          {
            describeAlarmModelsQueryStatus: mockLoadingStatus,
          },
        ],
      })
    ).toBeTrue();
  });

  it('is true if all alarm datas models queries are not successful', () => {
    expect(
      isSummarizingAlarmModels({
        request: {
          assetId: 'asset-1',
        },
        alarmDatas: [
          {
            describeAlarmModelsQueryStatus: mockLoadingStatus,
          },
          {
            describeAlarmModelsQueryStatus: mockLoadingStatus,
          },
          {
            describeAlarmModelsQueryStatus: mockLoadingStatus,
          },
        ],
      })
    ).toBeTrue();
  });

  it('is false if all alarm datas models queries are successful', () => {
    expect(
      isSummarizingAlarmModels({
        request: {
          assetId: 'asset-1',
        },
        alarmDatas: [
          {
            describeAlarmModelsQueryStatus: mockSuccessStatus,
          },
          {
            describeAlarmModelsQueryStatus: mockSuccessStatus,
          },
          {
            describeAlarmModelsQueryStatus: mockSuccessStatus,
          },
        ],
      })
    ).toBeFalse();
  });
});
