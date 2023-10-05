import { type TimeSeriesSummary } from '@aws-sdk/client-iotsitewise';
import { v4 as uuid } from 'uuid';

type AssociatedTimeSeriesSummary = TimeSeriesSummary & Required<Pick<TimeSeriesSummary, 'assetId' | 'propertyId'>>;
type DisassociatedTimeSeriesSummary = Omit<TimeSeriesSummary, 'assetId' | 'propertyId'> &
  Required<Pick<TimeSeriesSummary, 'alias'>>;

type PartialAssociatedTimeSeriesSummary = Partial<AssociatedTimeSeriesSummary> &
  Required<Pick<AssociatedTimeSeriesSummary, 'assetId' | 'propertyId'>>;

type PartialDisassociatedTimeSeriesSummary = Partial<DisassociatedTimeSeriesSummary> &
  Required<Pick<DisassociatedTimeSeriesSummary, 'alias'>>;

function isAssociatedTimeSeriesSummary(
  timeSeriesSummary: PartialAssociatedTimeSeriesSummary | PartialDisassociatedTimeSeriesSummary
): timeSeriesSummary is PartialAssociatedTimeSeriesSummary {
  return 'assetId' in timeSeriesSummary && 'propertyId' in timeSeriesSummary;
}

export class TimeSeriesSummaryFactory {
  public create(
    partialSummary: PartialAssociatedTimeSeriesSummary | PartialDisassociatedTimeSeriesSummary
  ): AssociatedTimeSeriesSummary | DisassociatedTimeSeriesSummary {
    const timeSeriesSummary = isAssociatedTimeSeriesSummary(partialSummary)
      ? this.#createAssociatedTimeSeriesSummary(partialSummary)
      : this.#createDisassociatedTimeSeriesSummary(partialSummary);

    return timeSeriesSummary;
  }

  #createAssociatedTimeSeriesSummary(
    partialAssociatedSummary: PartialAssociatedTimeSeriesSummary
  ): AssociatedTimeSeriesSummary {
    const associatedTimeSeriesSummary = {
      ...this.#createDefaults(),
      ...partialAssociatedSummary,
    };

    return associatedTimeSeriesSummary;
  }

  #createDisassociatedTimeSeriesSummary(
    partialDisassociatedSummary: PartialDisassociatedTimeSeriesSummary
  ): DisassociatedTimeSeriesSummary {
    const disassociatedTimeSeriesSummary = {
      ...this.#createDefaults(),
      ...partialDisassociatedSummary,
    };

    return disassociatedTimeSeriesSummary;
  }

  #createDefaults() {
    const timeSeriesId = uuid();
    const timeSeriesArn = `arn:aws:iotsitewise:us-east-1:123456789012:time-series/${timeSeriesId}`;
    const timeSeriesCreationDate = new Date();
    const timeSeriesLastUpdateDate = new Date();
    const dataType = 'DOUBLE';
    const defaults = { timeSeriesArn, timeSeriesId, timeSeriesCreationDate, timeSeriesLastUpdateDate, dataType };

    return defaults;
  }
}
