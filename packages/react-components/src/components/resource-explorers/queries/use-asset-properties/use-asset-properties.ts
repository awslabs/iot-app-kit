import { type AssetProperty } from '@aws-sdk/client-iotsitewise';

import type { UseListAPIBaseOptions, UseListAPIBaseResult } from '../types';
import {
  ListAssetModelProperties,
  ListAssetProperties,
} from '../../types/data-source';
import { useTwoDimensionalListResources } from '../helpers/use-two-dimensional-list-resources';
import { useAssetModelProperties } from './use-asset-model-properties';

export type UseAssetPropertiesQuery = Readonly<{
  assetId: string;
  assetModelId: string;
}>;

export interface UseAssetPropertiesOptions extends UseListAPIBaseOptions {
  queries: UseAssetPropertiesQuery[];
  listAssetProperties: ListAssetProperties;
  listAssetModelProperties: ListAssetModelProperties;
}

export interface UseAssetPropertiesResult extends UseListAPIBaseResult {
  assetProperties: AssetProperty[];
}

/**
 * Use a list of IoT SiteWise AssetProperty resources.
 *
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_AssetProperty.html}
 *
 * @experimental Do not use in production.
 */
export function useAssetProperties({
  queries,
  maxResults,
  listAssetProperties,
  listAssetModelProperties,
}: UseAssetPropertiesOptions): UseAssetPropertiesResult {
  const {
    assetModelPropertiesById,
    isSuccess: assetModelPropertiesIsSuccess,
    error: assetModelPropertiesError,
  } = useAssetModelProperties({
    assetModelIds: queries.map(({ assetModelId }) => assetModelId),
    listAssetModelProperties,
  });

  const { resources: assetProperties, ...responseResult } =
    useTwoDimensionalListResources({
      isEnabled: assetModelPropertiesIsSuccess,
      maxResults,
      resourceName: 'AssetProperty',
      requests: queries,
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
          ({ id: assetPropertyId, path, notification, unit }) => {
            const { dataType, dataTypeSpec, name } =
              assetModelProperties.find(
                ({ id: assetModelPropertyId }) =>
                  assetModelPropertyId === assetPropertyId
              ) ?? {};

            const assetProperty: AssetProperty = {
              id: assetPropertyId,
              path,
              notification,
              unit,
              dataType,
              dataTypeSpec,
              name,
            };

            return assetProperty;
          }
        );

        return { assetProperties, nextToken };
      },
      resourceSelector: ({ assetProperties }) => assetProperties,
    });

  const error = assetModelPropertiesError ?? responseResult.error;
  const isFetching =
    !error && (!assetModelPropertiesIsSuccess || responseResult.isFetching);

  return { assetProperties, ...responseResult, isFetching, error };
}
