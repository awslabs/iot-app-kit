import type { Quality } from '@aws-sdk/client-iotsitewise';
import type { Primitive } from '@iot-app-kit/core';

export type CSVDownloadObject = {
  timestamp: string;
  dataQuality: Quality;
  value?: Primitive;
  unit?: string;
  aggregationType?: string;
  resolution?: number;
  propertyName?: string;
  assetName?: string;
  propertyAlias?: string;
  assetId?: string;
  dataType?: string;
  dataTypeSpec?: string;
  propertyId?: string;
};
