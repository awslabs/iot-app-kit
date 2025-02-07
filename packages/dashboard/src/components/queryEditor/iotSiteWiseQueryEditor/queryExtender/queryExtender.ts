import type {
  AlarmResource,
  AssetPropertyResource,
  TimeSeriesResource,
} from '@iot-app-kit/react-components';
import { type IoTSiteWiseDataStreamQuery } from '~/features/queries/queries';

type Query = IoTSiteWiseDataStreamQuery;

export class QueryExtender {
  readonly #currentQuery: Query;

  constructor(currentQuery: Query = {}) {
    this.#currentQuery = currentQuery;
  }

  public extendAlarmQueries(alarmDataStreams: readonly AlarmResource[]): Query {
    const currentAlarmQueries = this.#currentQuery.alarms ?? [];
    const newAlarmQueries = this.#createAlarmQueries(alarmDataStreams);
    const dedupedAlarmQueries = this.#dedupeAlarmQueries([
      ...currentAlarmQueries,
      ...newAlarmQueries,
    ]);

    return {
      ...this.#currentQuery,
      alarms: dedupedAlarmQueries,
    };
  }

  public extendAssetQueries(
    modeledDataStreams: readonly AssetPropertyResource[]
  ): Query {
    const currentAssetQueries = this.#currentQuery.assets ?? [];
    const newAssetQueries = this.#createAssetQueries(modeledDataStreams);
    const dedupedAssetQueries = this.#dedupeAssetQueries([
      ...currentAssetQueries,
      ...newAssetQueries,
    ]);

    return {
      ...this.#currentQuery,
      assets: dedupedAssetQueries,
    };
  }

  public extendPropertyAliasQueries(
    unmodeledDataStreams: readonly TimeSeriesResource[]
  ): Query {
    const currentPropertyAliasQueries = this.#currentQuery.properties ?? [];
    const newPropertyAliasQueries =
      this.#createPropertyAliasQueries(unmodeledDataStreams);
    const dedupedPropertyAliasQueries = this.#dedupePropertyAliasQueries([
      ...currentPropertyAliasQueries,
      ...newPropertyAliasQueries,
    ]);

    return {
      ...this.#currentQuery,
      properties: dedupedPropertyAliasQueries,
    };
  }

  #createAlarmQueries(
    alarmDataStreams: readonly AlarmResource[]
  ): NonNullable<Query['alarms']> {
    return alarmDataStreams.map<NonNullable<Query['alarms']>[number]>(
      ({ assetId, assetCompositeModelId }) => ({
        assetId,
        alarmComponents: [{ assetCompositeModelId }],
      })
    );
  }

  #dedupeAlarmQueries(alarmQueries: NonNullable<Query['alarms']>) {
    return alarmQueries.reduce<NonNullable<Query['alarms']>>(
      (acc, currentQuery) => {
        const existingQueryIndex = acc.findIndex(
          (alarmQuery) => alarmQuery.assetId === currentQuery.assetId
        );

        if (existingQueryIndex !== -1) {
          const existingAlarmsComponents = new Set(
            acc[existingQueryIndex].alarmComponents.map(
              (p) => p.assetCompositeModelId
            )
          );
          const newAlarmComponents = currentQuery.alarmComponents.filter(
            (p) => !existingAlarmsComponents.has(p.assetCompositeModelId)
          );

          acc[existingQueryIndex] = {
            ...acc[existingQueryIndex],
            alarmComponents: [
              ...acc[existingQueryIndex].alarmComponents,
              ...newAlarmComponents,
            ],
          };

          return acc;
        }

        return [...acc, currentQuery];
      },
      []
    );
  }

  #createAssetQueries(
    modeledDataStreams: readonly AssetPropertyResource[]
  ): NonNullable<Query['assets']> {
    return modeledDataStreams
      .filter(this.#isModeledDataStream)
      .map<NonNullable<Query['assets']>[number]>(
        ({ assetId, propertyId: propertyId }) => ({
          assetId,
          properties: [{ propertyId }],
        })
      );
  }

  #isModeledDataStream(
    dataStream: AssetPropertyResource | TimeSeriesResource
  ): dataStream is AssetPropertyResource {
    return (
      Object.hasOwn(dataStream, 'propertyId') &&
      Object.hasOwn(dataStream, 'assetId')
    );
  }

  #dedupeAssetQueries(assetQueries: NonNullable<Query['assets']>) {
    return assetQueries.reduce<NonNullable<Query['assets']>>(
      (acc, currentQuery) => {
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
            properties: [
              ...acc[existingQueryIndex].properties,
              ...newProperties,
            ],
          };

          return acc;
        }

        return [...acc, currentQuery];
      },
      []
    );
  }

  #createPropertyAliasQueries(
    unmodeledDataStreams: readonly TimeSeriesResource[]
  ) {
    return unmodeledDataStreams.map((unmodeledDataStream) => ({
      propertyAlias: unmodeledDataStream.alias ?? '',
    }));
  }

  #dedupePropertyAliasQueries(queries: NonNullable<Query['properties']>) {
    return queries.reduce<NonNullable<Query['properties']>>(
      (acc, currentQuery) => {
        const existingQuery = acc.find(
          (query) => query.propertyAlias === currentQuery.propertyAlias
        );

        if (existingQuery) {
          return acc;
        }

        return [...acc, currentQuery];
      },
      []
    );
  }
}
