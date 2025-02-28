import {
  mockLoadingStatus,
  mockSuccessStatus,
} from '../../../../testing/alarms/mockStatuses';
import { convertAlarmsStateToAlarmDatas } from './convertAlarmsStateToAlarmDatas';

describe('convertAlarmsStateToAlarmDatas', () => {
  it('can handle converting empty state', () => {
    const convertedState = convertAlarmsStateToAlarmDatas({
      alarms: [],
    });

    expect(convertedState).toBeArrayOfSize(0);
  });

  it('returns an initial alarm data if the alarm is still being summarized', () => {
    const convertedAssetSummaryState = convertAlarmsStateToAlarmDatas({
      alarms: [
        {
          request: {
            assetId: 'asset-1',
          },
          describeAssetQueryStatus: mockLoadingStatus,
          alarmDatas: [],
        },
      ],
    });

    expect(convertedAssetSummaryState).toBeArrayOfSize(1);
    expect(convertedAssetSummaryState).toEqual([
      expect.objectContaining({
        assetId: 'asset-1',
        status: mockLoadingStatus,
      }),
    ]);

    const convertedAssetModelSummaryState = convertAlarmsStateToAlarmDatas({
      alarms: [
        {
          request: {
            assetModelId: 'asset-model-1',
          },
          describeAssetModelQueryStatus: mockLoadingStatus,
          alarmDatas: [],
        },
      ],
    });

    expect(convertedAssetModelSummaryState).toBeArrayOfSize(1);
    expect(convertedAssetModelSummaryState).toEqual([
      expect.objectContaining({
        assetModelId: 'asset-model-1',
        status: mockLoadingStatus,
      }),
    ]);

    const inputModelState = convertAlarmsStateToAlarmDatas({
      alarms: [
        {
          request: {
            inputPropertyId: 'input-property-1',
            assetId: 'asset-1',
          },
          describeAssetModelQueryStatus: mockSuccessStatus,
          alarmDatas: [
            {
              describeAlarmModelsQueryStatus: mockLoadingStatus,
              getLatestAlarmSourceValueQueryStatus: mockLoadingStatus,
              getLatestAlarmTypeValueQueryStatus: mockLoadingStatus,
            },
            {
              describeAlarmModelsQueryStatus: mockLoadingStatus,
              getLatestAlarmSourceValueQueryStatus: mockLoadingStatus,
              getLatestAlarmTypeValueQueryStatus: mockLoadingStatus,
            },
          ],
        },
      ],
    });

    expect(inputModelState).toBeArrayOfSize(1);
    expect(inputModelState).toEqual([
      expect.objectContaining({
        assetId: 'asset-1',
        status: mockLoadingStatus,
      }),
    ]);
  });

  it('correctly maps multiple requests to alarm datas', () => {
    const convertedState = convertAlarmsStateToAlarmDatas({
      alarms: [
        {
          request: {
            assetId: 'asset-1',
          },
          describeAssetQueryStatus: mockSuccessStatus,
          alarmDatas: [
            {
              assetId: 'asset-1',
              assetModelId: 'asset-model-1',
              compositeModelId: 'composite-model-1',
            },
            {
              assetId: 'asset-1',
              assetModelId: 'asset-model-1',
              compositeModelId: 'composite-model-2',
            },
          ],
        },
        {
          request: {
            assetId: 'asset-2',
          },
          describeAssetQueryStatus: mockSuccessStatus,
          alarmDatas: [
            {
              assetId: 'asset-2',
              assetModelId: 'asset-model-1',
              compositeModelId: 'composite-model-1',
            },
            {
              assetId: 'asset-2',
              assetModelId: 'asset-model-1',
              compositeModelId: 'composite-model-2',
            },
          ],
        },
      ],
    });

    expect(convertedState).toBeArrayOfSize(4);
    expect(convertedState).toEqual([
      expect.objectContaining({
        assetModelId: 'asset-model-1',
        assetId: 'asset-1',
        compositeModelId: 'composite-model-1',
        status: mockSuccessStatus,
      }),
      expect.objectContaining({
        assetModelId: 'asset-model-1',
        assetId: 'asset-1',
        compositeModelId: 'composite-model-2',
        status: mockSuccessStatus,
      }),
      expect.objectContaining({
        assetModelId: 'asset-model-1',
        assetId: 'asset-2',
        compositeModelId: 'composite-model-1',
        status: mockSuccessStatus,
      }),
      expect.objectContaining({
        assetModelId: 'asset-model-1',
        assetId: 'asset-2',
        compositeModelId: 'composite-model-2',
        status: mockSuccessStatus,
      }),
    ]);
  });

  it('deduplicates alarms for requests', () => {
    const convertedState = convertAlarmsStateToAlarmDatas({
      alarms: [
        {
          request: {
            assetId: 'asset-1',
          },
          describeAssetQueryStatus: mockSuccessStatus,
          alarmDatas: [
            {
              assetId: 'asset-1',
              assetModelId: 'asset-model-1',
              compositeModelId: 'composite-model-1',
            },
          ],
        },
        {
          request: {
            inputPropertyId: 'input-property-1',
            assetId: 'asset-1',
          },
          describeAssetModelQueryStatus: mockSuccessStatus,
          alarmDatas: [
            {
              getLatestAlarmSourceValueQueryStatus: mockSuccessStatus,
              describeAlarmModelsQueryStatus: mockSuccessStatus,
              assetId: 'asset-1',
              assetModelId: 'asset-model-1',
              compositeModelId: 'composite-model-1',
            },
          ],
        },
      ],
    });

    expect(convertedState).toBeArrayOfSize(1);
    expect(convertedState).toEqual([
      expect.objectContaining({
        assetModelId: 'asset-model-1',
        assetId: 'asset-1',
        compositeModelId: 'composite-model-1',
        status: mockSuccessStatus,
      }),
    ]);
  });
});
