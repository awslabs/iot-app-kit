import { InvalidRequestException, type AssetSummary, ListAssociatedAssetsCommand } from '@aws-sdk/client-iotsitewise';
import invariant from 'tiny-invariant';

import { CHILD_ASSETS_LIST_TRAVERSAL_DIRECTION, MAX_CHILD_ASSETS_PAGE_SIZE } from './constants';
import type { WithAbortSignal, WithIoTSiteWiseClient } from '../../../types';

export interface ListChildAssetsProps extends WithAbortSignal, WithIoTSiteWiseClient {
  assetId: string;
  hierarchyId: string;
}

/** Get all child assets for a given asset and hierarchy. */
export async function listChildAssets({ assetId, hierarchyId, signal, client }: ListChildAssetsProps) {
  invariant(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(assetId),
    'Expected assetId to be a valid UUID. There is likely a bug in the calling code.'
  );
  invariant(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(hierarchyId),
    'Expected hierarchyId to be a valid UUID. There is likely a bug in the calling code.'
  );

  try {
    // https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_ListAssociatedAssets.html
    const command = new ListAssociatedAssetsCommand({
      assetId,
      hierarchyId,
      traversalDirection: CHILD_ASSETS_LIST_TRAVERSAL_DIRECTION,
      maxResults: MAX_CHILD_ASSETS_PAGE_SIZE,
    });
    const { assetSummaries = [], nextToken } = await client.send(command, { abortSignal: signal });
    let paginationToken: string | undefined = nextToken;
    const childAssets: AssetSummary[] = [...assetSummaries];
    while (nextToken) {
      const { assetSummaries: assetSummaryPage = [], nextToken: newToken } = await client.send(
        new ListAssociatedAssetsCommand({
          assetId,
          hierarchyId,
          traversalDirection: CHILD_ASSETS_LIST_TRAVERSAL_DIRECTION,
          maxResults: MAX_CHILD_ASSETS_PAGE_SIZE,
          nextToken: paginationToken,
        }),
        { abortSignal: signal }
      );
      childAssets.push(...assetSummaryPage);
      paginationToken = newToken;
    }

    return childAssets;
  } catch (error) {
    handleListChildAssetsError({ error, assetId, hierarchyId });
  }
}

function handleListChildAssetsError({
  error,
  assetId,
  hierarchyId,
}: {
  error: unknown;
  assetId: string;
  hierarchyId: string;
}): never {
  const errorMessage = `Failed to list child assets for asset ID: ${assetId} and hierarchy ID: ${hierarchyId}. Error: ${error}`;
  console.error(errorMessage);

  if (error instanceof InvalidRequestException) {
    console.error(`Expected hard-coded request parameters to always be valid. There is likely a bug in the code.`);
  }

  if (error instanceof Error) {
    // we do not want to change the error type by generalizing to `Error`
    throw error;
  }

  // normalize non-Error exceptions to Error type
  throw new Error(errorMessage);
}
