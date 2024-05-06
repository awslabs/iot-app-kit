import { useMemo } from 'react';
import { DataBase, DataRequest, Query, TimeSeriesData } from '@iot-app-kit/core';
import { isEmpty } from 'lodash';

import { useSceneComposerId } from '../common/sceneComposerIdContext';
import { IValueDataBinding } from '../interfaces';
import { accessStore } from '../store';
import { applyDataBindingTemplate } from '../utils/dataBindingTemplateUtils';

/**
 * Create query objects for data bindings.
 *
 * @param bindings the data bindings to create query object
 * @returns `queries` as an array of query objects for each data binding in the same order.
 *          If the query object cannot be created for any of the bindings,
 *          undefined will be returned in the result array at the same index.
 */
const useBindingQueries = (
  bindings: IValueDataBinding[] | undefined,
): { queries: (Query<TimeSeriesData[] | DataBase[], DataRequest> | undefined)[] | undefined } => {
  const sceneComposerId = useSceneComposerId();
  const valueDataBindingProvider = accessStore(sceneComposerId)(
    (state) => state.getEditorConfig().valueDataBindingProvider,
  );
  const dataBindingTemplate = accessStore(sceneComposerId)((state) => state.dataBindingTemplate);

  const queries = useMemo(() => {
    if (isEmpty(bindings) || !valueDataBindingProvider) {
      return undefined;
    }

    return bindings?.map((binding: IValueDataBinding) => {
      const bindingWithTemplate = {
        ...binding,
        dataBindingContext: applyDataBindingTemplate(binding, dataBindingTemplate),
      };
      return valueDataBindingProvider.createQuery(bindingWithTemplate);
    });
  }, [bindings, dataBindingTemplate]);

  return { queries };
};

export default useBindingQueries;
