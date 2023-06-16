import { InvalidRequestException, ListAssociatedAssetsCommand } from '@aws-sdk/client-iotsitewise';
import invariant from 'tiny-invariant';

import { MAX_ONE_PARENT, PARENT_LIST_TRAVERSAL_DIRECTION } from './constants';
import type { WithAbortSignal, WithIoTSiteWiseClient } from '../../../../types';

export interface GetParentAssetInput extends WithAbortSignal, WithIoTSiteWiseClient {
  /** The ID of the IoT SiteWise asset to get the parent of. */
  assetId: string;
}

/** Get the parent of an asset with a given asset ID. */
export async function getParentAsset({ assetId, signal, client }: GetParentAssetInput) {
  invariant(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(assetId),
    'Expected assetId to be a valid UUID. There is likely a bug in the calling code.'
  );

  try {
    // https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_ListAssociatedAssets.html
    const command = new ListAssociatedAssetsCommand({
      traversalDirection: PARENT_LIST_TRAVERSAL_DIRECTION,
      maxResults: MAX_ONE_PARENT,
      assetId,
    });
    const { assetSummaries: [parentAsset] = [] } = await client.send(command, { abortSignal: signal });

    return parentAsset;
  } catch (error) {
    handleGetParentAssetError({ error, assetId });
  }
}

// return never to tell TS we're not returning undefined
function handleGetParentAssetError({ error, assetId }: { error: unknown; assetId?: string }): never {
  const errorMessage = `Failed to get parent of asset '${assetId}'. Error: ${error}`;
  console.error(errorMessage);

  if (error instanceof InvalidRequestException) {
    console.error(`Expected request parameters to always be valid. There is likely a bug in the code.`);
  }

  if (error instanceof Error) {
    // we do not want to change the error type by generalizing to `Error`
    throw error;
  }

  // normalize non-Error exceptions to Error type
  throw new Error(errorMessage);
}
