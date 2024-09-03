import { CSSProperties } from 'react';

const MIN_WIDTH = 300;
const MAX_WIDTH = 500;
/***
 * Calculate available space in the right, left and bottom to display the results.
 */
export const calculatePanelPosition = (
  actionPanel: Element,
  actionPosition: string
): CSSProperties => {
  const actionPanelDimensions = actionPanel.getBoundingClientRect();

  let position = 'bottom';
  const rightSpace = window.innerWidth - (actionPanelDimensions?.right ?? 0);
  const leftSpace = (actionPanelDimensions?.left ?? 0) - MIN_WIDTH;

  if (rightSpace > MIN_WIDTH) {
    position = 'right';
  } else if (leftSpace > 0) {
    position = 'left';
  }

  switch (position) {
    case 'right': {
      return {
        left: `${
          actionPosition === 'topRight'
            ? actionPanelDimensions?.width
            : actionPanelDimensions?.right ?? 0
        }px`,
        width: 'auto',
        height: 'auto',
      };
    }
    case 'left': {
      let leftPos = (actionPanelDimensions?.left || 0) - MAX_WIDTH;
      let width = MAX_WIDTH;
      if (leftPos < 0) {
        width = MIN_WIDTH;
      }
      return {
        left: `${width * -1}px`,
        width: `${width}px`,
      };
    }
    case 'bottom': {
      return {
        top: `${actionPanelDimensions?.bottom ?? 0}px`,
        height: 'auto',
        width: `${actionPanelDimensions?.width}px`,
      };
    }
  }

  return {};
};
