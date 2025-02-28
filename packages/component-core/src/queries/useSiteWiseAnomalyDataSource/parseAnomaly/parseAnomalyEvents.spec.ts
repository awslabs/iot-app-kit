import { type AssetPropertyValue } from '@aws-sdk/client-iotsitewise';
import { parseAnomalyEvents } from './parseAnomalyEvents';

const assetPropertyValue1: AssetPropertyValue = {
  quality: 'GOOD',
  timestamp: {
    offsetInNanos: 0,
    timeInSeconds: 1714674670,
  },
  value: {
    stringValue:
      '{"timestamp":"2024-05-02T18:31:10.000000","prediction":0,"prediction_reason":"NO_ANOMALY_DETECTED","anomaly_score":0.40514,"diagnostics":[{"name":"7c4edf2b-bb87-40f0-9e22-e85842102474\\\\7c4edf2b-bb87-40f0-9e22-e85842102474","value":0.12641},{"name":"e01c5643-b63b-401d-aeae-82418776f999\\\\e01c5643-b63b-401d-aeae-82418776f999","value":0.17027},{"name":"3dda8a18-a652-4996-9c83-7ef1098700bf\\\\3dda8a18-a652-4996-9c83-7ef1098700bf","value":0.13433},{"name":"494a9244-80f9-4d8e-9690-ea4ab2292313\\\\494a9244-80f9-4d8e-9690-ea4ab2292313","value":0.09813},{"name":"cb9b9d83-0e61-40cc-bf64-07daf58effd3\\\\cb9b9d83-0e61-40cc-bf64-07daf58effd3","value":0.15898},{"name":"653f7ac6-cb4b-4cce-b7c7-cfed74f3d6f3\\\\653f7ac6-cb4b-4cce-b7c7-cfed74f3d6f3","value":0.14222},{"name":"e91cf843-20b9-4dac-92e3-d4ea365bd12e\\\\e91cf843-20b9-4dac-92e3-d4ea365bd12e","value":0.16965}]}',
  },
};

const assetPropertyValue2: AssetPropertyValue = {
  quality: 'GOOD',
  timestamp: {
    offsetInNanos: 0,
    timeInSeconds: 1714674671,
  },
  value: {
    stringValue:
      '{"timestamp":"2024-05-02T18:31:11.000000","prediction":0,"prediction_reason":"NO_ANOMALY_DETECTED","anomaly_score":0.40514,"diagnostics":[{"name":"7c4edf2b-bb87-40f0-9e22-e85842102474\\\\7c4edf2b-bb87-40f0-9e22-e85842102474","value":0.12641},{"name":"e01c5643-b63b-401d-aeae-82418776f999\\\\e01c5643-b63b-401d-aeae-82418776f999","value":0.17027},{"name":"3dda8a18-a652-4996-9c83-7ef1098700bf\\\\3dda8a18-a652-4996-9c83-7ef1098700bf","value":0.13433},{"name":"494a9244-80f9-4d8e-9690-ea4ab2292313\\\\494a9244-80f9-4d8e-9690-ea4ab2292313","value":0.09813},{"name":"cb9b9d83-0e61-40cc-bf64-07daf58effd3\\\\cb9b9d83-0e61-40cc-bf64-07daf58effd3","value":0.15898},{"name":"653f7ac6-cb4b-4cce-b7c7-cfed74f3d6f3\\\\653f7ac6-cb4b-4cce-b7c7-cfed74f3d6f3","value":0.14222},{"name":"e91cf843-20b9-4dac-92e3-d4ea365bd12e\\\\e91cf843-20b9-4dac-92e3-d4ea365bd12e","value":0.16965}]}',
  },
};

describe('parseAnomalyEvents', () => {
  it('can parse anomaly json strings', () => {
    expect(
      parseAnomalyEvents([assetPropertyValue1, assetPropertyValue2])
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          timestamp: expect.toBeNumber(),
          prediction: expect.toBeNumber(),
          prediction_reason: expect.toBeString(),
          anomaly_score: expect.toBeNumber(),
          diagnostics: expect.arrayContaining([
            expect.objectContaining({
              name: expect.toBeString(),
              value: expect.toBeNumber(),
            }),
          ]),
        }),
      ])
    );
  });
});
