import { useEffect, useState } from 'react';

import { traverseSvg } from './SvgParserHelper';

interface IParseSvgElementProps {
  selectedColor: string;
  iconString: string;
  decodeCustomIcon: string;
  iconWidth?: number;
  iconHeight?: number;
}

export const useSvgParser = ({
  selectedColor,
  iconString,
  decodeCustomIcon,
  iconWidth,
  iconHeight,
}: IParseSvgElementProps): string => {
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

      traverseSvg(svgRoot, selectedColor, decodeCustomIcon, iconWidth || 192, iconHeight || 512);
      const modifiedSvg = svgRoot.outerHTML;
      if (!svgRoot) {
        throw new Error('Invalid SVG string');
      }
      setSvgCode(modifiedSvg);
    } catch (error) {
      console.error('Error parsing SVG', error);
    }
  }, [selectedColor, iconString, decodeCustomIcon, iconWidth, iconHeight]);

  return svgCode;
};
