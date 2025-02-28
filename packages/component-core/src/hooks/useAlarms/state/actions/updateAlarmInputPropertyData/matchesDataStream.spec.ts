import { toId } from '@iot-app-kit/source-iotsitewise';
import { matchesDatastream } from './matchesDataStream';
import {
  MOCK_ALARM_INPUT_PROPERTY_ID,
  MOCK_ASSET_ID,
} from '../../../../../testing/alarms';
import { type DataStream } from '@iot-app-kit/core';

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

describe('matchesDataStream', () => {
  it('is true if an assetId and propertyId is a datastreams id', () => {
    expect(
      matchesDatastream({
        assetId: MOCK_ASSET_ID,
        propertyId: MOCK_ALARM_INPUT_PROPERTY_ID,
      })(TEST_DATASTREAM_1)
    ).toBeTrue();
  });

  it('is false if there are no assetId or propertyId', () => {
    expect(
      matchesDatastream({
        assetId: undefined,
        propertyId: undefined,
      })(TEST_DATASTREAM_1)
    ).toBeFalse();
  });

  it('is false if a datastream does not have a matching asset id or propertyid', () => {
    expect(
      matchesDatastream({
        assetId: MOCK_ASSET_ID,
        propertyId: MOCK_ALARM_INPUT_PROPERTY_ID,
      })({
        ...TEST_DATASTREAM_1,
        id: toId({
          assetId: 'does not exist',
          propertyId: MOCK_ALARM_INPUT_PROPERTY_ID,
        }),
      })
    ).toBeFalse();

    expect(
      matchesDatastream({
        assetId: MOCK_ASSET_ID,
        propertyId: MOCK_ALARM_INPUT_PROPERTY_ID,
      })({
        ...TEST_DATASTREAM_1,
        id: toId({
          propertyAlias: 'alias',
        }),
      })
    ).toBeFalse();
  });
});
