import type { Position } from '~/types';

/**
 * Closure for tracking a position
 *
 * used in the grid for keeping track of gesture positions
 * and the delta between them
 */
const trackPosition = (defaultPosition: Position) => {
  let position = defaultPosition;

  return {
    getPosition: () => position,
    setPosition: (newPosition: Position) => {
      position = newPosition;
    },
  };
};

export const defaultDelta = { x: 0, y: 0 };

export const deltaTracker = trackPosition(defaultDelta);
export const startTracker = trackPosition(defaultDelta);
export const endTracker = trackPosition(defaultDelta);
