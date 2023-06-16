import { InvalidRequestException, DescribeAssetCommand } from '@aws-sdk/client-iotsitewise';
import invariant from 'tiny-invariant';

import type { WithAbortSignal, WithIoTSiteWiseClient } from '../types';

export interface DescribeAssetInput extends WithAbortSignal, WithIoTSiteWiseClient {
  /** The ID of the IoT SiteWise asset to describe. */
  assetId: string;
}

/** Return an IoT SiteWise asset description for a given asset ID. */
export async function describeAsset({ assetId, signal, client }: DescribeAssetInput) {
  invariant(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(assetId),
    'Expected assetId to be a valid UUID. There is likely a bug in the calling code.'
  );

  try {
    const describeAssetCommand = new DescribeAssetCommand({ assetId });
    const asset = await client.send(describeAssetCommand, { abortSignal: signal });

    return asset;
  } catch (error) {
    handleDescribeAssetError({ error, assetId });
  }
}

// return never to tell TS we're not returning undefined
function handleDescribeAssetError({ error, assetId }: { error: unknown; assetId?: string }): never {
  const errorMessage = `Failed to describe asset '${assetId}'. Error: ${error}`;
  console.error(errorMessage);

  if (error instanceof InvalidRequestException) {
    console.error(`Expected request parameters to always be valid. There is likely a bug in the code.`);
  }

  if (error instanceof Error) {
    // we do not want to change the error type by generalizing to `Error`
    throw error;
  }

  throw new Error(errorMessage);
}
