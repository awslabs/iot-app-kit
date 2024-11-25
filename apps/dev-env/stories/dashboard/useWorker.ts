import { worker } from '@iot-app-kit/data-mocked/browser';
import { useEffect } from 'react';

export const useWorker = () => {
  useEffect(() => {
    worker.start();

    return () => {
      worker.stop();
    };
  }, []);
};
