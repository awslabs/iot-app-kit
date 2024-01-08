import { arc } from 'd3-shape';
import { useEffect, useState } from 'react';
import type { DefaultArcObject } from 'd3-shape';

const RADIAN_FULL_CIRCLE = Math.PI * 2;
const RADIAN = RADIAN_FULL_CIRCLE / 360;
const CORNER_RADIUS = 4;

const getArcs = (percent: number) => {
  const flooredPercent = Math.max(0, percent);
  const startAngle1 = RADIAN_FULL_CIRCLE * flooredPercent;
  const startAngle2 = RADIAN_FULL_CIRCLE * (1 - flooredPercent);
  const endAngle1 = startAngle1;
  const endAngle2 = endAngle1 + startAngle2;

  // Arc representing the value (i.e. if percent is 25%, this would be the arc going a 25% of the circle
  const valueArc = arc()
    .cornerRadius(CORNER_RADIUS)
    .startAngle(0)
    .endAngle(endAngle1);
  // The remainder of the arc not representing the value
  const remainingArc = arc()
    .cornerRadius(CORNER_RADIUS)
    .startAngle(endAngle2)
    .endAngle(endAngle1);

  return {
    valueArc,
    remainingArc,
  };
};

export const useArcs = ({
  percent,
  radius,
  lineThickness,
}: {
  percent: number;
  radius: number;
  lineThickness: number;
}) => {
  const [colorRing, setColorRing] = useState('');
  const [defaultRing, setDefaultRing] = useState('');

  /** Compute Arc SVGs */
  useEffect(() => {
    const { valueArc, remainingArc } = getArcs(percent || 0);
    const ringD: DefaultArcObject = {
      innerRadius: radius,
      outerRadius: radius - lineThickness,
      padAngle: RADIAN / 2,
      startAngle: 0,
      endAngle: 0,
    };

    setColorRing(valueArc(ringD) || '');
    setDefaultRing(remainingArc(ringD) || '');
  }, [percent, radius, lineThickness]);

  return { colorRing, defaultRing };
};
