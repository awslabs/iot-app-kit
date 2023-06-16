import { InvalidRequestException, BatchGetAssetPropertyValueCommand } from '@aws-sdk/client-iotsitewise';

import type { BatchGetLatestValuesEntry } from './types';
import type { WithAbortSignal, WithIoTSiteWiseClient } from '../../../types';

export interface BatchGetAssetPropertyValueInput extends WithAbortSignal, WithIoTSiteWiseClient {
  entries: BatchGetLatestValuesEntry[];
}

/** Get the latest values for a batch of asset properties. */
export async function batchGetAssetPropertyValue({ entries, signal, client }: BatchGetAssetPropertyValueInput) {
  try {
    const command = new BatchGetAssetPropertyValueCommand({ entries });
    const output = await client.send(command, { abortSignal: signal });

    return output;
  } catch (error) {
    handleBatchGetAssetPropertyValueError({ error });
  }
}

// return never to tell TS we're not returning undefined
function handleBatchGetAssetPropertyValueError({ error }: { error: unknown }): never {
  const errorMessage = `Failed to batch get asset properties values. Error: ${error}`;
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
