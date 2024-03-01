import { useEffect, useState, useRef } from 'react';
import { combineProviders } from '@iot-app-kit/core';
import {
  SiteWiseAssetQuery,
  SiteWisePropertyAliasQuery,
} from '@iot-app-kit/source-iotsitewise';
import type {
  Viewport,
  DataStream,
  Threshold,
  TimeSeriesData,
  TimeSeriesDataRequest,
  TimeQuery,
  TimeSeriesDataRequestSettings,
  StyleSettingsMap,
} from '@iot-app-kit/core';
import { v4 as uuid } from 'uuid';
import { combineTimeSeriesData } from '../utils/combineTimeSeriesData';

import { useViewport } from '../useViewport';
import { ProviderStore } from './providerStore';
import { useDataStreamStyler } from '../useColoredDataStreams/useDataStreamColorer';
import isEqual from 'lodash.isequal';

const DEFAULT_SETTINGS: TimeSeriesDataRequestSettings = {
  resolution: '0',
  fetchFromStartToEnd: true,
};

const DEFAULT_VIEWPORT = { duration: '10m' };

const unsubscribeProvider = (id: string) => {
  // provider subscribe is asynchronous and will not be complete until the next frame stack, so we
  // defer the unsubscription to ensure that the subscription is always complete before unsubscribed.
  setTimeout(() => {
    const provider = ProviderStore.get(id);
    if (!provider) return;
    provider.unsubscribe();
    ProviderStore.remove(id);
  });
};

export const useTimeSeriesData = ({
  queries,
  viewport: passedInViewport,
  settings = DEFAULT_SETTINGS,
  styles,
}: {
  queries: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
  viewport?: Viewport;
  settings?: TimeSeriesDataRequestSettings;
  styles?: StyleSettingsMap;
}): { dataStreams: DataStream[]; thresholds: Threshold[] } => {
  const previousStyles = useRef(styles);
  const { styleDatastreams } = useDataStreamStyler(styles);

  const [dataStreams, setDataStreams] = useState<DataStream[]>([]);
  const [thresholds, setThresholds] = useState<Threshold[]>([]);

  // re-style query if the style settings have changed
  useEffect(() => {
    if (isEqual(previousStyles.current, styles)) return;
    previousStyles.current = styles;
    setDataStreams(styleDatastreams(dataStreams));
  }, [previousStyles, styles, styleDatastreams, setDataStreams, dataStreams]);

  const { viewport: injectedViewport } = useViewport();
  const viewport = passedInViewport || injectedViewport || DEFAULT_VIEWPORT;

  const prevViewportRef = useRef<undefined | Viewport>(undefined);
  const providerIdRef = useRef<undefined | string>(undefined);

  const scrubbedQueries = queries
    .map((query) => query.toQueryString())
    .map(
      (queryString) =>
        JSON.parse(queryString) as unknown as {
          source?: string;
          queryType?: string;
          query: Partial<SiteWiseAssetQuery & SiteWisePropertyAliasQuery>;
        }
    )
    .map(({ source, queryType, query }) => ({
      source,
      queryType,
      query: {
        assets: query.assets?.map(({ assetId, properties }) => ({
          assetId,
          properties: properties.map(
            ({ propertyId, aggregationType, resolution }) => ({
              propertyId,
              aggregationType,
              resolution,
            })
          ),
        })),
        properties: query.properties?.map(
          ({ propertyAlias, resolution, aggregationType }) => ({
            propertyAlias,
            aggregationType,
            resolution,
          })
        ),
      },
    }));

  const queriesString = JSON.stringify(scrubbedQueries);

  useEffect(() => {
    const id = uuid();
    providerIdRef.current = id;
    const provider = ProviderStore.set(
      id,
      combineProviders(
        queries.map((query) =>
          query.build(id, {
            viewport,
            settings,
          })
        )
      )
    );

    provider.subscribe({
      next: (timeSeriesDataCollection: TimeSeriesData[]) => {
        const {
          dataStreams: combinedDataStreams,
          thresholds: combinedThresholds,
        } = combineTimeSeriesData(timeSeriesDataCollection, viewport);

        previousStyles.current = styles;
        setDataStreams(styleDatastreams(combinedDataStreams));
        setThresholds(combinedThresholds);
      },
    });

    return () => {
      unsubscribeProvider(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queriesString, settings.refreshRate]);

  useEffect(() => {
    if (prevViewportRef.current != null) {
      const provider =
        providerIdRef.current && ProviderStore.get(providerIdRef.current);
      if (provider) {
        provider.updateViewport(viewport);
      }
    }
    prevViewportRef.current = viewport;
  }, [viewport]);

  return { dataStreams, thresholds };
};
