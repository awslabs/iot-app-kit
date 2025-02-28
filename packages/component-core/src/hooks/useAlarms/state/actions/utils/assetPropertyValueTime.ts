import { type AssetPropertyValue } from '@aws-sdk/client-iotsitewise';
import { toTimestamp } from '@iot-app-kit/core';

export const assetPropertyValueTime = (
  assetPropertyValue: AssetPropertyValue
) => toTimestamp(assetPropertyValue.timestamp);
