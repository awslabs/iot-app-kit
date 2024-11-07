import {
  mockAlarmDataDescribeAsset,
  mockAlarmDataDescribeAsset2,
  mockTypeAssetPropertyValue,
  mockTypeAssetPropertyValue2,
} from '../../../../../testing/alarms';
import {
  mockLoadingStatus,
  mockSuccessStatus,
} from '../../../../../testing/alarms/mockStatuses';
import { type AlarmsState } from '../../types';
import { updateAlarmTypeData } from './updateAlarmTypeData';

describe('updateAlarmTypeData', () => {
  it('properly sets the value for the alarm type property', () => {
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

    const updatedState = updateAlarmTypeData(state, {
      assetPropertyValueSummaries: [
        {
          request: {
            assetId: mockAlarmDataDescribeAsset.assetId,
            propertyId: mockAlarmDataDescribeAsset.type.property.id,
          },
          data: {
            propertyValue: mockTypeAssetPropertyValue,
          },
          status: mockSuccessStatus,
        },
        {
          request: {
            assetId: mockAlarmDataDescribeAsset2.assetId,
            propertyId: mockAlarmDataDescribeAsset2.type.property.id,
          },
          data: {
            propertyValue: mockTypeAssetPropertyValue2,
          },
          status: mockSuccessStatus,
        },
      ],
    });

    // other properties are referentially equal
    expect(updatedState.alarms.at(0)?.alarmDatas.at(0)?.source).toBe(
      mockAlarmDataDescribeAsset.source
    );
    expect(updatedState.alarms.at(0)?.alarmDatas.at(0)?.state).toBe(
      mockAlarmDataDescribeAsset.state
    );
    expect(updatedState.alarms.at(0)?.alarmDatas.at(0)?.type?.property).toBe(
      mockAlarmDataDescribeAsset.type.property
    );

    expect(updatedState).toMatchObject({
      alarms: [
        {
          alarmDatas: [
            {
              type: {
                property: mockAlarmDataDescribeAsset.type.property,
                data: [mockTypeAssetPropertyValue],
              },
            },
            {
              type: {
                property: mockAlarmDataDescribeAsset2.type.property,
                data: [mockTypeAssetPropertyValue2],
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

    const loadingState = updateAlarmTypeData(state, {
      assetPropertyValueSummaries: [
        {
          request: {
            assetId: mockAlarmDataDescribeAsset.assetId,
            propertyId: mockAlarmDataDescribeAsset.type.property.id,
          },
          data: {
            propertyValue: mockTypeAssetPropertyValue,
          },
          status: mockLoadingStatus,
        },
        {
          request: {
            assetId: mockAlarmDataDescribeAsset2.assetId,
            propertyId: mockAlarmDataDescribeAsset2.type.property.id,
          },
          data: {
            propertyValue: mockTypeAssetPropertyValue2,
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
              getLatestAlarmTypeValueQueryStatus: mockLoadingStatus,
            },
            {
              getLatestAlarmTypeValueQueryStatus: mockSuccessStatus,
            },
          ],
        },
      ],
    });
  });
});
