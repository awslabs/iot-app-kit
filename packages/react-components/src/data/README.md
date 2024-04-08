# Data Sources

## Data Source
Widgets will take a list of datasources
```ts
type WidgetDataSourceOptions = {
  datasources: DataSource<MyCustomDataSource>[];
}
```

Data sources can have any custom value. The type is defined as:
```ts
type DataSource<Value = unknown> = {
  state: 'loading' | 'success' | 'failed' | 'error';
  value: Value;
};
```

The value will be handled by a transformer detailed below.

## Data Loader
Each widget will have a data loader configured with a list of transformers. The types of data the widget can support is determined by whether or not the loader has a transformer that can handle that data source.

Example:
```ts
const myCustomDataSourceTransformer = new MyCustomDataSourceTransformer();

const dataLoader = new DataSourceLoader([myCustomDataSourceTransformer]);
```

In this example, any datasource that can be transformed by `MyCustomDataSourceTransformer` will work. If a datasource is not handled, the `DataSourceLoader` will throw an error when trying to describe or transform.

`DataSourceLoader` can do 2 functions:

### 1. Transform:
Converts a list of datasources, using the transformers, into data with a common encoding that can be used by the chart.

This should be used as the data for the chart.
```
const myCustomDataSourceTransformer = new MyCustomDataSourceTransformer();

const dataLoader = new DataSourceLoader([myCustomDataSourceTransformer]);

const transformedData = dataLoader.transform([myCustomDataSource]);
```

### 2. Describe:
Converts a list of datasources, using the transformers, into descriptions that can be used by the chart.

This should be used to describe the data in the chart.
```
const myCustomDataSourceTransformer = new MyCustomDataSourceTransformer();

const dataLoader = new DataSourceLoader([myCustomDataSourceTransformer]);

const descriptions = dataLoader.describe([myCustomDataSource]);
```

## Tranformers
The purpose of a transformer is to take some unknown datasource input and transform it into some known output.

They are to be used within a `DataLoader`.

```ts
interface DataSourceTransformer<TransformedData, Description> {
  canTransform: (dataSource: DataSource) => boolean;
  transform(dataSource: DataSource): TransformedData;
  describe(dataSource: DataSource): Description;
}
```

The datasource will be invoked with an unknown `DataSource` and output either `TransformedData` or `Description` depending on the function. `canTransform` will be called by the `DataLoader` so that it can find the correct transformer to use for the datasource. 

**It is important to be exhaustive in the implementation of the `canTransform` function so that you do not miss any edgecases in determining that a datasource is the type you think it is.**

You can use `canTransform` like a predicate function since the `DataLoader` will only call `transform` or `describe` if the `canTransform` function is true.

## Examples

### Anomaly Object Transformer

Input:
```ts
const myAnomalyObjectDataSource = {
  state: 'success',
  value: {
    color: 'pink',
    styles: {
      contributingPropertiesTheme: {
        color: ['red', 'white', 'blue'],
      },
    },
    data: [
      {
        timestamp: '2024-03-21T21:37:02.000000',
        diagnostics: [
          {
            name: 'Diagnostic Name 1',
            value: 0.25,
          },
          {
            name: 'Diagnostic Name 2',
            value: 0.75,
          },
        ],
      },
      {
        timestamp: '2024-03-22T21:37:02.000000',
        diagnostics: [
          {
            name: 'Diagnostic Name 1',
            value: 0.25,
          },
          {
            name: 'Diagnostic Name 2',
            value: 0.75,
          },
        ],
      },
    ],
  },
};
```

Transform Output:
```ts
const transformedData = [
  {
    timestamp: 1711078622000,
    diagnostic_0: 0.25,
    diagnostic_1: 0.75,
  },
  {
    timestamp: 1711165022000,
    diagnostic_0: 0.25,
    diagnostic_1: 0.75,
  }
];
```

Describe Output:
```ts
const describedData = {
  color: 'pink',
  contributingPropertiesTheme: {
    color: ['red', 'white', 'blue'],
  },
  diagnostics: [
    {
      id: 'diagnostic_0',
      name: 'Diagnostic Name 1'
    },
    {
      id: 'diagnostic_1',
      name: 'Diagnostic Name 2'
    }
  ]
};
```
