import { RAW_DATA_RECENCY_THRESHOLD, withinLatestPropertyDataThreshold } from './withinLatestPropertyDataThreshold';

describe('withinLatestPropertyDataThreshold', () => {
  test('returns true if the date is within the threshold', () => {
    const date = new Date();

    expect(withinLatestPropertyDataThreshold(date)).toBeTruthy();
  });

  test('returns false if the date is out of the threshold', () => {
    const date = new Date();
    date.setSeconds(date.getSeconds() + RAW_DATA_RECENCY_THRESHOLD);

    expect(withinLatestPropertyDataThreshold(date)).toBeTruthy();
  });
});
