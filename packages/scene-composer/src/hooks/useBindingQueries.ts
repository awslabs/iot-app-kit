import { useMemo } from 'react';
import { Query, TimeSeriesData } from '@iot-app-kit/core';
import { isEmpty } from 'lodash';

import { useSceneComposerId } from '../common/sceneComposerIdContext';
import { IValueDataBinding } from '../interfaces';
import { useStore } from '../store';

/**
 * Create query objects for data bindings.
 *
 * @param bindings the data bindings to create query object
 * @returns `queries` as an array of query objects for each data binding in the same order.
 *          If the query object cannot be created for any of the bindings,
 *          undefined will be returned in the result array at the same index.
 */
const useBindingQueries = (
  bindings: IValueDataBinding[],
): // TODO: add data type for static data when available
{ queries: (Query<TimeSeriesData[]> | undefined)[] | undefined } => {
  const sceneComposerId = useSceneComposerId();
  const valueDataBindingProvider = useStore(sceneComposerId)(
    (state) => state.getEditorConfig().valueDataBindingProvider,
  );

  const queries = useMemo(() => {
    if (isEmpty(bindings) || !valueDataBindingProvider) {
      return undefined;
    }

    return bindings.map((binding: IValueDataBinding) => valueDataBindingProvider.createQuery(binding));
  }, [bindings]);

  return { queries };
};

export default useBindingQueries;
