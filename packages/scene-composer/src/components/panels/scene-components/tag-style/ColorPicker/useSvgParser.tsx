import { useState, useEffect } from 'react';

interface IConvertComponentProps {
  selectedColor: string;
  iconString: string;
  width?: string;
  height?: string;
  // onIconChange: (chosenColor: string) => void;
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

      const replaceFillAttribute = (element: Element) => {
        const tagName = element.tagName.toLowerCase();

        if (tagName === 'ellipse') {
          if (element === undefined) {
            return;
          } else {
            element.setAttribute('stroke', selectedColor);
            // onIconChange(selectedColor);
          }
        }
        if (tagName === 'circle') {
          if (element === undefined) {
            return;
          } else {
            element.setAttribute('stroke', selectedColor);
            // onIconChange(selectedColor);
          }
        }
      };

      const traverseSvg = (element: Element) => {
        replaceFillAttribute(element);
        const children = element.children;
        for (let i = 0; i < children.length; i++) {
          traverseSvg(children[i]);
        }
      };

      traverseSvg(svgRoot);
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
