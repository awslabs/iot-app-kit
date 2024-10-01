import { TimeSeriesDataQuery } from '@iot-app-kit/source-iotsitewise';

export const getSelectedQueriesAndProperties = (
  timeSeriesQueries: TimeSeriesDataQuery[],
  indexesSelected: number[]
) => {
  const filteredQueries: TimeSeriesDataQuery[] = [];
  let index = 0;

  timeSeriesQueries.forEach((timeSeriesQuery) => {
    if (timeSeriesQuery.query) {
      timeSeriesQuery.query.assets?.forEach((asset) => {
        asset.properties?.forEach((prop) => {
          if (indexesSelected.includes(index)) {
            const query = {
              assets: [
                {
                  ...asset,
                  properties: [prop],
                },
              ],
            };
            filteredQueries.push({
              ...timeSeriesQuery,
              query,
              toQueryString: () =>
                JSON.stringify({
                  source: 'iotsitewise',
                  queryType: 'time-series-data',
                  query,
                }),
            });
          }
          index += 1;
        });
      });
    }
  });

  return filteredQueries;
};
