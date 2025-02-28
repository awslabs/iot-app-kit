import { convertMS } from '@iot-app-kit/core';

const aggregateToString = (aggregate: string): string => {
  return aggregate.replace(/_/g, ' ').toLowerCase();
};

export const getAggregationFrequency = (
  dataResolution?: number,
  aggregationType?: string
) => {
  if (!dataResolution || !aggregationType || dataResolution === 0) {
    return 'raw data';
  }

  const { day, hour, minute, seconds } = convertMS(dataResolution);
  const getPlural = (input: number) => (input > 1 ? 's' : '');

  const aggregateString = aggregateToString(aggregationType);

  if (day !== 0) {
    return `${day} day${getPlural(day)} ${aggregateString}`;
  }
  if (hour !== 0) {
    return `${hour} hour${getPlural(hour)} ${aggregateString}`;
  }
  if (minute !== 0) {
    return `${minute} minute${getPlural(minute)} ${aggregateString}`;
  }
  if (seconds !== 0) {
    return `${seconds} second${getPlural(seconds)} ${aggregateString}`;
  }

  return 'N/A';
};
