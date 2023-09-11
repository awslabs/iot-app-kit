/* istanbul ignore file */
export type ModifierKey = 'shift' | 'alt' | 'ctrl';
export type Key = { key: string | number; modifier?: ModifierKey };

export interface KeyMap {
  [category: string]: {
    [feature: string]: string | number | Key;
  };
}

export const defaultKeyMap: KeyMap = {
  movement: {
    forward: 'w',
    forward1: 'ArrowUp',
    backward: 's',
    backward1: 'ArrowDown',
    left: 'a',
    left1: 'ArrowLeft',
    right: 'd',
    right1: 'ArrowRight',
    up: ' ',
    down: 'v',
    doubleUp: 'e',
  },
};
