import { type ObjectDataSourceValue } from '../../object';
import { type AnomalyStyles } from '../input';

export interface Diagnostic {
  name: string;
  value: number;
}

export type Diagnostics = Diagnostic[];

export type AnomalyObjectDataInput = {
  timestamp: number;
  prediction: number;
  diagnostics: Diagnostics;
}[];

// DataSource input shape
export type AnomalyObjectDataSourceValue = ObjectDataSourceValue<
  AnomalyStyles,
  AnomalyObjectDataInput
>;
