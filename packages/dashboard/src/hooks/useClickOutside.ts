import { useEffect, useRef, useState } from 'react';

type ClickCallback = (e: PointerEvent) => void;

export const useClickOutside = <T extends HTMLElement>(cb: ClickCallback) => {
  const ref = useRef<T>(null);
  const [pointerDown, setPointerDown] = useState<boolean>(false);

  useEffect(() => {
    const handleClickOutside = (event: PointerEvent) => {
      if (pointerDown) {
        setPointerDown(false);
        cb(event);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (
        ref.current &&
        event.target &&
        event.target instanceof Node &&
        !ref.current.contains(event.target)
      ) {
        setPointerDown(true);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointerup', handleClickOutside);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointerup', handleClickOutside);
    };
  }, [pointerDown, cb]);

  return ref;
};
