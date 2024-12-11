/** Transform one object into another. */
export const map =
  <A, B>(fn: (a: A) => B) =>
  (a: A): B =>
    fn(a);
