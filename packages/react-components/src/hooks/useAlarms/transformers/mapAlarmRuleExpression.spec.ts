import {
  MOCK_ALARM_INPUT_PROPERTY_NAME,
  mockAlarmDataDescribeAlarmModel,
  mockAlarmDataDescribeAsset,
  mockAlarmDataWithInputProperty,
} from '../../../testing/alarms';
import {
  getCoreComparisonOperator,
  mapAlarmRuleExpression,
} from './mapAlarmRuleExpression';

describe('mapAlarmRuleExpression', () => {
  it('returns undefined if there are no input properties, thresholds, or models', () => {
    expect(mapAlarmRuleExpression(mockAlarmDataDescribeAsset)).toBeUndefined();
    expect(
      mapAlarmRuleExpression(mockAlarmDataDescribeAlarmModel)
    ).toBeUndefined();
    expect(
      mapAlarmRuleExpression(mockAlarmDataWithInputProperty)
    ).toBeUndefined();
  });

  it('returns a rule expression string', () => {
    expect(
      mapAlarmRuleExpression({
        ...mockAlarmDataWithInputProperty,
        thresholds: [
          {
            value: {
              doubleValue: 1,
            },
            timestamp: {
              timeInSeconds: 0,
            },
          },
        ],
      })
    ).toBe(`${MOCK_ALARM_INPUT_PROPERTY_NAME} > 1`);
  });

  it('can get the comparison operator', () => {
    expect(getCoreComparisonOperator('EQUAL')).toBe('EQ');
    expect(getCoreComparisonOperator('LESS')).toBe('LT');
    expect(getCoreComparisonOperator('LESS_OR_EQUAL')).toBe('LTE');
    expect(getCoreComparisonOperator('GREATER')).toBe('GT');
    expect(getCoreComparisonOperator('GREATER_OR_EQUAL')).toBe('GTE');
    expect(getCoreComparisonOperator('Doesnt exist')).toBeUndefined();
  });
});
