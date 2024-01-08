import type { ModeledDataStream } from '../modeledDataStreamQueryEditor/modeledDataStreamExplorer/types';
import type { UnmodeledDataStream } from '../unmodeledDataStreamExplorer/types';
import type { IoTSiteWiseDataStreamQuery } from '~/types';

type Query = IoTSiteWiseDataStreamQuery;

export class QueryExtender {
  readonly #currentQuery: Query;

  constructor(currentQuery: Query = {}) {
    this.#currentQuery = currentQuery;
  }

  public extendAssetQueries(modeledDataStreams: ModeledDataStream[]): Query {
    const currentAssetQueries = this.#currentQuery.assets ?? [];
    const newAssetQueries = this.#createAssetQueries(modeledDataStreams);
    const dedupedAssetQueries = this.#dedupeAssetQueries([
      ...currentAssetQueries,
      ...newAssetQueries,
    ]);
    const extendedQuery = {
      ...this.#currentQuery,
      assets: dedupedAssetQueries,
    };

    return extendedQuery;
  }

  #createAssetQueries(
    modeledDataStreams: ModeledDataStream[]
  ): NonNullable<Query['assets']> {
    const assetQueriesWithProperties = modeledDataStreams
      .filter(this.#isModeledDataStream)
      .map<NonNullable<Query['assets']>[number]>(
        ({ assetId, propertyId: propertyId }) => ({
          assetId,
          properties: [{ propertyId }],
        })
      );

    return assetQueriesWithProperties;
  }

  #isModeledDataStream(
    dataStream: ModeledDataStream | UnmodeledDataStream
  ): dataStream is ModeledDataStream {
    return (
      Object.hasOwn(dataStream, 'propertyId') &&
      Object.hasOwn(dataStream, 'assetId')
    );
  }

  #dedupeAssetQueries(assetQueries: NonNullable<Query['assets']>) {
    const dedupedAssetQueries = assetQueries.reduce<
      NonNullable<Query['assets']>
    >((acc, currentQuery) => {
      const existingQueryIndex = acc.findIndex(
        (assetQuery) => assetQuery.assetId === currentQuery.assetId
      );

      if (existingQueryIndex !== -1) {
        const existingProperties = new Set(
          acc[existingQueryIndex].properties.map((p) => p.propertyId)
        );
        const newProperties = currentQuery.properties.filter(
          (p) => !existingProperties.has(p.propertyId)
        );

        acc[existingQueryIndex] = {
          ...acc[existingQueryIndex],
          properties: [...acc[existingQueryIndex].properties, ...newProperties],
        };

        return acc;
      }

      return [...acc, currentQuery];
    }, []);

    return dedupedAssetQueries;
  }

  public extendPropertyAliasQueries(
    unmodeledDataStreams: UnmodeledDataStream[]
  ): Query {
    const currentPropertyAliasQueries = this.#currentQuery.properties ?? [];
    const newPropertyAliasQueries =
      this.#createPropertyAliasQueries(unmodeledDataStreams);
    const dedupedPropertyAliasQueries = this.#dedupePropertyAliasQueries([
      ...currentPropertyAliasQueries,
      ...newPropertyAliasQueries,
    ]);
    const extendedQuery = {
      ...this.#currentQuery,
      properties: dedupedPropertyAliasQueries,
    };

    return extendedQuery;
  }

  #createPropertyAliasQueries(unmodeledDataStreams: UnmodeledDataStream[]) {
    const propertyAliasQueries = unmodeledDataStreams.map(
      (unmodeledDataStream) => ({
        propertyAlias: unmodeledDataStream.propertyAlias ?? '',
      })
    );

    return propertyAliasQueries;
  }

  #dedupePropertyAliasQueries(queries: NonNullable<Query['properties']>) {
    const propertyAliasQueries = queries.reduce<
      NonNullable<Query['properties']>
    >((acc, currentQuery) => {
      const existingQuery = acc.find(
        (query) => query.propertyAlias === currentQuery.propertyAlias
      );

      if (existingQuery) {
        return acc;
      }

      return [...acc, currentQuery];
    }, []);

    return propertyAliasQueries;
  }
}
