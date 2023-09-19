import {
  type BatchGetAssetPropertyValueRequest,
  BatchGetAssetPropertyValueResponse,
} from '@aws-sdk/client-iotsitewise';
import { rest } from 'msw';
import { BATCH_GET_ASSET_PROPERTY_VALUE_URL } from './constants';

export function batchGetAssetPropertyValueHandler() {
  return rest.post<BatchGetAssetPropertyValueRequest, Record<string, string>, BatchGetAssetPropertyValueResponse>(
    BATCH_GET_ASSET_PROPERTY_VALUE_URL,
    async (req, res, ctx) => {
      const { entries = [] } = await req.json<BatchGetAssetPropertyValueRequest>();

      const response = {
        successEntries: entries.map((entry) => ({
          entryId: entry.entryId,
          assetPropertyValue: {
            quality: 'GOOD',
            timestamp: {
              timeInSeconds: Date.now(),
            },
            value: {
              integerValue: 123,
            },
          },
        })),
        skippedEntries: [],
        errorEntries: [],
        nextToken: undefined,
      } satisfies BatchGetAssetPropertyValueResponse;

      return res(ctx.status(200), ctx.json(response));
    }
  );
}
