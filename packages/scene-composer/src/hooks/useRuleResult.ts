import { useMemo } from 'react';

import { IValueDataBinding } from '../interfaces';
import { useSceneDocument, useDataStore } from '../store';
import { useSceneComposerId } from '../common/sceneComposerIdContext';
import { dataBindingValuesProvider, ruleEvaluator } from '../utils/dataBindingUtils';

const useRuleResult = (ruleMapId: string, dataBinding: IValueDataBinding) => {
  const sceneComposerId = useSceneComposerId();
  const { getSceneRuleMapById } = useSceneDocument(sceneComposerId);
  const { dataBindingTemplate, dataInput } = useDataStore(sceneComposerId);
  const rule = getSceneRuleMapById(ruleMapId);

  const ruleResult = useMemo(() => {
    const values: Record<string, any> = dataBindingValuesProvider(dataInput, dataBinding, dataBindingTemplate);
    return ruleEvaluator('', values, rule);
  }, [rule, dataInput, dataBinding]);

  return ruleResult;
};

export default useRuleResult;
