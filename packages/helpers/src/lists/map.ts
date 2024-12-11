export const map =
  <A, B = A>(fn: (a: A, index: number) => B) =>
  (as: A[]): B[] =>
    as.map(fn);
