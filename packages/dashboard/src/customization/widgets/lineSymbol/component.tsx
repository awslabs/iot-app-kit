import React, { CSSProperties } from 'react';
import './component.css';
import { LineWidget } from '~/customization/widgets/types';
import { SVG_STROKE_DASHED, SVG_STROKE_DOTTED, SVG_STROKE_SOLID } from '../constants';
import { LineAnchor } from './lineAnchor/component';
import { useIsSelected } from '~/customization/hooks/useIsSelected';

const ANCHOR_HALF_SIDE_LENGTH_PX = 10;

const LineWidgetComponent: React.FC<LineWidget> = (widget) => {
  const isSelected = useIsSelected(widget);

  const fitFull = {
    width: '100%',
    height: '100%',
  };

  const {
    lineStyle = 'solid',
    color = 'black',
    thickness = 5,
    start = {
      x: 25,
      y: 200,
    },
    end = {
      x: 375,
      y: 200,
    },
  } = widget.properties;

  let strokeString = SVG_STROKE_SOLID;

  if (lineStyle === 'dashed') {
    strokeString = SVG_STROKE_DASHED;
  } else if (lineStyle === 'dotted') {
    strokeString = SVG_STROKE_DOTTED;
  }

  // we need to subtract ANCHOR_HALF_SIDE_LENGTH_PX because otherwise the line ends match the anchors' top-left points
  // whereas we want them to match their centers
  const startAnchorStyle: CSSProperties = {
    position: 'absolute',
    left: `${start.x - ANCHOR_HALF_SIDE_LENGTH_PX}px`,
    top: `${start.y - ANCHOR_HALF_SIDE_LENGTH_PX}px`,
  };

  const endAnchorStyle: CSSProperties = {
    position: 'absolute',
    left: `${end.x - ANCHOR_HALF_SIDE_LENGTH_PX}px`,
    top: `${end.y - ANCHOR_HALF_SIDE_LENGTH_PX}px`,
  };

  return (
    <div className='fit-full'>
      {isSelected && <LineAnchor style={startAnchorStyle} anchorType='start' widget={widget} />}
      <svg style={fitFull} pointerEvents='none'>
        <line
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke={color}
          strokeWidth={thickness}
          stroke-dasharray={strokeString}
        />
      </svg>
      {isSelected && <LineAnchor style={endAnchorStyle} anchorType='end' widget={widget} />}
    </div>
  );
};

export default LineWidgetComponent;
