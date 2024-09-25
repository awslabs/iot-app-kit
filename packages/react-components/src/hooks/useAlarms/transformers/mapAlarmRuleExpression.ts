import { ComparisonOperator } from '@aws-sdk/client-iot-events';
import { AlarmData } from '../types';

type RuleExpression<
  InputPropertyName extends string = string,
  Operator extends string = string,
  ThresholdValue extends number = number
> = `${InputPropertyName} ${Operator} ${ThresholdValue}`;

const COMPARISON_SYMBOL = {
  [ComparisonOperator.EQUAL]: '=',
  [ComparisonOperator.LESS]: '<',
  [ComparisonOperator.LESS_OR_EQUAL]: '<=',
  [ComparisonOperator.GREATER]: '>',
  [ComparisonOperator.GREATER_OR_EQUAL]: '>=',
  [ComparisonOperator.NOT_EQUAL]: '!=',
};

const getComparisonSymbol = (operator?: string) => {
  if (!operator) return undefined;

  const operatorSymbol = COMPARISON_SYMBOL[operator as ComparisonOperator];

  if (operatorSymbol == null) return undefined;

  return operatorSymbol;
};

export const mapAlarmRuleExpression = ({
  inputProperty,
  thresholds,
  models,
}: AlarmData): RuleExpression | undefined => {
  const inputPropertyName = inputProperty?.at(0)?.property.name;
  const threshold = thresholds?.at(-1)?.value?.doubleValue;
  const operator = getComparisonSymbol(
    models?.at(-1)?.alarmRule?.simpleRule?.comparisonOperator
  );

  if (inputPropertyName != null && operator != null && threshold != null) {
    return `${inputPropertyName} ${operator} ${threshold}`;
  }

  return undefined;
};
