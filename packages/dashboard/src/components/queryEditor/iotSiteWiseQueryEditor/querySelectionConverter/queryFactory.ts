import { ModeledDataStream } from '../modeledDataStreamQueryEditor/modeledDataStreamExplorer/types';
import { UnmodeledDataStream } from '../unmodeledDataStreamExplorer/types';
import type { QueryWidget } from '~/customization/widgets/types';

type Query = NonNullable<QueryWidget['properties']['queryConfig']['query']>;

export const queryFactory = {
  create(selection: { modeledDataStreams: ModeledDataStream[]; unmodeledDataStreams: UnmodeledDataStream[] }): Query {
    const assetQueries = createAssetQueries(selection.modeledDataStreams);
    const propertyAliasQueries = createPropertyAliasQueries(selection.unmodeledDataStreams);

    return {
      assets: assetQueries,
      properties: propertyAliasQueries,
    };
  },
};

function createAssetQueries(modeledDataStreams: ModeledDataStream[]) {
  const assetQueriesWithProperties = modeledDataStreams
    .filter(isModeledDataStream)
    .map<NonNullable<Query['assets']>[number]>(({ assetId, propertyId: propertyId }) => ({
      assetId,
      properties: [{ propertyId }],
    }));

  return dedupeAssetQueriesWithProperties(assetQueriesWithProperties);
}

function isModeledDataStream(dataStream: ModeledDataStream | UnmodeledDataStream): dataStream is ModeledDataStream {
  return Object.hasOwn(dataStream, 'propertyId') && Object.hasOwn(dataStream, 'assetId');
}

function dedupeAssetQueriesWithProperties(queries: NonNullable<Query['assets']>) {
  const dedupedAssetQueriesWithProperties = queries.reduce<NonNullable<Query['assets']>>((acc, currentQuery) => {
    const existingQuery = acc.find((query) => query.assetId === currentQuery.assetId);

    if (existingQuery) {
      existingQuery.properties.push(...currentQuery.properties);
      return acc;
    }

    return [...acc, currentQuery];
  }, []);

  return dedupedAssetQueriesWithProperties;
}

function createPropertyAliasQueries(unmodeledDataStreams: UnmodeledDataStream[]) {
  const propertyAliasQueries = unmodeledDataStreams.map((unmodeledDataStream) => ({
    propertyAlias: unmodeledDataStream.propertyAlias ?? '',
  }));

  return dedupePropertyAliasQueries(propertyAliasQueries);
}

function dedupePropertyAliasQueries(queries: NonNullable<Query['properties']>) {
  const propertyAliasQueries = queries.reduce<NonNullable<Query['properties']>>((acc, currentQuery) => {
    const existingQuery = acc.find((query) => query.propertyAlias === currentQuery.propertyAlias);

    if (existingQuery) {
      return acc;
    }

    return [...acc, currentQuery];
  }, []);

  return propertyAliasQueries;
}
