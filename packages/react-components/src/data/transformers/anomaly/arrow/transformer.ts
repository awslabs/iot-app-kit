import { DataSource } from '../../../types';

import { isAfter, isBefore } from 'date-fns';
import {
  ArrowDataSource,
  ArrowDataSourceTransformer,
  ArrowDataSourceValue,
  Field,
} from '../../arrow';
import { AnomalyData, AnomalyDescription } from '../output';
import { AnomalyArrowDataSourceValue } from './input';
import { AnomalyArrowDataSource } from './datasource';

const NON_DIAGNOSTIC_FIELDS = [
  'time',
  'quality',
  'anomaly_score',
  'prediction_reason',
  'prediction',
];

const isDiagnosticField = (field: Field) =>
  !NON_DIAGNOSTIC_FIELDS.includes(field.name);

const isAnomalousValue = (value?: string) => value === 'ANOMALY_DETECTED';

type DiagnosticNameMapping = {
  [key in string]: `diagnostic_${string}`;
};

type DiagnosticMapping = {
  [key in `diagnostic_${string}`]: number;
};

const TIMESTAMP_FIELD_NAME = 'time';
const PREDICTION_REASON_FIELD_NAME = 'prediction_reason';

/**
 * Transformer for AnomalyResult type responses from
 * calling GetAssetPropertyValueHistory for usage in
 * an Anomaly Widget
 *
 * encoding: {
 *  timestamp: number;
 *  diagnostic_n: number;
 *  diagnostic_n+1: number;
 * }
 */
export class AnomalyArrowDataSourceTransformer extends ArrowDataSourceTransformer<
  AnomalyArrowDataSourceValue,
  AnomalyData,
  AnomalyDescription
> {
  #validData(datasource: ArrowDataSource<ArrowDataSourceValue>) {
    const hasTimeField = datasource.value.data.fields.some(
      (field) =>
        field.name === TIMESTAMP_FIELD_NAME &&
        field.type === 'time' &&
        field.values.every((value) => typeof value === 'number')
    );

    const hasPredictionReasonField = datasource.value.data.fields.some(
      (field) =>
        field.name === PREDICTION_REASON_FIELD_NAME &&
        field.type === 'string' &&
        field.values.every((value) => typeof value === 'string')
    );

    const hasDiagnostics = datasource.value.data.fields
      .filter(isDiagnosticField)
      .some(
        (field) =>
          field.type === 'number' &&
          field.values.every((value) => typeof value === 'number')
      );

    return hasTimeField && hasPredictionReasonField && hasDiagnostics;
  }

  canTransform(datasource: DataSource): datasource is AnomalyArrowDataSource {
    const isArrowDataSource = super.canTransform(datasource);
    if (!isArrowDataSource) return false;

    const hasValidData = this.#validData(datasource);

    if (!hasValidData) {
      console.warn(
        'Anomaly arrow datasource has invalid data shape.',
        datasource
      );
    }

    return hasValidData;
  }

  #getDataExtent(dataSource: AnomalyArrowDataSource) {
    const { fields } = dataSource.value.data;
    const timestampField = this.#timestampField(fields);

    if (!timestampField) return undefined;

    let start: Date | null = null;
    let end: Date | null = null;
    (timestampField.values as number[]).forEach((timestamp) => {
      const date = new Date(timestamp);
      if (start === null || isBefore(date, start)) {
        start = date;
      }
      if (end === null || isAfter(date, end)) {
        end = date;
      }
    });

    if (start === null || end === null) return undefined;

    return {
      start,
      end,
    };
  }

  #diagnosticId(order: number): `diagnostic_${string}` {
    return `diagnostic_${order}`;
  }

  #getDiagnosticFieldMapping(fields: Field[]) {
    return fields
      .filter(isDiagnosticField)
      .map((field) => field.name)
      .sort()
      .reduce((acc, n, i) => {
        acc[n] = this.#diagnosticId(i);
        return acc;
      }, {} as DiagnosticNameMapping);
  }

  #timestampField(fields: Field[]) {
    return fields.find((field) => field.name === TIMESTAMP_FIELD_NAME);
  }

  #diagnosticField(fields: Field[], name: string) {
    return fields.find((field) => field.name === name);
  }

  #predictionReasonField(fields: Field[]) {
    return fields.find((field) => field.name === PREDICTION_REASON_FIELD_NAME);
  }

  transform(dataSource: AnomalyArrowDataSource): AnomalyData {
    const { fields, length } = dataSource.value.data;

    const emptyData = { timestamp: [] };

    const predictionReasonField = this.#predictionReasonField(fields);
    const timestampField = this.#timestampField(fields);

    if (!predictionReasonField || !timestampField) return emptyData;

    const diagnosticFieldMapping = this.#getDiagnosticFieldMapping(fields);

    /**
     * echarts dataset can be created in a keyed column format,
     * but this data format is not supported in the out of
     * the box echarts dataset sort transform. In order to not
     * write our own custom sort transform, we are transforming
     * the data into an object array format.
     *
     * https://github.com/apache/echarts/blob/a2824713ac98378f4effc0baa372798c84cc4127/src/component/transform/sortTransform.ts#L51
     */
    const data: AnomalyData = [];

    for (let i = 0; i < length; i++) {
      if (!isAnomalousValue(predictionReasonField.values.at(i) as string)) {
        continue;
      }

      const diagnostics = Object.entries(diagnosticFieldMapping).reduce(
        (acc, [name, diagnosticKey]) => {
          acc[diagnosticKey] = this.#diagnosticField(fields, name)?.values.at(
            i
          ) as number;
          return acc;
        },
        {} as DiagnosticMapping
      );

      data.push({
        timestamp: timestampField.values.at(i) as number,
        ...diagnostics,
      });
    }

    return data;
  }

  describe(dataSource: AnomalyArrowDataSource) {
    const { fields } = dataSource.value.data;
    const diagnosticFieldMapping = this.#getDiagnosticFieldMapping(fields);

    return {
      ...dataSource.value.styles,
      diagnostics: Object.entries(diagnosticFieldMapping).map(
        ([name, key]) => ({
          id: key,
          name,
        })
      ),
      dataExtent: this.#getDataExtent(dataSource),
    };
  }
}
