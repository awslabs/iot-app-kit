import { useRef } from 'react';

export const useTruncate = <T extends HTMLElement>() => {
  const truncateRef = useRef<T | null>(null);
  const truncate = !!(
    truncateRef.current?.scrollWidth &&
    truncateRef.current?.scrollWidth > truncateRef.current?.clientWidth
  );

  return {
    truncateRef,
    truncate,
  };
};
