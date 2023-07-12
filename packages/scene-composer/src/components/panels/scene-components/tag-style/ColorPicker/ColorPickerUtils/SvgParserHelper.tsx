import React from 'react';

export const replaceFillAttribute = (element: Element, selectedColor: string) => {
  const tagName = element.tagName.toLowerCase();

  if (tagName === 'ellipse') {
    if (element === undefined || selectedColor === undefined) {
      return;
    } else {
      element.setAttribute('stroke', selectedColor);
    }
  }
  if (tagName === 'circle') {
    if (element === undefined || selectedColor === undefined) {
      return;
    } else {
      element.setAttribute('fill', selectedColor!);
    }
  }
};

export const traverseSvg = (element: Element, selectedColor: string) => {
  replaceFillAttribute(element, selectedColor);
  const children = element.children;
  for (let i = 0; i < children.length; i++) {
    traverseSvg(children[i], selectedColor);
  }
};

export const colorPickerPreviewSvg = (color: string) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 52 52' width='52px' height='52px'>
      <g fill='none' fillRule='evenodd' transform='translate(1 1)'>
        <circle cx='30' cy='20' r='16' fill={color} />
      </g>
    </svg>
  );
};
