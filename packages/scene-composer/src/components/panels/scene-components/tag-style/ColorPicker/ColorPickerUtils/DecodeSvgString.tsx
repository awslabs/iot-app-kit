import React from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import { useSvgParser } from './useSvgParser';

interface IConvertComponentProps {
  iconString: string;
  selectedColor: string;
  customIcon?: IconDefinition;
  width?: string;
  height?: string;
}

export const DecodeSvgString = ({
  selectedColor,
  iconString,
  customIcon,
  width,
  height,
}: IConvertComponentProps): JSX.Element => {
  const iconWidth = customIcon?.icon[0];
  const iconHeight = customIcon?.icon[1];
  const decodeCustomIcon = (
    Array.isArray(customIcon?.icon[4]) ? customIcon?.icon[4].join('') : customIcon?.icon[4]
  ) as string;

  const svgCode = useSvgParser({ selectedColor, iconString, decodeCustomIcon, iconWidth, iconHeight });
  return <img src={`data:image/svg+xml;base64,${btoa(svgCode)}`} width={width} height={height} />;
};
