import { DATA_TYPE } from '@iot-app-kit/core';
import type { DataStream } from '@iot-app-kit/core';

/**
 * Predicate Utilities
 *
 * A place for generic predicates. Useful when needing predicates which play nicely
 * with typescript, or other non-trivial predicate logic.
 *
 * Providing smart predicates with built in type guards can give us stronger typing in our business logic.
 * https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types
 *
 * Example:
 *
 * Without Type Guards (to be avoided):
 * ```
 * const maybeItems : (Item | null)[] = SOME_MAYBE_ITEMS;
 * const items: Item[] = maybeItems.filter(x => x != null) as Item[];
 * ```
 *
 * With Type Guards:
 * ```
 * const maybeItems : (Item | null)[] = SOME_MAYBE_ITEMS;
 * const items: Item[] = maybeItems.filter(isDefined);
 * ```
 *
 * No type casting necessary :-) all you have to do is trust that the shared predicate properly
 * type guards.
 *
 */

export const isDefined = <T>(value: T | null | undefined): value is T =>
  value != null;

export const isValid =
  <T>(predicate: (t: Partial<T>) => boolean) =>
  (t: Partial<T>): t is T =>
    predicate(t);

export const isNumberDataStream = (
  stream: DataStream
): stream is DataStream<number> => stream.dataType === DATA_TYPE.NUMBER;

export const isNumber = <T>(val: T | number): val is number =>
  typeof val === 'number';
