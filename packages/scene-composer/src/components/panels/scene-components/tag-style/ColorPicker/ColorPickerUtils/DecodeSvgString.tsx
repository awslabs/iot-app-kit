import React from 'react';

import { useSvgParser } from './useSvgParser';

interface IConvertComponentProps {
  selectedColor: string;
  iconString: string;
  width?: string;
  height?: string;
}

export const DecodeSvgString = ({ selectedColor, iconString, width, height }: IConvertComponentProps) => {
  const { svgCode } = useSvgParser({ selectedColor, iconString, width, height });
  return <img src={`data:image/svg+xml;base64,${btoa(svgCode)}`} width={width} height={height} />;
};
