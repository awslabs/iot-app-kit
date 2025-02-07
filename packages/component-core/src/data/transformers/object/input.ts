import { type StylesObject } from '../input';

export type ObjectKey = string;

export type ObjectData = { [key in ObjectKey]: unknown }[];

export interface ObjectDataSourceValue<
  Styles = StylesObject,
  Data = ObjectData
> {
  styles?: Styles;
  data: Data;
}
