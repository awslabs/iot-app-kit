import { DataStreamQuery } from '../../data-module/types.d';

export type EntityPropertyId = string;

export type EntityComponent = {
  properties: EntityPropertyId[];
};

export type EntityQuery = {
  id: string;
  components: EntityComponent[];
};

export interface RociDataStreamQuery extends DataStreamQuery {
  entities: EntityQuery[];
}
