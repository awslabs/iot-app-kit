import { useCallback, useState } from 'react';

export function useDialog() {
  const [isVisible, setIsVisible] = useState(false);

  const open = useCallback(() => {
    setIsVisible(true);
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
  }, []);

  return { isVisible, open, close };
}
