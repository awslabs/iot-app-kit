import unique from 'lodash/uniq';

import { DataSource } from '../../../types';

import {
  ObjectDataSource,
  ObjectDataSourceTransformer,
  ObjectDataSourceValue,
} from '../../object';
import { AnomalyObjectDataSource } from './datasource';
import { AnomalyObjectDataSourceValue, Diagnostic, Diagnostics } from './input';
import { AnomalyData, AnomalyDescription, DiagnosticData } from './output';
import { isAfter } from 'date-fns/isAfter';
import { isBefore } from 'date-fns/isBefore';

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
export class AnomalyObjectDataSourceTransformer extends ObjectDataSourceTransformer<
  AnomalyObjectDataSourceValue,
  AnomalyData,
  AnomalyDescription
> {
  #validData(datasource: ObjectDataSource<ObjectDataSourceValue>) {
    return datasource.value.data.every(
      (item) =>
        'timestamp' in item &&
        'diagnostics' in item &&
        Array.isArray(item['diagnostics']) &&
        item['diagnostics'].every(
          (diagnostic) =>
            typeof diagnostic === 'object' &&
            'name' in diagnostic &&
            typeof diagnostic['name'] === 'string' &&
            'value' in diagnostic &&
            typeof diagnostic['value'] === 'number'
        )
    );
  }

  canTransform(datasource: DataSource): datasource is AnomalyObjectDataSource {
    const isObjectDataSource = super.canTransform(datasource);
    if (!isObjectDataSource) return false;

    const hasValidData = this.#validData(datasource);

    if (!hasValidData) {
      console.warn(
        'Anomaly object datasource has invalid data shape.',
        datasource
      );
    }

    return hasValidData;
  }

  #getDataExtent(dataSource: AnomalyObjectDataSource) {
    let start: Date | null = null;
    let end: Date | null = null;
    dataSource.value.data.forEach(({ timestamp }) => {
      const date = new Date(timestamp);
      if (start === null || isAfter(date, start)) {
        start = date;
      }
      if (end === null || isBefore(date, end)) {
        end = date;
      }
    });

    if (start === null || end === null) return undefined;

    return {
      start,
      end,
    };
  }

  #getDiagnosticKey(
    ordering: Diagnostic['name'][],
    diagnosticName: Diagnostic['name']
  ) {
    const i = ordering.findIndex((name) => name === diagnosticName);
    return this.#diagnosticId(i);
  }

  #diagnosticId(order: number): `diagnostic_${string}` {
    return `diagnostic_${order}`;
  }

  /**
   * Figure out the unique list of diagnostic names
   * It is not guarenteed to be consistent across events
   * since users can arbitrarily change the data in sitewise
   */
  #getUniqueDiagnostics(dataSource: AnomalyObjectDataSource) {
    return unique(
      dataSource.value.data.flatMap(({ diagnostics }) =>
        diagnostics.map(({ name }) => name)
      )
    );
  }

  #flattenDiagnostics(
    ordering: Diagnostic['name'][],
    diagnostics: Diagnostics
  ) {
    return diagnostics.reduce((acc, n) => {
      const key = this.#getDiagnosticKey(ordering, n.name);
      acc[key] = n.value;
      return acc;
    }, {} as DiagnosticData);
  }

  transform(dataSource: AnomalyObjectDataSource): AnomalyData {
    const { data } = dataSource.value;
    const diagnosticOrdering = this.#getUniqueDiagnostics(dataSource);
    return data.map(({ timestamp, diagnostics }) => {
      return {
        timestamp: new Date(timestamp).getTime(),
        ...this.#flattenDiagnostics(diagnosticOrdering, diagnostics),
      };
    });
  }

  describe(dataSource: AnomalyObjectDataSource) {
    const diagnosticOrdering = this.#getUniqueDiagnostics(dataSource);
    const diagnosticMapping = diagnosticOrdering.map((name) => {
      const diagnosticId = this.#getDiagnosticKey(diagnosticOrdering, name);
      return {
        id: diagnosticId,
        name,
      };
    });
    return {
      ...dataSource.value.styles,
      diagnostics: diagnosticMapping,
      dataExtent: this.#getDataExtent(dataSource),
    };
  }
}
