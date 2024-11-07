import { useCallback, useEffect, useRef, useState } from 'react';
import type * as React from 'react';

import noop from 'lodash/noop';

type HoverCallback = (hovering: boolean, e: MouseEvent) => void;
type HoverOptions = {
  callback: HoverCallback;
  delay?: number;
};

export const useHover = <T extends Element>(
  options?: HoverOptions | HoverCallback
): [React.RefObject<T>, boolean, () => void] => {
  let callback: HoverOptions['callback'] = noop;
  let delay = 0;

  if (typeof options === 'object') {
    callback = options?.callback ?? noop;
    delay = options?.delay ?? 0;
  } else {
    callback = options ?? noop;
  }

  const [timeout, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const cancel = useCallback(() => {
    if (timeout) {
      clearTimeout(timeout);
    }
  }, [timeout]);

  const [value, setValue] = useState(false);
  const ref = useRef<T>(null);
  const setHover = useCallback(
    (hovering: boolean, event: Event) => {
      callback(hovering, event as MouseEvent);
      setValue(hovering);
    },
    [callback, setValue]
  );
  const handleMouseOver = useCallback(
    (e: Event) => {
      if (delay > 0) {
        cancel();
        setTimeoutId(
          setTimeout(() => {
            setHover(true, e);
          }, delay)
        );
      } else {
        setHover(true, e);
      }
    },
    [cancel, delay, setHover]
  );

  const handleMouseLeave = useCallback(
    (e: Event) => {
      if (delay > 0) {
        cancel();
        setTimeoutId(
          setTimeout(() => {
            setHover(false, e);
          }, delay)
        );
      } else {
        setHover(false, e);
      }
    },
    [cancel, delay, setHover]
  );

  useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener('mouseover', handleMouseOver);
      node.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        node.removeEventListener('mouseover', handleMouseOver);
        node.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [options, handleMouseLeave, handleMouseOver]);
  return [ref, value, cancel];
};
