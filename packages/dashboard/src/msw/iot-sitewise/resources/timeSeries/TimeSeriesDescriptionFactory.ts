import { type DescribeTimeSeriesResponse } from '@aws-sdk/client-iotsitewise';
import { TimeSeriesSummaryFactory } from './TimeSeriesSummaryFactory';

type TimeSeriesDescription = DescribeTimeSeriesResponse;

export class TimeSeriesDescriptionFactory {
  readonly #timeSeriesSummaryFactory = new TimeSeriesSummaryFactory();

  public create(partialDescription: Parameters<TimeSeriesSummaryFactory['create']>[0]): TimeSeriesDescription {
    const timeSeriesDescription = this.#timeSeriesSummaryFactory.create(partialDescription);

    return timeSeriesDescription;
  }
}
