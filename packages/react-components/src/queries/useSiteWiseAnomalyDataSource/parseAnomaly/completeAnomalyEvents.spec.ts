import {
  DescribeAssetPropertyCommandOutput,
  PropertyDataType,
  PropertyNotificationState,
} from '@aws-sdk/client-iotsitewise';
import { completeAnomalyEvents } from './completeAnomalyEvents';
import { AnomalyEvent } from './types';

const anomalyEvent1: AnomalyEvent = {
  timestamp: 1715356810990,
  prediction: 0,
  prediction_reason: 'NO_ANOMALY_DETECTED',
  anomaly_score: 0.40514,
  diagnostics: [
    { name: '7c4edf2b-bb87-40f0-9e22-e85842102474', value: 0.12641 },
    { name: 'e01c5643-b63b-401d-aeae-82418776f999', value: 0.87359 },
  ],
};

const propertyDescription1: DescribeAssetPropertyCommandOutput = {
  assetId: 'f4a65db3-834c-4d77-89d0-d36db9110780',
  assetModelId: '5aba20c1-8806-4d95-adbf-f1cfcf98afd7',
  assetName: 'Hydroponic_Garden_1',
  assetProperty: {
    dataType: 'DOUBLE' as PropertyDataType,
    id: '7c4edf2b-bb87-40f0-9e22-e85842102474',
    name: 'water_temperature',
    notification: {
      state: 'DISABLED' as PropertyNotificationState,
      topic:
        '$aws/sitewise/asset-models/5aba20c1-8806-4d95-adbf-f1cfcf98afd7/assets/f4a65db3-834c-4d77-89d0-d36db9110780/properties/7c4edf2b-bb87-40f0-9e22-e85842102474',
    },
    path: [
      {
        id: 'f4a65db3-834c-4d77-89d0-d36db9110780',
        name: 'Hydroponic_Garden_1',
      },
      {
        id: '7c4edf2b-bb87-40f0-9e22-e85842102474',
        name: 'water_temperature',
      },
    ],
    type: {
      measurement: {},
    },
    unit: 'Fahrenheit',
  },
  $metadata: {},
};

const propertyDescription2: DescribeAssetPropertyCommandOutput = {
  assetId: 'f4a65db3-834c-4d77-89d0-d36db9110780',
  assetModelId: '5aba20c1-8806-4d95-adbf-f1cfcf98afd7',
  assetName: 'Hydroponic_Garden_1',
  assetProperty: {
    dataType: 'DOUBLE' as PropertyDataType,
    id: 'e01c5643-b63b-401d-aeae-82418776f999',
    name: 'ph',
    notification: {
      state: 'DISABLED' as PropertyNotificationState,
      topic:
        '$aws/sitewise/asset-models/5aba20c1-8806-4d95-adbf-f1cfcf98afd7/assets/f4a65db3-834c-4d77-89d0-d36db9110780/properties/e01c5643-b63b-401d-aeae-82418776f999',
    },
    path: [
      {
        id: 'f4a65db3-834c-4d77-89d0-d36db9110780',
        name: 'Hydroponic_Garden_1',
      },
      {
        id: 'e01c5643-b63b-401d-aeae-82418776f999',
        name: 'ph',
      },
    ],
    type: {
      measurement: {},
    },
  },
  $metadata: {},
};

describe('parseAnomalyEvents', () => {
  it('can parse anomaly json strings', () => {
    expect(
      completeAnomalyEvents(
        [anomalyEvent1],
        [propertyDescription1, propertyDescription2]
      )
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          timestamp: expect.toBeNumber(),
          prediction: expect.toBeNumber(),
          prediction_reason: expect.toBeString(),
          anomaly_score: expect.toBeNumber(),
          diagnostics: expect.arrayContaining([
            expect.objectContaining({
              name: propertyDescription1.assetProperty?.name,
              value: expect.toBeNumber(),
            }),
            expect.objectContaining({
              name: propertyDescription2.assetProperty?.name,
              value: expect.toBeNumber(),
            }),
          ]),
        }),
      ])
    );
  });
});
