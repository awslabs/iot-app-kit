import { useQuery } from '@tanstack/react-query';

import { resourceExplorerQueryClient } from '../resource-explorer-query-client';
import { BatchGetAssetPropertyValue } from '../types/request-fn';
import { AssetPropertyResource, TimeSeriesResource } from '../types/resources';

function isAssetProperty(
  dataStreamResource: AssetPropertyResource | TimeSeriesResource
): dataStreamResource is AssetPropertyResource {
  return (dataStreamResource as AssetPropertyResource).name != null;
}

interface LatestValueRequestEntry {
  entryId: string;
  assetId?: string;
  propertyId?: string;
  propertyAlias?: string;
}

interface LatestValueResponseEntry extends LatestValueRequestEntry {
  latestValue?: number | string | boolean;
  latestValueTimestamp?: number;
}

export interface UseLatestValuesOptions<
  DataStreamResource extends AssetPropertyResource | TimeSeriesResource
> {
  batchGetAssetPropertyValue?: BatchGetAssetPropertyValue;

  dataStreamResources: DataStreamResource[];
  createEntryId: (resource: DataStreamResource) => string;
}

export interface UseLatestValuesResult<
  DataStreamResource extends AssetPropertyResource | TimeSeriesResource
> {
  responseEntries: LatestValueResponseEntry[];

  dataStreamResourcesWithLatestValues: DataStreamResourceWithLatestValue<DataStreamResource>[];
}

type DataStreamResourceWithLatestValue<
  DataStreamResource extends AssetPropertyResource | TimeSeriesResource
> = DataStreamResource & {
  lastestValue?: number | string | boolean;
  latestValueTimestamp?: number;
};

// TODO: handle >128 requests
export function useLatestValues<
  DataStreamResource extends AssetPropertyResource | TimeSeriesResource
>({
  batchGetAssetPropertyValue,
  dataStreamResources,
  createEntryId,
}: UseLatestValuesOptions<DataStreamResource>): UseLatestValuesResult<DataStreamResource> {
  const requestEntries: LatestValueRequestEntry[] = dataStreamResources.map(
    (dataStreamResource) => {
      const entryId = createEntryId(dataStreamResource);

      const propertyId = isAssetProperty(dataStreamResource)
        ? // @ts-expect-error todo
          dataStreamResource.id
        : dataStreamResource.propertyId;

      return {
        entryId,
        assetId: dataStreamResource.assetId,
        propertyAlias: dataStreamResource.alias,
        propertyId: propertyId,
        ...dataStreamResource,
      };
    }
  );

  // TODO: Combine request entries and data

  const { data: responseEntries = [] } = useQuery(
    {
      refetchInterval: 60000,
      queryKey: [{ resourceId: 'latestValue', ...requestEntries }],
      queryFn: async () => {
        if (!batchGetAssetPropertyValue) {
          throw new Error('Expected batchget to be defined');
        }

        const { successEntries = [] } = await batchGetAssetPropertyValue({
          entries: requestEntries,
        });

        const responseEntries: LatestValueResponseEntry[] = requestEntries.map(
          (requestEntry) => {
            const foundSuccessEntry = successEntries.find((successEntry) => {
              if (successEntry.entryId === requestEntry.entryId) {
                return successEntry;
              }
            });

            if (foundSuccessEntry) {
              const responseEntry = {
                ...requestEntry,
                latestValue: Object.values(
                  foundSuccessEntry.assetPropertyValue?.value ?? {}
                ).at(0),
                latestValueTimestamp:
                  foundSuccessEntry.assetPropertyValue?.timestamp
                    ?.timeInSeconds,
              };

              return responseEntry;
            }

            return {
              ...requestEntry,
              latestValue: undefined,
            };
          }
        );

        return responseEntries;
      },
    },
    resourceExplorerQueryClient
  );

  return {
    responseEntries,
    dataStreamResourcesWithLatestValues: [],
  };
}
