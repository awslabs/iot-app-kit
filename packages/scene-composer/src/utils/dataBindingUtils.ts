import jexl from 'jexl';
import { isEqual, pick } from 'lodash';

import DebugLogger from '../logger/DebugLogger';
import { DataBindingLabelKeys } from '../common/constants';
import {
  DataFieldTimeType,
  IDataBindingTemplate,
  IDataField,
  IDataFrame,
  IDataInput,
  IValueDataBinding,
  IRuleBasedMap,
  IotTwinMakerNumberNamespace,
} from '../interfaces';

import { applyDataBindingTemplate } from './dataBindingTemplateUtils';

const LOG = new DebugLogger('dataBindingUtils');

/**
 * Try to match the dataLabels against the boundContext found on a data bound component.
 * Note that this is v1 implementation that specifically matches entityId and componentName
 * on the context. The implementation assumes both dataLabels and boundContext are objects
 * that contains the required keys.
 *
 * This works with the 1.0 specVersion scene documents.
 *
 * @param dataLabels - the labels from the dataInput to compare with
 * @param boundContext - the dataBinding context of the bound component
 * @returns true if the dataLabel matches boundContext
 */
export function containsMatchingEntityComponent(dataLabels: unknown | undefined, boundContext: unknown | undefined) {
  if (!dataLabels || !boundContext) {
    return false;
  }

  const relevantKeys = [DataBindingLabelKeys.entityId, DataBindingLabelKeys.componentName];
  const label = pick(dataLabels, relevantKeys);
  const boundTo = pick(boundContext, relevantKeys);

  return isEqual(label, boundTo);
}

const findStartIndex = (dataFrame: IDataFrame, timeCursor?: number): number => {
  const timeDataField = dataFrame.fields.find((dataField: IDataField) => dataField.valueType === DataFieldTimeType);
  if (!timeDataField || timeDataField.values.length < 0) {
    return -1;
  }

  const isDescOrder = timeDataField.values[0] > timeDataField.values[timeDataField.values.length - 1];
  if (!timeCursor) {
    return isDescOrder ? 0 : timeDataField.values.length - 1;
  }

  if (isDescOrder) {
    // Find index for timeCursor, if index is equal or greater than 0, (index-1) is the time; if index is less than 1, it's at the
    // end of the whole array.
    const index = timeDataField.values.findIndex((value) => value < timeCursor);
    return Math.max(0, index < 0 ? timeDataField.values.length - 1 : index - 1);
  } else {
    // Find index for timeCursor, if index is equal or greater than 0, index is the time; if index is less than 1, it's at the
    // end of the whole array.
    const index = timeDataField.values.findIndex((value) => value > timeCursor);
    return Math.max(0, index < 0 ? timeDataField.values.length - 1 : index);
  }
};

/**
 * Find the index for by either time cursor, or the latest time.
 * 1. If time data field is missing return empty data -- there is an issue in data source.
 * 2. If time cursor is not within the range of timeRange, return empty data.
 * 3. If time cursor is missing, get latest data (first index for DESC or last index for ASC).
 * 4. Return the value for the time cursor, if there is no exact match, choose the time right after time cursor;
 *    if time cursor is within the range of timeRange, but outside the range of timeDataField.values, choose the closest time from values array.
 */
export const dataBindingValuesProvider = (
  dataInput?: IDataInput,
  dataBinding?: IValueDataBinding,
  dataBindingTemplate?: IDataBindingTemplate,
): Record<string, any> => {
  if (!dataBinding || !dataInput || !dataBinding.dataBindingContext) {
    return {};
  } else if (
    dataInput.timeCursor &&
    (dataInput.timeCursor < dataInput.timeRange.from || dataInput.timeCursor > dataInput.timeRange.to)
  ) {
    return {};
  }

  const dataBindingContext = applyDataBindingTemplate(dataBinding, dataBindingTemplate);
  return Object.fromEntries(
    dataInput.dataFrames
      .flatMap((dataFrame) => {
        const fields = dataFrame.fields
          .filter((dataField) => containsMatchingEntityComponent(dataField.labels, dataBindingContext))
          .filter((dataField) => dataField.values.length > 0);

        if (fields.length === 0) {
          // Optimization: findStartIndex could be expensive for large array, won't do it if no fields match the labels.
          return [];
        } else {
          const startIndex = findStartIndex(dataFrame, dataInput.timeCursor);
          return startIndex < 0 ? [] : fields.map((dataField) => ({ startIndex, dataField }));
        }
      })
      .flatMap(({ startIndex, dataField }) => [
        [dataField.name, dataField.values[startIndex]],
        [dataField.name + '_raw', dataField.values],
      ]),
  );
};

/**
 * Currently, the jexl in TwinMaker can't handle "-", while the TwinMaker property can accept "-". This function will escape the special character
 */
const escapeRestrictedKeys = (value: Record<string, unknown>): [Record<string, string>, Record<string, unknown>] => {
  const restrictedCharRegex = /-/;
  const escapedKeyMap: Record<string, string> = {};
  const escapedValues: Record<string, unknown> = {};

  const valueKeys = Object.keys(value);
  for (let i = 0; i < valueKeys.length; ++i) {
    const key = valueKeys[i];
    const newKey = key.replace(restrictedCharRegex, '__');
    escapedValues[newKey] = value[key];

    if (newKey !== key) {
      escapedKeyMap[key] = newKey;
    }
  }

  return [escapedKeyMap, escapedValues];
};

// A rough implementation of expression based rule evaluation
// Returns a string that represent the output of the evaluation
export const ruleEvaluator = (defaultState: string | number, value: Record<string, any>, rule?: IRuleBasedMap) => {
  if (!rule) {
    LOG.verbose('No rule provided, evaluate as default state', defaultState);
    return defaultState;
  }

  if (Object.keys(value ?? {}).length === 0) {
    return defaultState;
  }

  const [escapedKeyMap, escapedValues] = escapeRestrictedKeys(value);

  for (let index = 0; index < rule.statements.length; index++) {
    try {
      const statement = rule.statements[index];

      let escapedExpression = statement.expression;
      Object.keys(escapedKeyMap).forEach((key) => {
        escapedExpression = escapedExpression.replace(key, escapedKeyMap[key]);
      });
      const evalResult = jexl.evalSync(escapedExpression, escapedValues);

      if (statement.target === IotTwinMakerNumberNamespace) {
        if (isFinite(Number(evalResult))) {
          return Number(evalResult);
        }
      } else if (evalResult) {
        return statement.target;
      }
    } catch (error) {
      // It might be a user mistake for one rule, but the next rule may work, we should continue
      LOG.error('Failed to evaluate rule', error as Error);
    }
  }

  return defaultState;
};
