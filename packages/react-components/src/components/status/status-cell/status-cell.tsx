import React from 'react';
import { DEFAULT_MESSAGE_OVERRIDES } from '../../../utils/dataTypes';
import { Value } from '../../common/value/Value';
import { StatusCellProps } from '../types';
import { highContrastColor } from './highContrastColor';

// TODO: Get exact color used at https://aws-uxdr.invisionapp.com/share/THVZU5CZY5U?redirHash=#/screens/405175804
const DEFAULT_COLOR = '#f1f1f1';

export const StatusCell: React.FC<StatusCellProps> = ({labelsConfig, valueColor, isEnabled, alarmStream, propertyStream, alarmPoint, propertyPoint, breachedThreshold, messageOverrides}) => {
  const { showName, showValue, showUnit } = labelsConfig;
  const backgroundColor = isEnabled && valueColor ? valueColor : DEFAULT_COLOR;

  /** Display Settings. We want to dynamically construct the layout dependent on what information is shown */
  const emphasizeValue = !showValue;
  const emphasizeNameAndUnit = showValue && !showName && !showUnit;

  /** If anything is emphasized, then something is emphasized */
  const somethingIsEmphasized = emphasizeValue || emphasizeNameAndUnit;

  const stream = alarmStream || propertyStream;
  const point = alarmStream ? alarmPoint : propertyPoint;

  const foregroundColor = highContrastColor(backgroundColor);
  return (
    <div
      className="status-cell tooltip-container"
      style={{
        backgroundColor,
        color: foregroundColor,
        justifyContent: somethingIsEmphasized ? 'center' : 'unset',
      }}
    >
      {
        // TODO: Add data-stream-name component if `showName` is true
      }
      {breachedThreshold && breachedThreshold.description != null && (
        <div
          style={{ color: foregroundColor }}
          className={`description ${ emphasizeValue ? 'large' : ''} ${ emphasizeValue ? 'center' : ''}`}
        >
          {breachedThreshold.description}
        </div>
      )}
      {/* {!somethingIsEmphasized && <div className="divider" />} */}
      {showValue && stream && (
        <div className={ emphasizeNameAndUnit ? 'center' : '' }>
          {isEnabled && propertyStream && alarmStream && (
            <div className="secondary">
              <span style={{ color: foregroundColor }}>
                {messageOverrides.liveTimeFrameValueLabel || DEFAULT_MESSAGE_OVERRIDES.liveTimeFrameValueLabel}:{' '}
                <Value
                  value={propertyPoint ? propertyPoint.y : undefined}
                  unit={propertyStream.unit}
                />
              </span>
            </div>
          )}
          <div className={`value ${ emphasizeNameAndUnit ? 'large' : ''}`} style={{ color: foregroundColor }}>
            {
              // TODO: Add chart-icon component
            }
            <Value unit={stream.unit} value={point ? point.y : undefined} isEnabled={isEnabled} />
          </div>
        </div>
      )}
      <div className="hydrated">
        <div className="name hydrated" style={{color: 'black'}}><div className="awsui"><div className="hydrated"><span data-test-tag="expandable-input" data-contenteditable="false" className="sc-expandable-input aws-util-font-size-1 disabled">Torque (KiloNewton Meter)</span></div><div className="data-stream-name-tooltip awsui-util-container awsui" style={{display: 'none'}}><div className="awsui-util-spacing-v-s"><div><div className="awsui-util-label">Car speed</div></div></div></div></div></div>
        <div className="divider"></div>
        <div><div className="secondary"><span style={{color: 'black'}}>Value: 3.3973<span className="unit"> kNm</span></span></div><div className="value" style={{color: 'black'}}></div></div>
      </div>
    </div>
  );
}

export default StatusCell;
