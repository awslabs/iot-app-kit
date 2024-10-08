import {
  mockAlarmDataDescribeAsset,
  mockAlarmDataDescribeAsset2,
  mockSourceAssetPropertyValue,
  mockSourceAssetPropertyValue2,
} from '../../../../../testing/alarms';
import {
  mockLoadingStatus,
  mockSuccessStatus,
} from '../../../../../testing/alarms/mockStatuses';
import { AlarmsState } from '../../types';
import { updateAlarmSourceData } from './updateAlarmSourceData';

describe('updateAlarmSourceData', () => {
  it('properly sets the value for the alarm source property', () => {
    const state = {
      alarms: [
        {
          describeAssetQueryStatus: mockSuccessStatus,
          request: {
            assetId: mockAlarmDataDescribeAsset.assetId,
          },
          alarmDatas: [mockAlarmDataDescribeAsset, mockAlarmDataDescribeAsset2],
        },
      ],
    } satisfies AlarmsState;

    const updatedState = updateAlarmSourceData(state, {
      assetPropertyValueSummaries: [
        {
          request: {
            assetId: mockAlarmDataDescribeAsset.assetId,
            propertyId: mockAlarmDataDescribeAsset.source.property.id,
          },
          data: {
            propertyValue: mockSourceAssetPropertyValue,
          },
          status: mockSuccessStatus,
        },
        {
          request: {
            assetId: mockAlarmDataDescribeAsset2.assetId,
            propertyId: mockAlarmDataDescribeAsset2.source.property.id,
          },
          data: {
            propertyValue: mockSourceAssetPropertyValue2,
          },
          status: mockSuccessStatus,
        },
      ],
    });

    // other properties are referentially equal
    expect(updatedState.alarms.at(0)?.alarmDatas.at(0)?.type).toBe(
      mockAlarmDataDescribeAsset.type
    );
    expect(updatedState.alarms.at(0)?.alarmDatas.at(0)?.state).toBe(
      mockAlarmDataDescribeAsset.state
    );
    expect(updatedState.alarms.at(0)?.alarmDatas.at(0)?.source?.property).toBe(
      mockAlarmDataDescribeAsset.source.property
    );

    expect(updatedState).toMatchObject({
      alarms: [
        {
          alarmDatas: [
            {
              source: {
                property: mockAlarmDataDescribeAsset.source.property,
                data: [mockSourceAssetPropertyValue],
              },
            },
            {
              source: {
                property: mockAlarmDataDescribeAsset2.source.property,
                data: [mockSourceAssetPropertyValue2],
              },
            },
          ],
        },
      ],
    });
  });

  it('properly sets the status for alarm source property', () => {
    const state = {
      alarms: [
        {
          describeAssetQueryStatus: mockSuccessStatus,
          request: {
            assetId: mockAlarmDataDescribeAsset.assetId,
          },
          alarmDatas: [mockAlarmDataDescribeAsset, mockAlarmDataDescribeAsset2],
        },
      ],
    } satisfies AlarmsState;

    const loadingState = updateAlarmSourceData(state, {
      assetPropertyValueSummaries: [
        {
          request: {
            assetId: mockAlarmDataDescribeAsset.assetId,
            propertyId: mockAlarmDataDescribeAsset.source.property.id,
          },
          data: {
            propertyValue: mockSourceAssetPropertyValue,
          },
          status: mockLoadingStatus,
        },
        {
          request: {
            assetId: mockAlarmDataDescribeAsset2.assetId,
            propertyId: mockAlarmDataDescribeAsset2.source.property.id,
          },
          data: {
            propertyValue: mockSourceAssetPropertyValue2,
          },
          status: mockSuccessStatus,
        },
      ],
    });

    expect(loadingState).toMatchObject({
      alarms: [
        {
          alarmDatas: [
            {
              getLatestAlarmSourceValueQueryStatus: mockLoadingStatus,
            },
            {
              getLatestAlarmSourceValueQueryStatus: mockSuccessStatus,
            },
          ],
        },
      ],
    });
  });
});
