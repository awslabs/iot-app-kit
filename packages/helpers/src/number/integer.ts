import type { Tagged, UnwrapTagged, Split } from 'type-fest';

type NumberToString<N extends number> = `${N}`;
type ParseNumber<S extends string> = S extends `${infer N extends number}`
  ? N
  : never;
type RawInteger<N extends number> = ParseNumber<
  Split<NumberToString<N>, '.'>[0]
>;
export type Integer<N extends number = number> = Tagged<
  RawInteger<N>,
  'Integer'
>;

export function integer<N extends number>(n: N): Integer<N> {
  return Math.floor(n) as Integer<N>;
}

export type AsNumber<I extends Integer> = UnwrapTagged<I>;
