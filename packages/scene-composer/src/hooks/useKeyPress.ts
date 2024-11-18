/* istanbul ignore file */
// Credit original Source: https://codesandbox.io/s/rob7b8?file=/src/hooks/useKeyPress.tsx:0-2069

import { useCallback, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';

import { type Key } from './useKeyMap';

function isKey(key: string | number | Key): key is Key {
  return !!(key as Key).key;
}

interface KeyPressArgs {
  enabled?: boolean;
  onKeyPressed?: (delta?: number) => void;
  onKeyDown?: (e: globalThis.KeyboardEvent) => void;
  onKeyUp?: (e: globalThis.KeyboardEvent) => void;
}

const useKeyPress = (
  targetKey: string | number | Key,
  { enabled = true, onKeyPressed: pressMethod, onKeyDown: downMethod, onKeyUp: upMethod }: KeyPressArgs,
): boolean => {
  const target = isKey(targetKey) ? targetKey : ({ key: targetKey } as Key);

  const [keyPressed, setKeyPressed] = useState(false);

  const { modifier } = target;
  const modifierPressed = useCallback(
    ({ altKey, ctrlKey, shiftKey }: Partial<globalThis.KeyboardEvent>) => {
      if (!modifier) return true;

      switch (modifier) {
        case 'ctrl':
          return ctrlKey;
        case 'alt':
          return altKey;
        case 'shift':
          return shiftKey;
        default:
          return false;
      }
    },
    [modifier],
  );

  const downHandler = useCallback(
    (e: globalThis.KeyboardEvent) => {
      if (e.key === target.key && modifierPressed(e)) {
        setKeyPressed(true);
        downMethod?.(e);
      }
    },
    [downMethod, modifierPressed, target.key],
  );

  const upHandler = useCallback(
    (e: globalThis.KeyboardEvent) => {
      if (e.key === target.key) {
        setKeyPressed(false);
        upMethod?.(e);
      }
    },
    [target.key, upMethod],
  );

  useFrame((_s, dt) => {
    if (keyPressed && pressMethod) {
      pressMethod(dt);
    }
  });

  // Add event listeners for keypress
  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', downHandler);
      window.addEventListener('keyup', upHandler);
    } else {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    }
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [enabled]); // We don't pass more than enabled here, because it adds unnecessary event listeners. This ensures we only bind once, and we unbind when disabled.

  return keyPressed;
};

export default useKeyPress;
