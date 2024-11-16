import { type DataPoint } from '@iot-app-kit/core';
import Icon from '@cloudscape-design/components/icon';
import {
  spaceScaledXxs,
  colorTextStatusWarning,
  colorTextStatusError,
} from '@cloudscape-design/design-tokens';

import { type ChartDataQuality } from '../../types';

const formatQualityInformation = (quality?: DataPoint['quality']) => {
  let icon = null;
  let color = '';
  let description = '';
  switch (quality) {
    case 'BAD':
      color = colorTextStatusError;
      description = '(Bad data quality)';
      icon = <Icon alt={description} name='status-negative' variant='error' />;
      break;
    case 'UNCERTAIN':
      color = colorTextStatusWarning;
      description = '(Uncertain data quality)';
      icon = <Icon alt={description} name='status-warning' variant='warning' />;
      break;
  }
  return {
    icon,
    color,
    description,
  };
};

export type XYPlotTooltipDatastreamNameOptions = {
  name?: string;
  quality?: DataPoint['quality'];
} & ChartDataQuality;

export const XYPlotTooltipDatastreamName = ({
  name,
  quality,
  showBadDataIcons,
  showUncertainDataIcons,
}: XYPlotTooltipDatastreamNameOptions) => {
  if (
    quality == null ||
    quality === 'GOOD' ||
    (quality === 'BAD' && !showBadDataIcons) ||
    (quality === 'UNCERTAIN' && !showUncertainDataIcons)
  )
    return <span>{name}</span>;

  const { icon, color, description } = formatQualityInformation(quality);

  return (
    <span style={{ display: 'flex', flexWrap: 'nowrap', gap: spaceScaledXxs }}>
      <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
      {name}
      <span style={{ color }}>{description}</span>
    </span>
  );
};
