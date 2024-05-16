import type {
  UseListAPIBaseOptions,
  UseListAPIBaseResult,
} from '../../types/requests';
import {
  ListAssetModelProperties,
  ListAssetProperties,
} from '../../types/request-fn';
import { useMultipleListRequests } from '../use-multiple-list-requests';
import { useAssetModelProperties } from './use-asset-model-properties';
import { AssetPropertyResource } from '../../types/resources';

export type UseAssetPropertiesQuery = {
  assetId: string;
  assetModelId: string;
};

export interface UseAssetPropertiesOptions extends UseListAPIBaseOptions {
  parameters: readonly UseAssetPropertiesQuery[];
  listAssetProperties: ListAssetProperties;
  listAssetModelProperties: ListAssetModelProperties;
}

export interface UseAssetPropertiesResult extends UseListAPIBaseResult {
  assetProperties: AssetPropertyResource[];
}

/**
 * Use a list of IoT SiteWise AssetProperty resources.
 *
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_AssetProperty.html}
 *
 * @experimental Do not use in production.
 */
export function useAssetProperties({
  parameters,
  pageSize: maxResults,
  listAssetProperties,
  listAssetModelProperties,
}: UseAssetPropertiesOptions): UseAssetPropertiesResult {
  const {
    assetModelPropertiesById,
    isSuccess: assetModelPropertiesIsSuccess,
    error: assetModelPropertiesError,
  } = useAssetModelProperties({
    assetModelIds: parameters.map(({ assetModelId }) => assetModelId),
    listAssetModelProperties,
  });

  const { resources, ...responseResult } = useMultipleListRequests({
    isEnabled: assetModelPropertiesIsSuccess,
    pageSize: maxResults,
    resourceId: 'AssetProperty',
    parameters,
    requestFn: async (
      request: UseAssetPropertiesQuery & {
        nextToken?: string;
        maxResults?: number;
      }
    ) => {
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
            // @ts-expect-error TODO
            id: assetPropertyId,
            name,
            alias,
            unit,
            dataType,
            dataTypeSpec,
            assetId: 'FIX ME',
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

  return { assetProperties: resources, ...responseResult, isLoading, error };
}
