import { getAggregationFrequency } from './aggregationFrequency';

it('returns correct string per resolution', () => {
  expect(getAggregationFrequency()).toEqual('raw data');
  expect(getAggregationFrequency(30000000000, 'minimum')).toEqual(
    '347 days minimum'
  );
  expect(getAggregationFrequency(10000000, 'standard_deviation')).toEqual(
    '2 hours standard deviation'
  );
  expect(getAggregationFrequency(450000, 'sum')).toEqual('7 minutes sum');
  expect(getAggregationFrequency(50000, 'maximum')).toEqual(
    '50 seconds maximum'
  );
  expect(getAggregationFrequency(40, 'other')).toEqual('N/A');
});
