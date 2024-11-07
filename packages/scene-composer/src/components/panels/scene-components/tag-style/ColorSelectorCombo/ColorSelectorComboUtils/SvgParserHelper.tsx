import { colors } from '../../../../../../utils/styleUtils';

export const replaceFillAttribute = (
  element: Element,
  selectedColor: string,
  customIcon: string,
  iconWidth?: number,
  iconHeight?: number,
): void => {
  if (element === undefined || selectedColor === undefined) {
    return;
  }
  const tagName = element.tagName.toLowerCase();
  if (tagName === 'ellipse') {
    element.setAttribute('stroke', selectedColor);
  }
  if (tagName === 'circle') {
    element.setAttribute('fill', selectedColor);
  }
  if (tagName === 'path') {
    element.setAttribute('d', customIcon);
    element.setAttribute('fill', colors.infoRingWhite);
  }
  adjustIconSize(element, iconWidth, iconHeight);
};

export const traverseSvg = (
  element: Element,
  selectedColor: string,
  customIcon: string,
  iconWidth?: number,
  iconHeight?: number,
): void => {
  replaceFillAttribute(element, selectedColor, customIcon, iconWidth, iconHeight);
  const children = element.children;
  for (let i = 0; i < children.length; i++) {
    traverseSvg(children[i], selectedColor, customIcon, iconWidth, iconHeight);
  }
};

export const colorPickerPreviewSvg = (color: string): JSX.Element => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 52 52' width='52px' height='52px'>
      <g fill='none' fillRule='evenodd' transform='translate(1 1)'>
        <circle cx='30' cy='20' r='16' fill={color} />
      </g>
    </svg>
  );
};

/**
 * Font-awesome icons varies in width and height. In order for us
 * fit them inside a tag, we need to adjust their width and height.
 * place this part of the path of d sttribute in a svg element.
 * It will find the center position to place the icon
 * Read for more examples - https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
 * @param element
 * @param iconWidth
 * @param iconHeight
 */
function adjustIconSize(element: Element, iconWidth: number | undefined, iconHeight: number | undefined) {
  const gElements = element.getElementsByTagName('g');
  if (gElements.length >= 2) {
    const secondGElement = gElements[1];
    const transformAttr = secondGElement.getAttribute('transform');
    const translateRegex = /translate\(-?\d+(\.\d+)?,\s-?\d+(\.\d+)?\)/g;
    const match = transformAttr?.match(translateRegex);
    if (match && match.length === 1) {
      const newTranslateX = iconWidth || 197;
      const newTranslateY = iconHeight || 519;
      const newTransform = `translate(-${newTranslateX / 2},-${newTranslateY / 2})`;
      const updatedTransformAttr = transformAttr?.replace(translateRegex, newTransform);
      secondGElement.setAttribute('transform', updatedTransformAttr!);
    }
  }
}
