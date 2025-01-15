import { type Primitive } from '@iot-app-kit/core';
import { useMemo } from 'react';

import { useSceneComposerId } from '../common/sceneComposerIdContext';
import { type IValueDataBinding } from '../interfaces';
import { useDataStore, useSceneDocument } from '../store';
import { type RuleReturnResult, dataBindingValuesProvider, ruleEvaluator } from '../utils/dataBindingUtils';

import useBindingData from './useBindingData';

const useRuleResult = ({
  ruleMapId,
  dataBinding,
  defaultValue,
}: {
  ruleMapId?: string;
  dataBinding?: IValueDataBinding;
  defaultValue?: string;
}): RuleReturnResult => {
  const sceneComposerId = useSceneComposerId();
  const { getSceneRuleMapById } = useSceneDocument(sceneComposerId);
  const { dataBindingTemplate, dataInput } = useDataStore(sceneComposerId);
  const rule = getSceneRuleMapById(ruleMapId);
  const bindings = useMemo(() => (dataBinding ? [dataBinding] : undefined), [dataBinding]);
  const bindingData = useBindingData(bindings).data?.at(0);

  const ruleResult = useMemo(() => {
    const values: Record<string, Primitive> =
      bindingData ?? dataBindingValuesProvider(dataInput, dataBinding, dataBindingTemplate);
    return ruleEvaluator(defaultValue || '', values, rule);
  }, [rule, dataInput, dataBinding, bindingData, dataBindingTemplate, defaultValue]);
  return ruleResult;
};

export default useRuleResult;
