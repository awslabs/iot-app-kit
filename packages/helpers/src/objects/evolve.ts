import { combine } from './combine';
import { pipe } from '#functions/pipe';

export const evolve =
  <A>(fn: (a: A) => Partial<A>) =>
  (a: A): A =>
    pipe(fn, combine(a))(a);
