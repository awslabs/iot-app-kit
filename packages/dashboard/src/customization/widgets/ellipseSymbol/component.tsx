import React from 'react';
import { EllipseWidget } from '../types';
import { SVG_STROKE_DASHED, SVG_STROKE_DOTTED, SVG_STROKE_SOLID } from '../constants';
import { useGridSettings } from '~/components/actions/useGridSettings';

const EllipseWidgetComponent: React.FC<EllipseWidget> = (widget) => {
  const { borderStyle = 'solid', fill = 'none', borderColor = 'black', borderThickness = 5 } = widget.properties;
  const { cellSize } = useGridSettings();

  let strokeString = SVG_STROKE_SOLID;

  if (borderStyle === 'dashed') {
    strokeString = SVG_STROKE_DASHED;
  } else if (borderStyle === 'dotted') {
    strokeString = SVG_STROKE_DOTTED;
  }

  const widthPx = widget.width * cellSize;
  const heightPx = widget.height * cellSize;

  const fitFull = {
    width: widthPx,
    height: heightPx,
  };

  const halfBorderThickness = borderThickness / 2;

  return (
    <div style={fitFull}>
      <svg viewBox={`0 0 ${widthPx} ${heightPx}`} style={fitFull} pointerEvents='none'>
        <ellipse
          cx={widthPx / 2}
          cy={heightPx / 2}
          rx={widthPx / 2 - halfBorderThickness}
          ry={heightPx / 2 - halfBorderThickness}
          stroke={borderColor}
          strokeWidth={borderThickness}
          stroke-dasharray={strokeString}
          fill={fill}
          vectorEffect='non-scaling-stroke'
        />
      </svg>
    </div>
  );
};

export default EllipseWidgetComponent;
