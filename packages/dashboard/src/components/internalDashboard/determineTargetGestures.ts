import { Anchor } from '../../store/actions';
import { DragEvent } from '../grid';

const GESTURE_ATTRIBUTE = 'data-gesture';
const ANCHOR_ATTRIBUTE = 'data-anchor';

type GestureAttribute = 'grid' | 'resize' | 'selection' | 'widget';

export const gestureable = (gesture: GestureAttribute) => ({
  [GESTURE_ATTRIBUTE]: gesture,
});

export const anchorable = (anchor: Anchor) => ({
  [ANCHOR_ATTRIBUTE]: anchor,
});

export const determineTargetGestures = (
  dragEvent: DragEvent
): {
  isOnResizeHandle: boolean;
  isOnWidget: boolean;
  isOnSelection: boolean;
  isUnion: boolean;
  anchor: Anchor | null;
} => {
  const target = dragEvent.target;
  if (!target) {
    throw new Error('Gesture target missing.');
  }

  let isOnResizeHandle = false;
  let isOnWidget = false;
  let isOnSelection = false;
  let anchor: Anchor | null = null;

  let targetElement = target as HTMLElement;
  while ((targetElement.getAttribute(GESTURE_ATTRIBUTE) as GestureAttribute) !== 'grid') {
    const attribute = targetElement.getAttribute(GESTURE_ATTRIBUTE) as GestureAttribute;

    if (attribute === 'resize') {
      isOnResizeHandle = true;
      const anchorAttribute = targetElement.getAttribute(ANCHOR_ATTRIBUTE);
      anchor = anchorAttribute === null ? null : (anchorAttribute as Anchor);
    } else if (attribute === 'selection') {
      isOnSelection = true;
    } else if (attribute === 'widget') {
      isOnWidget = true;
    }

    const parentElement = targetElement.parentElement;
    if (!parentElement) break;
    targetElement = parentElement;
  }

  return {
    isOnResizeHandle,
    isOnWidget,
    isOnSelection,
    isUnion: dragEvent.union,
    anchor,
  };
};
