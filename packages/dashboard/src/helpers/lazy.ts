export function lazy<T>(i: T): () => T {
  return () => i;
}
