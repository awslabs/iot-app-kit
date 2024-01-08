import type { RefId } from '@iot-app-kit/core';

export type PropertyQueryInfo = {
  propertyName: string;

  refId?: RefId;
};

export type TwinMakerBaseQuery = {
  properties: PropertyQueryInfo[];
};

// Query for static property value
export interface TwinMakerEntityPropertyValueQuery extends TwinMakerBaseQuery {
  entityId: string;
  componentName: string;
}

// Query for time series property value
export type TwinMakerEntityHistoryQuery = TwinMakerEntityPropertyValueQuery;

// Query for time series property value for a component type
export interface TwinMakerComponentHistoryQuery extends TwinMakerBaseQuery {
  componentTypeId: string;
}

export type TwinMakerHistoryQuery =
  | TwinMakerEntityHistoryQuery
  | TwinMakerComponentHistoryQuery;
export type TwinMakerPropertyValueQuery = TwinMakerEntityPropertyValueQuery;
export type TwinMakerQuery =
  | TwinMakerHistoryQuery
  | TwinMakerPropertyValueQuery;
