import React from 'react';
import { ShapeWidget } from '../../types';
import { SVG_STROKE_DASHED, SVG_STROKE_DOTTED, SVG_STROKE_SOLID } from '../../constants';
import { useSizeInPixels } from '../useSizeInPixels';

const TriangleWidgetComponent: React.FC<ShapeWidget> = (widget) => {
  const { borderStyle = 'solid', fill = 'none', borderColor = 'black', borderThickness = 5 } = widget.properties;

  let strokeString = SVG_STROKE_SOLID;

  if (borderStyle === 'dashed') {
    strokeString = SVG_STROKE_DASHED;
  } else if (borderStyle === 'dotted') {
    strokeString = SVG_STROKE_DOTTED;
  }

  const { widthPx, heightPx } = useSizeInPixels(widget.width, widget.height);

  const fitFull = {
    width: widthPx,
    height: heightPx,
  };

  return (
    <div style={fitFull}>
      <svg
        width={widthPx}
        height={heightPx}
        viewBox={`0 0 ${widthPx} ${heightPx}`}
        style={fitFull}
        pointerEvents='none'
      >
        {/* {we need borderThickness so that the entire svg is visible} */}
        <polygon
          points={`${borderThickness},${heightPx - borderThickness} ${widthPx / 2},${borderThickness} ${
            widthPx - borderThickness
          },${heightPx - borderThickness}`}
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
