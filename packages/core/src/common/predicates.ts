import { DATA_TYPE } from '../common/constants';
import type { DataStream, DataType } from '../data-module/types';
import type {
  DurationViewport,
  HistoricalViewport,
  Viewport,
} from '../data-module/data-cache/requestTypes';

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

// As of now, we only check if the current component supports string or not.
export const isSupportedDataType =
  (supportsString: boolean) =>
  ({ dataType }: { dataType: DataType }) =>
    (supportsString && dataType === DATA_TYPE.STRING) ||
    dataType !== DATA_TYPE.STRING;

export const isNumberDataStream = (
  stream: DataStream
): stream is DataStream<number> => stream.dataType === DATA_TYPE.NUMBER;

export const isNumber = <T>(val: T | number): val is number =>
  typeof val === 'number';

export const isHistoricalViewport = (
  viewport: Viewport
): viewport is HistoricalViewport => 'start' in viewport && 'end' in viewport;

export const isDurationViewport = (
  viewport: Viewport
): viewport is DurationViewport => 'duration' in viewport;
