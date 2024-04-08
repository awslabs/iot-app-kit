/**
 * Types for transformed data to be used in our widgets
 */
// extension of the Primitive value used in DataPoint
export type DataValue = number | string | boolean | Date;

// Defines the shape of a single data point
export type DataPointShape = { [key in string]: DataValue };

// Data can either be represented as a list of objects or a columnar object
// can add support for 2d table array in the future if there is a usecase
export type Data<Shape extends DataPointShape = DataPointShape> =
  | Shape[]
  | { [Key in keyof Shape]: Shape[Key][] };

export type DataSource<Value = unknown> = {
  state: 'loading' | 'success' | 'failed' | 'error';
  value: Value;
};

export interface DataSourceTransformer<TransformedData, Description> {
  canTransform: (dataSource: DataSource) => boolean;
  transform(dataSource: DataSource): TransformedData;
  describe(dataSource: DataSource): Description;
}
