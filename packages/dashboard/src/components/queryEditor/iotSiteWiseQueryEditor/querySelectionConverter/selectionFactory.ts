import { ModeledDataStream } from '../modeledDataStreamQueryEditor/modeledDataStreamExplorer/types';
import { UnmodeledDataStream } from '../unmodeledDataStreamExplorer/types';
import type { QueryWidget } from '~/customization/widgets/types';

type Query = NonNullable<QueryWidget['properties']['queryConfig']['query']>;

export const dataStreamFactory = {
  createFromQuery(query: Query): {
    modeledDataStreams: ModeledDataStream[];
    unmodeledDataStreams: UnmodeledDataStream[];
  } {
    return {
      modeledDataStreams: createModeledDataStreamSelection(query),
      unmodeledDataStreams: createUnmodeledDataStreamSelection(query),
    };
  },
};

function createModeledDataStreamSelection({ assets }: Query): ModeledDataStream[] {
  const selectedModeledDataStreams =
    assets?.flatMap(({ assetId, properties }) => {
      return properties.map(({ propertyId }) => ({ assetId, propertyId }));
    }) ?? [];

  return selectedModeledDataStreams as ModeledDataStream[];
}

function createUnmodeledDataStreamSelection({ properties }: Query): UnmodeledDataStream[] {
  const selectedUnmodeledDataStreams = properties?.map(({ propertyAlias }) => ({ propertyAlias })) ?? [];

  return selectedUnmodeledDataStreams as UnmodeledDataStream[];
}
