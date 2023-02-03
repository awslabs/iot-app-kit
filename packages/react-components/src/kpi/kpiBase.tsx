import React from 'react';
import './kpi.css';
import { Threshold } from '../common/thresholdTypes';
import { DataPoint, DataStream } from '../common/dataTypes';
import { DEFAULT_FONT_COLOR, FONT_SIZE, ICON_SIZE } from './constants';
import { POINT_TYPE } from '../common/constants';

import '../styles/awsui.css';
import '../styles/globals.css';
import '../styles/variables.css';
import '../styles/tippy-overrides.css';

import { LoadingSpinner } from '../shared-components/LoadingSpinner/LoadingSpinner';
import { DataStreamName } from '../shared-components/DataStreamName/DataStreamName';
import { ErrorBadge } from '../shared-components/ErrorBadge/ErrorBadge';
import { Value } from '../shared-components/Value/Value';
import { StatusIcon } from '../shared-components/StatusIcon/StatusIcon';

export const KpiBase: React.FC<{
  valueColor: string; // hex color string
  breachedThreshold?: Threshold;
  alarmStream?: DataStream;
  alarmPoint?: DataPoint;
  propertyStream?: DataStream;
  propertyPoint?: DataPoint;
  isLoading?: boolean;
}> = ({ breachedThreshold, alarmStream, alarmPoint, propertyStream, propertyPoint, isLoading, valueColor }) => {
  const stream = propertyStream || alarmStream;
  const point = propertyStream ? propertyPoint : alarmPoint;
  const icon = breachedThreshold ? breachedThreshold.icon : undefined;

  if (stream == null) {
    return undefined;
  }

  return (
    <div className="kpi">
      <DataStreamName
        label={stream.name}
        detailedLabel={stream.detailedName}
        pointType={POINT_TYPE.DATA}
        date={point && new Date(point.x)}
      />
      <div className="icon-container">{icon && <StatusIcon name={icon} size={ICON_SIZE} color={valueColor} />}</div>
      <div className="main large">
        {stream.error != null && <ErrorBadge data-testid="warning">{stream.error}</ErrorBadge>}

        {isLoading ? (
          <LoadingSpinner size={FONT_SIZE} />
        ) : (
          <>
            <div
              data-testid="current-value"
              className="value-wrapper"
              style={{ color: valueColor || DEFAULT_FONT_COLOR }}
            >
              <Value value={point ? point.y : undefined} unit={stream.unit} />
            </div>
            {point && <>at {new Date(point.x).toLocaleString()}</>}
          </>
        )}
      </div>
    </div>
  );
};
