import { spaceScaledXs } from '@cloudscape-design/design-tokens';

import {
  XYPlotTooltipDatastream,
  type XYPlotTooltipDatastreamOptions,
} from './datastream';
import { type ChartAlarms, type ChartDataQuality } from '../../types';

const gridStyles = {
  display: 'grid',
  gridTemplateColumns: '1fr max-content',
  gap: spaceScaledXs,
};

export type IdentifiableDataStreamOptions = XYPlotTooltipDatastreamOptions & {
  id: string;
};
export type XYPlotTooltipDatastreamsOptions = {
  datastreams: IdentifiableDataStreamOptions[];
} & ChartDataQuality &
  ChartAlarms;
export const XYPlotTooltipDatastreams = ({
  datastreams,
  showBadDataIcons,
  showUncertainDataIcons,
  showAlarmIcons,
}: XYPlotTooltipDatastreamsOptions) => {
  return (
    <div style={gridStyles}>
      {datastreams.map((s) => (
        <XYPlotTooltipDatastream
          key={s.id}
          {...s}
          showBadDataIcons={showBadDataIcons}
          showUncertainDataIcons={showUncertainDataIcons}
          showAlarmIcons={showAlarmIcons}
        />
      ))}
    </div>
  );
};
