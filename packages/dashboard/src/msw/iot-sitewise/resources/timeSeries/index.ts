import { TimeSeriesDescriptionFactory } from './TimeSeriesDescriptionFactory';
import { TimeSeriesSummaryFactory } from './TimeSeriesSummaryFactory';

const timeSeriesSummaryFactory = new TimeSeriesSummaryFactory();
const timeSeriesDescriptionFactory = new TimeSeriesDescriptionFactory();

/*
const ASSET_DESCRIPTIONS = Object.values(ASSET_DESCRIPTION_MAP);

export const MODELED_DATA_STREAMS = ASSET_DESCRIPTIONS.flatMap(({ assetId = '', assetProperties = [] }) => {
  const assetProps = assetProperties.map(({ id: propertyId = '' }) => {
    return timeSeriesSummaryFactory.create({
      assetId,
      propertyId,
    });
  });

  return assetProps;
});
*/

const propertyMap = [
  'temperature',
  'humidity',
  'pressure',
  'voltage',
  'current',
  'power',
  'speed',
  'torque',
  'wind-direction',
  'wind-speed',
];

export const UNMODELED_DATA_STREAMS = new Array(10)
  .fill(null)
  .flatMap((_, i) => {
    const timeSeriesSummaries = new Array(100).fill(null).map((_, j) => {
      const alias = `/aws/windfarm/${i}/turbine/${j}/${propertyMap[i]}`;
      const timeSeriesSummary = timeSeriesSummaryFactory.create({ alias });

      return timeSeriesSummary;
    });

    return timeSeriesSummaries;
  });

export const TIME_SERIES_SUMMARIES = [...UNMODELED_DATA_STREAMS];

export const TIME_SERIES_DESCRIPTIONS = TIME_SERIES_SUMMARIES.map(
  (timeSeriesSummary) => {
    const timeSeriesDescription =
      timeSeriesDescriptionFactory.create(timeSeriesSummary);

    return timeSeriesDescription;
  }
);
