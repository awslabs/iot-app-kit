import { toId } from '@iot-app-kit/source-iotsitewise';
import {
  MOCK_ALARM_INPUT_PROPERTY_ID,
  MOCK_ALARM_INPUT_PROPERTY_ID_2,
  MOCK_ASSET_ID,
  mockAlarmDataDescribeAsset,
  mockAlarmDataWithInputProperty,
  mockAlarmDataWithInputProperty2,
} from '../../../../../testing/alarms';
import { mockSuccessStatus } from '../../../../../testing/alarms/mockStatuses';
import { AlarmsState } from '../../types';
import { updateAlarmInputPropertyData } from './updateAlarmInputPropertyData';
import { DataStream } from '@iot-app-kit/core';

const TEST_DATASTREAM_1 = {
  id: toId({
    assetId: MOCK_ASSET_ID,
    propertyId: MOCK_ALARM_INPUT_PROPERTY_ID,
  }),
  data: [
    { x: 0, y: 1 },
    { x: 1, y: 2 },
    { x: 3, y: 3 },
  ],
  dataType: 'NUMBER',
  resolution: 0,
} satisfies DataStream;

const TEST_DATASTREAM_2 = {
  id: toId({
    assetId: MOCK_ASSET_ID,
    propertyId: MOCK_ALARM_INPUT_PROPERTY_ID_2,
  }),
  data: [
    { x: 10, y: 1 },
    { x: 11, y: 2 },
    { x: 13, y: 3 },
  ],
  dataType: 'NUMBER',
  resolution: 0,
} satisfies DataStream;

describe('updateAlarmInputPropertyData', () => {
  it('properly sets the datastream for an input property', () => {
    const state = {
      alarms: [
        {
          describeAssetQueryStatus: mockSuccessStatus,
          request: {
            assetId: mockAlarmDataWithInputProperty.assetId,
          },
          alarmDatas: [
            mockAlarmDataWithInputProperty,
            mockAlarmDataWithInputProperty2,
          ],
        },
      ],
    } satisfies AlarmsState;

    const updatedState = updateAlarmInputPropertyData(state, {
      dataStreams: [TEST_DATASTREAM_1, TEST_DATASTREAM_2],
    });

    // other properties are referentially equal
    expect(
      updatedState.alarms.at(0)?.alarmDatas.at(0)?.inputProperty?.at(0)
        ?.property
    ).toBe(mockAlarmDataWithInputProperty.inputProperty.at(0)?.property);

    expect(updatedState).toMatchObject({
      alarms: [
        {
          alarmDatas: [
            {
              inputProperty: [
                {
                  property:
                    mockAlarmDataWithInputProperty.inputProperty[0].property,
                  dataStream: TEST_DATASTREAM_1,
                },
              ],
            },
            {
              inputProperty: [
                {
                  property:
                    mockAlarmDataWithInputProperty2.inputProperty[0].property,
                  dataStream: TEST_DATASTREAM_2,
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it('does nothing if there is no assetId or inputProperty', () => {
    const state = {
      alarms: [
        {
          describeAssetQueryStatus: mockSuccessStatus,
          request: {
            assetId: mockAlarmDataDescribeAsset.assetId,
          },
          alarmDatas: [mockAlarmDataDescribeAsset],
        },
      ],
    } satisfies AlarmsState;

    const updatedState = updateAlarmInputPropertyData(state, {
      dataStreams: [TEST_DATASTREAM_1, TEST_DATASTREAM_2],
    });

    expect(updatedState).toMatchObject({
      alarms: [
        {
          alarmDatas: [mockAlarmDataDescribeAsset],
        },
      ],
    });
  });
});
