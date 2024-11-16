import type {
  ListAssetModelProperties,
  ListAssetProperties,
} from '@iot-app-kit/core';
import { useMultipleListRequests } from '../../../requests/use-multiple-list-requests';
import type {
  UseListAPIBaseOptions,
  UseListAPIBaseResult,
} from '../../../types/requests';
import type { AssetPropertyResource } from '../../../types/resources';
import type { AssetPropertyRequestParameters } from '../types';
import { useAssetModelProperties } from './use-asset-model-properties';

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
    isLoading: isLoadingAssetModelProperties,
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
          await listAssetProperties({
            ...request,
            /**
             * https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_ListAssetProperties.html#API_ListAssetProperties_RequestSyntax
             * Includes properties for components as well
             */
            filter: 'ALL',
          });

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
    (error === null &&
      parameters.length !== 0 &&
      assetProperties.length === 0) ||
    isLoadingAssetModelProperties ||
    responseResult.isLoadingResources;

  return {
    assetProperties,
    isLoadingFirstPage: isLoading,
    isLoadingResources: isLoading,
    error,
  };
}
