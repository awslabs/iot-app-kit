// import { error } from 'console';
// import React, { useState } from 'react';
// import { useEffect } from 'react';

// interface IConvertComponentProps {
//   selectedColor?: string;
//   iconString?: string;
//   width?: string
//   height?: string
// }
// export const DecodeSvgString = ({ selectedColor, iconString, width, height }: IConvertComponentProps) => {
//   const [svgLoaded, setSvgLoaded] = useState(false);
//   const [svgCode, setSvgCode] = useState('');

//   useEffect(() => {
//       try {
//         const decodeBase64 = (str: string) => {
//       if (typeof atob === 'function') {
//         return atob(str);
//       } else {
//         return Buffer.from(str, 'base64').toString('binary');
//       }
//     }
//         // Extract the SVG element from the base64 encoded string
//         const svgString = decodeBase64(iconString!);
//         const parser = new DOMParser();
//         const svgDocument = parser.parseFromString(svgString, 'image/svg+xml');
//         const svgRoot = svgDocument.documentElement;
//         const replaceFillAttribute = (element: Element) => {
//           element.setAttribute('fill', selectedColor!)
//         }
//           const traverseSvg = (element: Element) => {
//             replaceFillAttribute(element);
//             const children = element.children;
//             for (let i = 0; i < children.length; i++) {
//               traverseSvg(children[i])
//             }
//           }
//         traverseSvg(svgRoot)
//         const modifiedSvg = svgRoot.outerHTML;
//         console.log({ modifiedSvg });
//         if (!svgRoot) {
//           throw new error('invalid svg string');
//         }
//         setSvgCode(modifiedSvg)
//       } catch (error) {
//         console.error('Error parsing SVG', error);
//       }
//     }
//   , [selectedColor, iconString]);

//   useEffect(() => {
//     setSvgLoaded(true);
//   });
//   return <img src={`data:image/svg+xml;base64,${btoa(svgCode)}`} width={width} height={height} />;
// };

import React from 'react';
import { useSvgParser } from './useSvgParser';

interface IConvertComponentProps {
  selectedColor: string;
  iconString: string;
  width: string;
  height: string;
  // onIconChange: (chosenColor: string) => void;
}

export const DecodeSvgString = ({ selectedColor, iconString, width, height }: IConvertComponentProps) => {
  const { svgCode } = useSvgParser({ selectedColor, iconString, width, height });
  return <img src={`data:image/svg+xml;base64,${btoa(svgCode)}`} width={width} height={height} />;
};