export const REQUEST_INTERVALS_IN_MS = [
  { start: 0, end: 5000, refetchInterval: 5000, cacheTime: 30000 },
  { start: 0, end: 30000, refetchInterval: 30000, cacheTime: 180000 },
  { start: 0, end: 180000, refetchInterval: 180000, cacheTime: 1080000 },
  { start: 0, end: 1080000, refetchInterval: 1080000, cacheTime: 6480000 },
] as const;
