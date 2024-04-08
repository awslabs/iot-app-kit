export type StylesKey = string;
export type ObjectKey = string;

export type ObjectStyles = { [key in StylesKey]: unknown };
export type ObjectData = { [key in ObjectKey]: unknown }[];

export type ObjectDataSourceValue<Styles = ObjectStyles, Data = ObjectData> = {
  styles?: Styles;
  data: Data;
};
