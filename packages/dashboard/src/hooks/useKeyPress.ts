import { useCallback, useEffect, useRef, useState } from 'react';
import isHotkey from 'is-hotkey';

type KeyPressCallback = (e: KeyboardEvent) => void;
type KeyPressOptions = {
  callback?: KeyPressCallback;
  filter?: (e: KeyboardEvent) => boolean;
};

/**
 * Keyboard press handler
 * @param  {string} key filter for which keyboard combination will trigger a change. Key match defined by this library - https://github.com/ianstormtaylor/is-hotkey
 * @param  {(pressed: boolean, e: KeyboardEvent) => void} [callback] Triggered if the key is pressed.
 * @return {boolean} whether or not the key is pressed
 */
export const useKeyPress = (key: string, options?: KeyPressOptions | KeyPressCallback) => {
  let callback: KeyPressOptions['callback'] = undefined;
  let filter: KeyPressOptions['filter'] = () => true;

  if (typeof options === 'object') {
    callback = options?.callback;
    filter = options?.filter;
  } else {
    callback = options;
  }

  const callbackRef = useRef<KeyPressCallback | undefined>(undefined);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const callbackWrapper = useCallback((e: KeyboardEvent) => {
    if (callbackRef.current) {
      callbackRef.current(e);
    }
  }, []);

  const [keyPressed, setKeyPressed] = useState<boolean>(false);

  const onKeyPress = (e: KeyboardEvent) => {
    const keyPressed =
      e.type === 'keydown' &&
      key
        .split(',')
        .map((k) => k.trim())
        .some((k) => isHotkey(k, e));
    setKeyPressed(keyPressed);

    if (keyPressed && callback && filter && filter(e)) {
      callbackWrapper(e);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', onKeyPress);
    window.addEventListener('keyup', onKeyPress);
    return () => {
      window.removeEventListener('keydown', onKeyPress);
      window.removeEventListener('keyup', onKeyPress);
    };
  }, []);

  return keyPressed;
};
