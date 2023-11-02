export class DescribeTimeSeriesCacheKeyFactory {
  constructor() {}

  create(alias?: string) {
    const cacheKey = [{ resource: 'describe time series', alias }] as const;
    return cacheKey;
  }
}
