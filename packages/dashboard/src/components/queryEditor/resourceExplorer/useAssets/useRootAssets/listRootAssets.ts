import { InvalidRequestException, ListAssetsCommand } from '@aws-sdk/client-iotsitewise';

import { ROOT_ASSETS_LIST_FILTER, MAX_ROOT_ASSETS_PER_PAGE } from './constants';
import type { WithAbortSignal, WithIoTSiteWiseClient } from '../../../types';

export interface ListRootAssetsInput extends WithAbortSignal, WithIoTSiteWiseClient {
  /** Pagination token used to request the NEXT page of assets. */
  nextToken?: string;
}

/**
 * Returns a page of root assets and maybe a pagination token (`nextToke`). Call it again with
 * the return pagination token and the next page of root assets will be returned.
 */
export async function listRootAssets({ nextToken, signal, client }: ListRootAssetsInput) {
  try {
    const command = new ListAssetsCommand({
      nextToken,
      filter: ROOT_ASSETS_LIST_FILTER,
      maxResults: MAX_ROOT_ASSETS_PER_PAGE,
    });
    const assets = await client.send(command, { abortSignal: signal });

    return assets;
  } catch (error) {
    handleListRootAssetsError(error);
  }
}

// return never to tell TS we're not returning undefined
function handleListRootAssetsError(error: unknown): never {
  const errorMessage = `Failed to list root assets. Error: ${error}`;
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
