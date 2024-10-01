import type { TimeSeriesDataQuery } from '@iot-app-kit/core';
import type {
  AssetQuery,
  PropertyAliasQuery,
  SiteWiseDataStreamQuery,
} from '@iot-app-kit/source-iotsitewise';

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

export type AssistantSupportedQuery = {
  source: string;
  queryType: string;
  aggregationType: string;
  properties: Array<{
    assetId?: string;
    propertyId?: string;
    propertyAlias?: string;
  }>;
};

export const serializeTimeSeriesQuery = (query: TimeSeriesDataQuery) => {
  try {
    return JSON.parse(
      query.toQueryString()
    ) satisfies ParsedTimeSeriesDataQuery;
  } catch (error: unknown) {
    return undefined;
  }
};

export const transformQueriesForContext = (queries: TimeSeriesDataQuery[]) => {
  return queries.map((query) => {
    const queryObject: ParsedTimeSeriesDataQuery =
      serializeTimeSeriesQuery(query);
    if (typeof queryObject === 'undefined') return queryObject;

    const parsedQuery: AssistantSupportedQuery = {
      source: queryObject.source,
      queryType: queryObject.queryType,
      aggregationType: '',
      properties: [],
    };

    const assets = (queryObject.query?.assets ?? []) satisfies AssetQuery[];
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

    const propertiesAlias = (queryObject.query?.properties ??
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
  });
};
