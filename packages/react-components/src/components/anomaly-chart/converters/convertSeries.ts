import { ANOMALY_BAR_SERIES_CONFIGURATION } from '../constants';
import { type ConfigurationOptions } from '../hooks/types';

export const convertSeries = ({
  description,
}: Pick<ConfigurationOptions, 'description'>) => {
  if (!description) return [];

  return description.diagnostics.map((d) => ({
    ...ANOMALY_BAR_SERIES_CONFIGURATION,
    id: d.id,
    name: d.name,
    encode: {
      x: 'timestamp',
      y: d.id,
    },
  }));
};
