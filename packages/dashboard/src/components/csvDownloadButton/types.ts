import { Primitive } from '@iot-app-kit/core';

export type CSVDownloadObject = {
  id: string;
  timestamp: string;
  value?: Primitive;
  unit?: string;
  aggregationType?: string;
  resolution?: number;
  propertyName?: string;
  assetName?: string;
  propertyAlias?: string;
  assetId?: string;
  dataType?: string;
  propertyId?: string;
};
