import React from 'react';
import './DataStreamName.css';
import { POINT_TYPE } from '../../common/constants';

export const DataStreamName: React.FC<{
  pointType: POINT_TYPE;
  label: string;
  detailedLabel?: string;
  date?: Date;
}> = ({ pointType, label, detailedLabel, date }) => (
  <div className="awsui">
    <div className="aws-util-font-size-1">{label}</div>
    <div className="data-stream-name-tooltip awsui-util-container awsui" style={{ display: 'none' }}>
      <div className="awsui-util-spacing-v-s">
        <div>
          <div className="awsui-util-label">{detailedLabel || label}</div>
          {pointType && pointType === POINT_TYPE.TREND && (
            <small>This trend line is computed from only visible data.</small>
          )}
        </div>
        {date && (
          <div>
            <div className="awsui-util-label">Latest value at</div>
            <div>
              {date.toLocaleString('en-US', {
                hour12: true,
                minute: 'numeric',
                hour: 'numeric',
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
