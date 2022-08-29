import { DataStreamQuery, RefId } from '@iot-app-kit/core';

export type PropertyQueryInfo = {
  propertyName: string;

  refId?: RefId;
};

export type TwinMakerBaseQuery = {
  properties: PropertyQueryInfo[];
};

export interface TwinMakerEntityHistoryQuery extends TwinMakerBaseQuery {
  entityId: string;
  componentName: string;
}

// TODO: support query by component type
// export interface TwinMakerComponentHistoryQuery extends TwinMakerBaseQuery {
//   componentTypeId: string;
//   propertyValueFilter?: { [propertyName: string]: string };
// }

export type TwinMakerQuery = TwinMakerEntityHistoryQuery; // | TwinMakerComponentHistoryQuery;
export type TwinMakerDataStreamQuery = TwinMakerQuery & { workspaceId: string } & DataStreamQuery;

export type TwinMakerDataStreamIdComponent = {
  workspaceId: string;
  entityId: string;
  componentName: string;
  propertyName: string;
};
