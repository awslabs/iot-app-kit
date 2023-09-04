import React from 'react';
import { TriangleWidget } from '../types';
import { SVG_STROKE_DASHED, SVG_STROKE_DOTTED, SVG_STROKE_SOLID } from '../constants';
import { useGridSettings } from '~/components/actions/useGridSettings';

const TriangleWidgetComponent: React.FC<TriangleWidget> = (widget) => {
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
      <svg
        width={widthPx}
        height={heightPx}
        viewBox={`0 0 ${widthPx} ${heightPx}`}
        style={fitFull}
        pointerEvents='none'
      >
        {/* {we need halfBorderThickness so that the entire svg is visible} */}
        <polygon
          points={`${halfBorderThickness},${heightPx - halfBorderThickness} ${widthPx / 2},${halfBorderThickness} ${
            widthPx - halfBorderThickness
          },${heightPx - borderThickness / 2}`}
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

export default TriangleWidgetComponent;
