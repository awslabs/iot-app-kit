import React from 'react';
import { ColorConfigurations } from './constants';
import { useArcs } from './useArcs';
import type { DialSettings } from './types';

const NO_VALUE_PRESENT = '-';

const RADIUS = 138;
const UNIT_SPACE = 4;

export const DialSvg = ({
  percent = 0,
  value,
  color,
  label,
  unit,
  isLoading,
  settings,
}: {
  percent?: number;
  isLoading: boolean;
  color: string; // hex color string
  value?: string;
  label?: string;
  unit?: string;
  settings: Required<DialSettings>;
}) => {
  const { defaultRing, colorRing } = useArcs({
    percent,
    lineThickness: settings.dialThickness,
    radius: RADIUS,
  });
  const displayLabel = label != null && label != '' && !isLoading;
  const displayValue = !isLoading && value != null && value !== '';

  const valueLength =
    (value != null ? value.length : 0) + (unit != null ? unit.length : 0);
  const valueFontSize =
    value != null
      ? Math.min(
          settings.fontSize,
          Math.floor((2 * (RADIUS - settings.dialThickness)) / valueLength) *
            1.6
        )
      : settings.fontSize;
  return (
    <svg
      width='100%'
      height='100%'
      viewBox={`0 0 ${RADIUS * 2} ${RADIUS * 2}`}
      preserveAspectRatio='xMidYMin meet'
    >
      <g transform={`matrix(1,0,0,1,${RADIUS},${RADIUS})`}>
        <path
          d={defaultRing}
          fill={ColorConfigurations.GRAY}
          stroke={ColorConfigurations.WHITE}
          strokeLinejoin='round'
        />
        <path
          d={colorRing}
          fill={color}
          stroke={ColorConfigurations.WHITE}
          strokeLinejoin='round'
        />
      </g>
      {displayValue && (
        <text
          y={displayLabel ? '50%' : '55%'}
          x='50%'
          textAnchor='middle'
          fontWeight='bold'
          fontSize={valueFontSize}
        >
          <tspan>
            {value}
            {unit && (
              <tspan
                fontSize={Math.min(settings.unitFontSize, valueFontSize)}
                dx={UNIT_SPACE}
              >
                {unit}
              </tspan>
            )}
          </tspan>
        </text>
      )}
      {isLoading && (
        <text
          data-testid='loading'
          y='55%'
          x='50%'
          textAnchor='middle'
          fontWeight='bold'
          fontSize={settings.fontSize}
        >
          Loading
        </text>
      )}
      {!displayValue && !isLoading && (
        <text
          y='50%'
          x='50%'
          textAnchor='middle'
          fontWeight='bold'
          fontSize={settings.fontSize}
          fill={ColorConfigurations.SECONDARY_TEXT}
        >
          {NO_VALUE_PRESENT}
        </text>
      )}
      {displayLabel && (
        <text
          x='50%'
          y='65%'
          textAnchor='middle'
          fontWeight='bold'
          fontSize={settings.labelFontSize}
          fill={color}
        >
          {label}
        </text>
      )}
    </svg>
  );
};
