import { useState, useEffect } from 'react';

import { traverseSvg } from './SvgParserHelper';

interface IConvertComponentProps {
  selectedColor: string;
  iconString: string;
  width?: string;
  height?: string;
}

export const useSvgParser = ({ selectedColor, iconString, width, height }: IConvertComponentProps) => {
  const [svgCode, setSvgCode] = useState<string>('');

  useEffect(() => {
    try {
      const decodeBase64 = (str: string) => {
        if (typeof atob === 'function') {
          return atob(str);
        } else {
          return Buffer.from(str, 'base64').toString('binary');
        }
      };

      // Extract the SVG element from the base64 encoded string
      const svgString = decodeBase64(iconString!);
      const parser = new DOMParser();
      const svgDocument = parser.parseFromString(svgString, 'image/svg+xml');
      const svgRoot = svgDocument.documentElement;

      traverseSvg(svgRoot, selectedColor);
      const modifiedSvg = svgRoot.outerHTML;
      if (!svgRoot) {
        throw new Error('Invalid SVG string');
      }
      setSvgCode(modifiedSvg);
    } catch (error) {
      console.error('Error parsing SVG', error);
    }
  }, [selectedColor, iconString]);

  return { svgCode, width, height };
};
