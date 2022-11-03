import { DragEvent } from '../grid';

const ATTRIBUTE = 'data-gesture';

type GestureAttribute = 'grid' | 'resize' | 'selection' | 'widget';

export const gestureable = (gesture: GestureAttribute) => ({
  [ATTRIBUTE]: gesture,
});

export const determineTargetGestures = (
  dragEvent: DragEvent
): {
  isOnResizeHandle: boolean;
  isOnWidget: boolean;
  isOnSelection: boolean;
} => {
  const target = dragEvent.target;
  if (!target) {
    throw new Error('Gesture target missing.');
  }

  let isOnResizeHandle = false;
  let isOnWidget = false;
  let isOnSelection = false;

  let targetElement = target as HTMLElement;
  while ((targetElement.getAttribute(ATTRIBUTE) as GestureAttribute) !== 'grid') {
    const attribute = targetElement.getAttribute(ATTRIBUTE) as GestureAttribute;

    if (attribute === 'resize') isOnResizeHandle = true;
    else if (attribute === 'selection') isOnSelection = true;
    else if (attribute === 'widget') isOnWidget = true;

    const parentElement = targetElement.parentElement;
    if (!parentElement) break;
    targetElement = parentElement;
  }

  return {
    isOnResizeHandle,
    isOnWidget,
    isOnSelection,
  };
};
