import { convertMS } from '../../utils/time';

export const getAggregationFrequency = (dataResolution: number, aggregatedLevel: string) => {
  if (dataResolution === 0) {
    return 'raw data';
  }

  const { day, hour, minute, seconds } = convertMS(dataResolution);
  const getPlural = (input: number) => (input > 1 ? 's' : '');

  if (day !== 0) {
    return `${day} day${getPlural(day)} ${aggregatedLevel}`;
  }
  if (hour !== 0) {
    return `${hour} hour${getPlural(hour)} ${aggregatedLevel}`;
  }
  if (minute !== 0) {
    return `${minute} minute${getPlural(minute)} ${aggregatedLevel}`;
  }
  if (seconds !== 0) {
    return `${seconds} second${getPlural(seconds)} ${aggregatedLevel}`;
  }

  return 'N/A';
};

/**
 * Updated name value and it's associated data stream id
 *
 * Used to represent unpersisted editing state.
 */
export type NameValue = { id: string; name: string };
