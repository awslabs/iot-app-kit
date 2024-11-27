import { useEffect } from 'react';
import { worker } from './browser';

export const useWorker = () => {
  useEffect(() => {
    worker.start();

    return () => {
      worker.stop();
    };
  }, []);
};
