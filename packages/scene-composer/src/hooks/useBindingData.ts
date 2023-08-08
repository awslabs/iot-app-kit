import { useEffect, useMemo, useRef, useState } from 'react';
import { TimeSeriesData, Primitive } from '@iot-app-kit/core';
import { isEmpty } from 'lodash';
import { ITwinMakerEntityDataBindingContext } from '@iot-app-kit/source-iottwinmaker';

import { useSceneComposerId } from '../common/sceneComposerIdContext';
import { IValueDataBinding } from '../interfaces';
import { useViewOptionState } from '../store';
import useLogger from '../logger/react-logger/hooks/useLogger';

import useBindingQueries from './useBindingQueries';

/**
 * Auto fetch data for data bindings when enabled.
 *
 * @param bindings the data bindings to fetch data
 * @returns `data` as an array of values for each data binding in the same order.
 *          If the query object cannot be created for any of the bindings,
 *          undefined will be returned in the result array at the same index.
 */
const useBindingData = (
  bindings: IValueDataBinding[] | undefined,
): { data: (Record<string, Primitive> | undefined)[] | undefined } => {
  const log = useLogger('useBindingData');
  const sceneComposerId = useSceneComposerId();

  const queries = useBindingQueries(bindings).queries;
  const viewport = useViewOptionState(sceneComposerId).viewport;
  const autoQueryEnabled = useViewOptionState(sceneComposerId).autoQueryEnabled;

  const data = useRef<(Record<string, Primitive> | undefined)[] | undefined>(undefined);
  // A state that will be updated when new data is received, so a new result can be generated and returned.
  const [lastDataTime, setLastDataTime] = useState<number>(Date.now());

  useEffect(() => {
    if (!autoQueryEnabled || !viewport || !queries || !bindings) {
      return;
    }

    const providers = queries.map((query, index) => {
      if (query) {
        const provider = query.build(sceneComposerId, {
          viewport: viewport,
          settings: {
            // only support default settings for now until when customization is needed
            fetchFromStartToEnd: true,
          },
        });

        provider.subscribe({
          // TODO: support static data
          next: (results: TimeSeriesData[]) => {
            if (isEmpty(results.at(0)?.dataStreams)) {
              log?.info('No data returned');
              return;
            }

            if (results.length > 1 || results[0].dataStreams.length > 1) {
              log?.warn('Multiple data returned, only use the first one');
            }

            const newData = [...(data.current ?? [])];
            newData[index] = {
              [(bindings[index]?.dataBindingContext as ITwinMakerEntityDataBindingContext)?.propertyName]:
                results[0].dataStreams[0].data[results[0].dataStreams[0].data.length - 1]?.y,
            };
            data.current = newData;
            setLastDataTime(Date.now());
          },
        });
        return provider;
      }
      return undefined;
    });

    return () => {
      providers?.forEach((provider) => provider?.unsubscribe());
    };
  }, [queries, autoQueryEnabled, viewport]);

  const result = useMemo(() => {
    return { data: data.current };
  }, [data.current, lastDataTime]);

  return result;
};

export default useBindingData;
