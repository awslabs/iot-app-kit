import { type DataSource, type DataSourceTransformer } from '../types';

export class DataSourceLoader<Description, TransformedData> {
  private datasourceTransformers: DataSourceTransformer<
    TransformedData,
    Description
  >[];

  constructor(
    datasourceTransformers: DataSourceTransformer<
      TransformedData,
      Description
    >[]
  ) {
    this.datasourceTransformers = datasourceTransformers;
  }

  private getTransformer(datasource: DataSource) {
    const transformer = this.datasourceTransformers.find((transformer) =>
      transformer.canTransform(datasource)
    );

    if (!transformer) {
      throw {
        name: 'UnhandledDataSourceType',
        message: 'DataSource type not supported',
      };
    }

    return transformer;
  }

  transform(datasources: DataSource[]): TransformedData[] {
    return datasources.map((datasource) => {
      return this.getTransformer(datasource).transform(datasource);
    });
  }

  describe(datasources: DataSource[]): Description[] {
    return datasources.map((datasource) => {
      return this.getTransformer(datasource).describe(datasource);
    });
  }
}
