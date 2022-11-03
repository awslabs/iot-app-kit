import { useEffect, useState } from 'react';

export const useKeyPress = (selector: (event: KeyboardEvent) => boolean) => {
  const [keyPressed, setKeyPressed] = useState<boolean>(false);
  const onKeyDown = (e: KeyboardEvent) => setKeyPressed(selector(e));
  const onKeyUp = (e: KeyboardEvent) => setKeyPressed(selector(e));

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return keyPressed;
};
