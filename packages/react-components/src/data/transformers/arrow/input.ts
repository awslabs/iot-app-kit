import { type StylesObject } from '../input';

export enum FieldType {
  time = 'time',
  number = 'number',
  string = 'string',
}

export interface Field<T = unknown> {
  /**
   * Name of the field (column)
   */
  name: string;

  /**
   *  Field value type (string, number, etc)
   */
  type: FieldType;

  /**
   * The raw field values
   */
  values: T[];
}

export interface DataFrame {
  name?: string;
  fields: Field[]; // All fields of equal length

  // The number of rows
  length: number;
}

export type ArrowDataSourceValue<Styles = StylesObject> = {
  styles?: Styles;
  data: DataFrame;
};
