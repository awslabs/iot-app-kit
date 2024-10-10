import {
  mockDefaultAlarmState,
  mockDefaultAlarmStateRuleEvaluation,
  mockDoubleAssetPropertyValue,
  mockStringAssetPropertyValue,
} from '../../../testing/alarms';
import { parseAlarmStateAssetProperty } from './parseAlarmStateProperty';

const date = new Date(0);

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
});
