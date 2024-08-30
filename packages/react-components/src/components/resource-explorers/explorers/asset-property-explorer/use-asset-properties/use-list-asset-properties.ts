import { useAssetModelProperties } from './use-asset-model-properties';
import type { AssetPropertyRequestParameters } from '../types';
import { useMultipleListRequests } from '../../../requests/use-multiple-list-requests';
import type {
  ListAssetModelProperties,
  ListAssetProperties,
} from '@iot-app-kit/core';
import type {
  UseListAPIBaseOptions,
  UseListAPIBaseResult,
} from '../../../types/requests';
import type { AssetPropertyResource } from '../../../types/resources';

export interface UseListAssetPropertiesOptions extends UseListAPIBaseOptions {
  parameters: readonly AssetPropertyRequestParameters[];
  listAssetProperties?: ListAssetProperties;
  listAssetModelProperties?: ListAssetModelProperties;
}

export interface UseListAssetPropertiesResult extends UseListAPIBaseResult {
  assetProperties: AssetPropertyResource[];
}

export function useListAssetProperties({
  parameters,
  pageSize,
  listAssetProperties,
  listAssetModelProperties,
}: UseListAssetPropertiesOptions): UseListAssetPropertiesResult {
  const {
    assetModelPropertiesById,
    isSuccess: assetModelPropertiesIsSuccess,
    error: assetModelPropertiesError,
  } = useAssetModelProperties({
    assetModelIds: parameters.map(({ assetModelId }) => assetModelId),
    listAssetModelProperties,
  });

  const { resources: assetProperties, ...responseResult } =
    useMultipleListRequests({
      isEnabled:
        listAssetProperties !== undefined && assetModelPropertiesIsSuccess,
      pageSize,
      resourceId: 'AssetProperty',
      parameters,
      requestFn: async (
        request: AssetPropertyRequestParameters & {
          nextToken?: string;
          maxResults?: number;
        }
      ) => {
        if (listAssetProperties === undefined) {
          throw new Error('Expected listAssetProperties to be defined.');
        }

        const { nextToken, assetPropertySummaries = [] } =
          await listAssetProperties(request);

        const assetModelProperties =
          assetModelPropertiesById[request.assetModelId];

        const assetProperties = assetPropertySummaries.map(
          ({ id: assetPropertyId = '', unit, alias }) => {
            const {
              dataType = '',
              dataTypeSpec,
              name = '',
            } = assetModelProperties.find(
              ({ id: assetModelPropertyId }) =>
                assetModelPropertyId === assetPropertyId
            ) ?? {};

            const assetProperty: AssetPropertyResource = {
              propertyId: assetPropertyId,
              name,
              alias,
              unit,
              dataType,
              dataTypeSpec,
              assetId: request.assetId,
            };

            return assetProperty;
          }
        );

        return { assetProperties, nextToken };
      },
      responseTransformer: ({ assetProperties }) => assetProperties,
    });

  const error = assetModelPropertiesError ?? responseResult.error;
  const isLoading =
    !error && (!assetModelPropertiesIsSuccess || responseResult.isLoading);

  return { assetProperties, ...responseResult, isLoading, error };
}
