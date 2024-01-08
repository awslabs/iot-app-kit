import type { DataStreamQuery } from '@iot-app-kit/core';
import { TwinMakerHistoryQuery } from '../common/queryTypes';

export type TwinMakerDataStreamQuery = TwinMakerHistoryQuery & {
  workspaceId: string;
} & DataStreamQuery;

export type TwinMakerDataStreamIdComponent = {
  workspaceId: string;
  entityId: string;
  componentName: string;
  propertyName: string;
};
