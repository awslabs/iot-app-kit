import { QueryClient } from '@tanstack/react-query';
import { MINUTE_IN_MS } from '@iot-app-kit/core';

const STALE_TIME = MINUTE_IN_MS * 10;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
    },
  },
});
