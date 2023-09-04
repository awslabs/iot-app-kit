import React from 'react';
import { RectangleWidget } from '../types';
import { SVG_STROKE_DASHED, SVG_STROKE_DOTTED, SVG_STROKE_SOLID } from '../constants';

const RectangleWidgetComponent: React.FC<RectangleWidget> = (widget) => {
  const fitFull = {
    width: '100%',
    height: '100%',
  };

  const { borderStyle = 'solid', fill = 'none', borderColor = 'black', borderThickness = 5 } = widget.properties;

  let strokeString = SVG_STROKE_SOLID;

  if (borderStyle === 'dashed') {
    strokeString = SVG_STROKE_DASHED;
  } else if (borderStyle === 'dotted') {
    strokeString = SVG_STROKE_DOTTED;
  }

  return (
    <div style={fitFull}>
      <svg style={fitFull} pointerEvents='none'>
        <rect
          x={0}
          y={0}
          width='100%'
          height='100%'
          stroke={borderColor}
          strokeWidth={borderThickness}
          stroke-dasharray={strokeString}
          fill={fill}
        />
      </svg>
    </div>
  );
};

export default RectangleWidgetComponent;
