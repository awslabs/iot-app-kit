import { add, sub } from 'date-fns';
import {
  MOCK_ALARM_THRESHOLD_PROPERTY_ID,
  MOCK_ALARM_THRESHOLD_PROPERTY_ID_2,
  mockAlarmDataDescribeAlarmModel,
  mockAlarmDataDescribeAlarmModel2,
  mockAlarmDataDescribeAsset,
  mockAlarmDataDescribeAsset2,
  mockDoubleAssetPropertyValue,
} from '../../../../../testing/alarms';
import {
  mockLoadingStatus,
  mockSuccessStatus,
} from '../../../../../testing/alarms/mockStatuses';
import { type AlarmsState } from '../../types';
import { updateAlarmThresholdData } from './updateAlarmThresholdData';

const date = new Date(1728674795974);
const viewport = {
  start: sub(date, { hours: 1 }),
  end: add(date, { hours: 1 }),
};

const thresholdAssetPropertyValue = mockDoubleAssetPropertyValue(1, date);

const thresholdAssetPropertyValue2 = mockDoubleAssetPropertyValue(200, date);

describe('updateAlarmThresholdData', () => {
  it('sets alarm thresholds data', () => {
    const state = {
      alarms: [
        {
          describeAssetQueryStatus: mockSuccessStatus,
          request: {
            assetId: mockAlarmDataDescribeAlarmModel.assetId,
          },
          alarmDatas: [
            mockAlarmDataDescribeAlarmModel,
            mockAlarmDataDescribeAlarmModel2,
          ],
        },
      ],
    } satisfies AlarmsState;

    expect(
      updateAlarmThresholdData(state, {
        viewport,
        assetPropertyValueSummaries: [
          {
            request: {
              assetId: mockAlarmDataDescribeAlarmModel.assetId,
              propertyId: MOCK_ALARM_THRESHOLD_PROPERTY_ID,
            },
            data: [thresholdAssetPropertyValue],
            status: mockSuccessStatus,
          },
          {
            request: {
              assetId: mockAlarmDataDescribeAlarmModel2.assetId,
              propertyId: MOCK_ALARM_THRESHOLD_PROPERTY_ID_2,
            },
            data: [thresholdAssetPropertyValue2],
            status: mockSuccessStatus,
          },
        ],
      })
    ).toMatchObject({
      alarms: [
        {
          alarmDatas: [
            {
              thresholds: [thresholdAssetPropertyValue],
            },
            {
              thresholds: [thresholdAssetPropertyValue2],
            },
          ],
        },
      ],
    });
  });

  it('does not set anything if there is no alarm data models or summary', async () => {
    const state = {
      alarms: [
        {
          describeAssetQueryStatus: mockLoadingStatus,
          request: {
            assetId: mockAlarmDataDescribeAsset.assetId,
          },
          alarmDatas: [{}],
        },
      ],
    } satisfies AlarmsState;

    expect(
      updateAlarmThresholdData(state, {
        viewport,
        assetPropertyValueSummaries: [],
      })
    ).toBe(state);

    expect(
      updateAlarmThresholdData(state, {
        viewport,
        assetPropertyValueSummaries: [
          {
            request: {
              assetId: mockAlarmDataDescribeAsset.assetId,
              propertyId: mockAlarmDataDescribeAsset.state.property.id,
            },
            data: [thresholdAssetPropertyValue],
            status: mockSuccessStatus,
          },
        ],
      })
        .alarms.at(0)
        ?.alarmDatas.at(0)
    ).toBe(state.alarms.at(0)?.alarmDatas.at(0));

    const stateWithDifferentStateProperty = {
      alarms: [
        {
          describeAssetQueryStatus: mockLoadingStatus,
          request: {
            assetId: mockAlarmDataDescribeAsset.assetId,
          },
          alarmDatas: [mockAlarmDataDescribeAsset2],
        },
      ],
    } satisfies AlarmsState;

    expect(
      updateAlarmThresholdData(stateWithDifferentStateProperty, {
        viewport,
        assetPropertyValueSummaries: [
          {
            request: {
              assetId: mockAlarmDataDescribeAsset.assetId,
              propertyId: mockAlarmDataDescribeAsset.state.property.id,
            },
            data: [thresholdAssetPropertyValue],
            status: mockSuccessStatus,
          },
        ],
      })
        .alarms.at(0)
        ?.alarmDatas.at(0)
    ).toBe(stateWithDifferentStateProperty.alarms.at(0)?.alarmDatas.at(0));
  });

  it('does not set anything if there are already defined thresholds', async () => {
    const state = {
      alarms: [
        {
          describeAssetQueryStatus: mockSuccessStatus,
          request: {
            assetId: mockAlarmDataDescribeAlarmModel.assetId,
          },
          alarmDatas: [
            {
              ...mockAlarmDataDescribeAlarmModel,
              thresholds: [thresholdAssetPropertyValue],
            },
            {
              ...mockAlarmDataDescribeAlarmModel2,
              thresholds: [thresholdAssetPropertyValue2],
            },
          ],
        },
      ],
    } satisfies AlarmsState;

    expect(
      updateAlarmThresholdData(state, {
        viewport,
        assetPropertyValueSummaries: [],
      })
    ).toBe(state);

    expect(
      updateAlarmThresholdData(state, {
        viewport,
        assetPropertyValueSummaries: [
          {
            request: {
              assetId: mockAlarmDataDescribeAlarmModel.assetId,
              propertyId: mockAlarmDataDescribeAlarmModel.state.property.id,
            },
            data: [thresholdAssetPropertyValue],
            status: mockSuccessStatus,
          },
          {
            request: {
              assetId: mockAlarmDataDescribeAlarmModel2.assetId,
              propertyId: mockAlarmDataDescribeAlarmModel2.state.property.id,
            },
            data: [thresholdAssetPropertyValue2],
            status: mockSuccessStatus,
          },
        ],
      })
        .alarms.at(0)
        ?.alarmDatas.at(0)?.thresholds
    ).toBe(state.alarms.at(0)?.alarmDatas.at(0)?.thresholds);
  });
});
