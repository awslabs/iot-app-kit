import { ObjectDataSourceValue } from '../../object';

export type AnomalyObjectStyles = {
  decimalPlaces?: number;
  // color theme override for series data
  color?: string[];
};

export type Diagnostic = {
  name: string;
  value: number;
};
export type Diagnostics = Diagnostic[];

export type AnomalyObjectDataInput = {
  timestamp: number;
  prediction: number;
  diagnostics: Diagnostics;
}[];

// DataSource input shape
export type AnomalyObjectDataSourceValue = ObjectDataSourceValue<
  AnomalyObjectStyles,
  AnomalyObjectDataInput
>;
