import type { TimeSeriesDataQuery } from '@iot-app-kit/core';
import type {
  AlarmDataQuery,
  AssetQuery,
  PropertyAliasQuery,
  SiteWiseDataStreamQuery,
} from '@iot-app-kit/source-iotsitewise';
import { ComponentQuery } from '../../common/chartTypes';

export const convertToSupportedTimeRange = (start: Date, end: Date) => {
  let startISO = start.toISOString();
  startISO = `${startISO.substring(0, startISO.indexOf('.'))}Z`;

  let endISO = end.toISOString();
  endISO = `${endISO.substring(0, endISO.indexOf('.'))}Z`;
  return {
    start: startISO,
    end: endISO,
  };
};

export type ParsedTimeSeriesDataQuery = {
  source: string;
  queryType: string;
  query: SiteWiseDataStreamQuery;
};

export type AssistantSupportedTimeSeriesQuery = {
  source: string;
  queryType: string;
  aggregationType?: string;
  properties: Array<{
    assetId?: string;
    propertyId?: string;
    propertyAlias?: string;
  }>;
};

export type AssistantSupportedAlarmQuery = {
  source: string;
  queryType: string;
  alarms: Array<{
    assetId: string;
    assetCompositeModelId: string;
    alarmName?: string;
  }>;
};
export type AssistantSupportedQuery =
  | AssistantSupportedTimeSeriesQuery
  | AssistantSupportedAlarmQuery;
export type ParseComponentQuery = ParsedTimeSeriesDataQuery | AlarmDataQuery;

export const isTimeSeriesDataQuery = (
  query: ComponentQuery
): query is TimeSeriesDataQuery =>
  (query as TimeSeriesDataQuery).build !== undefined;
export const isAlarmDataQuery = (
  query: ComponentQuery
): query is AlarmDataQuery =>
  (query as AlarmDataQuery).query.alarms !== undefined;

export const serializeTimeSeriesQuery = (query: TimeSeriesDataQuery) => {
  try {
    return JSON.parse(
      query.toQueryString()
    ) satisfies ParsedTimeSeriesDataQuery;
  } catch (error: unknown) {
    return undefined;
  }
};

export const transformQueriesForContext = (
  queries: Array<ParsedTimeSeriesDataQuery>
) => {
  return queries.map((componentQuery) => {
    return transformTimeSeriesDataQueryForContext(componentQuery);
  });
};

const transformTimeSeriesDataQueryForContext = (
  query: ParsedTimeSeriesDataQuery
) => {
  if (typeof query === 'undefined') return query;

  const parsedQuery: AssistantSupportedTimeSeriesQuery = {
    source: query.source,
    queryType: query.queryType,
    aggregationType: '',
    properties: [],
  };

  const assets = (query.query?.assets ?? []) satisfies AssetQuery[];
  assets.forEach((asset: AssetQuery) => {
    asset.properties.forEach((property) => {
      if (!parsedQuery.aggregationType) {
        parsedQuery.aggregationType = property.aggregationType ?? '';
      }
      parsedQuery.properties.push({
        assetId: asset.assetId,
        propertyId: property.propertyId,
      });
    });
  });

  const propertiesAlias = (query.query?.properties ??
    []) satisfies PropertyAliasQuery[];
  propertiesAlias.forEach((property: PropertyAliasQuery) => {
    if (!parsedQuery.aggregationType) {
      parsedQuery.aggregationType = property.aggregationType ?? '';
    }
    parsedQuery.properties.push({
      propertyAlias: property.propertyAlias,
    });
  });

  return parsedQuery;
};

export const getSelectedQueriesAndProperties = (
  queries: TimeSeriesDataQuery[],
  selectedIds: string[]
) => {
  const filteredQueries: Array<ParsedTimeSeriesDataQuery> = [];

  queries.forEach((componentQuery) => {
    if (isTimeSeriesDataQuery(componentQuery)) {
      const timeSeriesQuery = serializeTimeSeriesQuery(
        componentQuery
      ) as ParsedTimeSeriesDataQuery;

      timeSeriesQuery.query?.assets?.forEach((asset) => {
        asset.properties?.forEach((prop) => {
          const refIdMatches = selectedIds.includes(prop.refId ?? '');
          if (refIdMatches) {
            const query = {
              assets: [
                {
                  ...asset,
                  properties: [prop],
                },
              ],
            };
            filteredQueries.push({
              ...timeSeriesQuery,
              query,
            } as ParsedTimeSeriesDataQuery);
          }
        });
      });

      const propertiesAlias = (timeSeriesQuery.query?.properties ??
        []) satisfies PropertyAliasQuery[];
      propertiesAlias.forEach((property: PropertyAliasQuery) => {
        const refIdMatches = selectedIds.includes(property.refId ?? '');
        const propertyAliasdMatches = selectedIds.includes(
          property.propertyAlias
        );
        if (refIdMatches || propertyAliasdMatches) {
          const query = {
            properties: [
              {
                ...property,
              },
            ],
          };
          filteredQueries.push({
            ...timeSeriesQuery,
            query,
          } as ParsedTimeSeriesDataQuery);
        }
      });
    }
  });

  return filteredQueries;
};
