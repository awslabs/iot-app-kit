import {
  mockDefaultAlarmState,
  mockDefaultAlarmStateRuleEvaluation,
  mockDoubleAssetPropertyValue,
  mockStringAssetPropertyValue,
} from '../../../testing/alarms';
import {
  isAlarmState,
  parseAlarmStateAssetProperty,
} from './parseAlarmStateProperty';

const date = new Date(0);

describe('isAlarmState', () => {
  it('returns false if the state is undefined or empty or not a real alarm state', () => {
    expect(isAlarmState('')).toBeFalse();
    expect(isAlarmState()).toBeFalse();
    expect(isAlarmState('Does not exist')).toBeFalse();
    expect(isAlarmState('ACTIVE')).toBeFalse();
  });
  it('returns true if the state is a real alarm status', () => {
    expect(isAlarmState('Active')).toBeTrue();
    expect(isAlarmState('Normal')).toBeTrue();
    expect(isAlarmState('Latched')).toBeTrue();
    expect(isAlarmState('Disabled')).toBeTrue();
    expect(isAlarmState('Acknowledged')).toBeTrue();
    expect(isAlarmState('SnoozeDisabled')).toBeTrue();
  });
});

describe('parseAlarmStateAssetProperty', () => {
  it('can parse an assetPropertyValue', () => {
    expect(
      parseAlarmStateAssetProperty(
        mockStringAssetPropertyValue(mockDefaultAlarmState, date)
      )
    ).toMatchObject({
      timestamp: 0,
      value: {
        state: 'Normal',
        ruleEvaluation: mockDefaultAlarmStateRuleEvaluation,
      },
    });
  });

  it('returns undefined if the assetPropertyValue is not a stringValue', () => {
    expect(
      parseAlarmStateAssetProperty(mockDoubleAssetPropertyValue(2, date))
    ).toBeUndefined();

    expect(parseAlarmStateAssetProperty()).toBeUndefined();
  });

  it('can parse an uppercase state names', () => {
    expect(
      parseAlarmStateAssetProperty(
        mockStringAssetPropertyValue(mockDefaultAlarmState, date)
      )
    ).toMatchObject({
      timestamp: 0,
      value: {
        state: 'Normal',
        ruleEvaluation: mockDefaultAlarmStateRuleEvaluation,
      },
    });
  });

  it('can parse an camel case state names', () => {
    expect(
      parseAlarmStateAssetProperty(
        mockStringAssetPropertyValue(
          JSON.stringify({
            stateName: 'Normal',
            ruleEvaluation: mockDefaultAlarmStateRuleEvaluation,
          }),
          date
        )
      )
    ).toMatchObject({
      timestamp: 0,
      value: {
        state: 'Normal',
        ruleEvaluation: mockDefaultAlarmStateRuleEvaluation,
      },
    });
  });

  it('can parse rule evaluations', () => {
    expect(
      parseAlarmStateAssetProperty(
        mockStringAssetPropertyValue(mockDefaultAlarmState, date)
      )
    ).toMatchObject({
      timestamp: 0,
      value: {
        state: 'Normal',
        ruleEvaluation: mockDefaultAlarmStateRuleEvaluation,
      },
    });

    expect(
      parseAlarmStateAssetProperty(
        mockStringAssetPropertyValue(
          JSON.stringify({
            stateName: 'Normal',
          }),
          date
        )
      )
    ).toMatchObject({
      timestamp: 0,
      value: {
        state: 'Normal',
        ruleEvaluation: undefined,
      },
    });
  });

  it('throws an error if parsing fails', () => {
    expect(() =>
      parseAlarmStateAssetProperty(mockStringAssetPropertyValue('', date))
    ).toThrowError();
  });
});
