import { useEffect, useRef, useState } from 'react';

const useIsRefreshing = (isRefreshing: boolean, delay: number) => {
  const timeout = useRef<number | null | NodeJS.Timeout>(null);
  const [delayLoading, setDelayLoading] = useState(false);

  useEffect(() => {
    clearTimeout(timeout.current as number);
    if (isRefreshing) {
      timeout.current = setTimeout(() => {
        setDelayLoading(isRefreshing);
      }, delay);
    } else {
      setDelayLoading(false);
    }
    return () => {
      clearTimeout(timeout.current as number);
    };
  }, [isRefreshing, delay]);

  return delayLoading;
};

export default useIsRefreshing;
