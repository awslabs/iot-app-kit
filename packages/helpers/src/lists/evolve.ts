import { pipe } from '#functions/pipe';
import { combine } from './combine';
import { map } from './map';

export const evolve =
  <A>(fn: (a: A) => Partial<A>) =>
  (as: A[]): A[] =>
    pipe(map(fn), combine(as))(as);
