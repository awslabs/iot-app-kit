import { ObjectDataSourceValue } from '../../object';

export type AnomalyObjectStyles = {
  decimalPlaces?: number;
  color?: string;
  backgroundColor?: string;
  // used for datazoom customization
  miniMapBackgroundColor?: string;
  miniMapDataColor?: string;
  contributingPropertiesTheme?: {
    backgroundColor?: string;
    color?: string[];
  };
};

export type Diagnostic = {
  name: string;
  value: number;
};
export type Diagnostics = Diagnostic[];

export type AnomalyObjectDataInput = {
  timestamp: string;
  diagnostics: Diagnostics;
}[];

// DataSource input shape
export type AnomalyObjectDataSourceValue = ObjectDataSourceValue<
  AnomalyObjectStyles,
  AnomalyObjectDataInput
>;
