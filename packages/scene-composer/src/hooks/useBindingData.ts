import { useEffect, useMemo, useState } from 'react';
import { DataBase, Primitive, Query, TimeSeriesData } from '@iot-app-kit/core';
import { isEmpty } from 'lodash';

import { useSceneComposerId } from '../common/sceneComposerIdContext';
import { COMPOSER_FEATURES, IValueDataBinding } from '../interfaces';
import { useStore, useViewOptionState } from '../store';
import useBindingQueries from './useBindingQueries';
import useLogger from '../logger/react-logger/hooks/useLogger';
import useFeature from './useFeature';
import { ITwinMakerEntityDataBindingContext } from '@iot-app-kit/source-iottwinmaker';

/**
 * Auto fetch data for data bindings when enabled.
 *
 * @param bindings the data bindings to fetch data
 * @returns `data` as an array of values for each data binding in the same order.
 *          If the query object cannot be created for any of the bindings,
 *          undefined will be returned in the result array at the same index.
 */
const useBindingData = (
  bindings: IValueDataBinding[] | undefined
):
{ data: (Record<string, Primitive> | undefined)[] | undefined } => {
  const log = useLogger('useBindingData');
  const sceneComposerId = useSceneComposerId();

  const queries = useBindingQueries(bindings).queries;
  const viewport = useViewOptionState(sceneComposerId).viewport;
  const autoQueryEnabled = useViewOptionState(sceneComposerId).autoQueryEnabled;
  // const timeSeriesData = useTimeSeriesData({ queries: queries ?? []})

  const [ data, setData ] = useState< (Record<string, Primitive> | undefined)[] | undefined>(undefined)

  useEffect(() => {
    console.log('xxx viewpo', autoQueryEnabled, viewport, bindings)
    if (!autoQueryEnabled || !viewport || !queries || !bindings) {
      return;
    }

    const providers = queries.map((query, index) => {
      if (query) {
        const provider = query.build(sceneComposerId, {
          viewport: viewport,
          settings: {
            // only support default settings for now until when customization is needed
            fetchFromStartToEnd: true, // TODO: fix type error
          },
        })

        console.log('xxx subscribe')
        provider.subscribe({
          next: (results: DataBase[]) => {
            if (isEmpty(results) || isEmpty(results[0].dataStreams)) {
              log?.info('No data returned')
              return;
            }

            if (results.length > 1 || results[0].dataStreams.length > 1) {
              log?.warn('Multiple data returned, only use the first one')
            }

            const newData = [...data ?? []];
            newData[index] = { [(bindings[index]?.dataBindingContext as ITwinMakerEntityDataBindingContext)?.propertyName]: results[0].dataStreams[0].data[results[0].dataStreams[0].data.length - 1]?.y}
            setData(newData);
            },
        })
        return provider;
      }
      return undefined
    })

    return () => {
      providers?.forEach((provider) => provider?.unsubscribe())
    }
  }, [queries, autoQueryEnabled, viewport]);

  return { data };
};

export default useBindingData;
