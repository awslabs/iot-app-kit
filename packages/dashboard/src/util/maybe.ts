// https://engineering.dollarshaveclub.com/typescript-maybe-type-and-module-627506ecc5c8

/**
 * This is used inside the useSelection / useProperty hook. It wraps the property value
 * returned from useProperty. This is required because that property value is one that
 * represents the entire selection. If the selection only contains 1 widget, the
 * property value will be that widget's property value. If the selection contains more
 * than one widget, the property value will be defined if all widgets in the selection
 * agree on one value. If they don't all share the same value, it is an indeterminant
 * value and will be represented as None.
 */

/**
 * used for discriminant property in a Maybe
 */
enum MaybeType {
  Just = 'maybe-type__just',
  Nothing = 'maybe-type__nothing',
}

export interface Just<T> {
  type: typeof MaybeType.Just;
  value: T;
}

export interface Nothing {
  type: typeof MaybeType.Nothing;
}

// define a value within a context of possible absence/nonexistence
export type Maybe<T> = Just<T> | Nothing;

// represents absence/nonexistence in a Maybe
export const Nothing = (): Nothing => ({
  type: MaybeType.Nothing,
});

// represents value in a Maybe
export const Just = <T>(value: T): Just<T> => ({
  type: MaybeType.Just,
  value,
});

/**
 * Checks if a maybe has a value and casts to Just type
 */
export const isJust = <T>(m: Maybe<T>): m is Just<T> =>
  m.type === MaybeType.Just;

/**
 * Gets the value of a maybe type or a default value
 */
export const maybeWithDefault = <T>(defaultVal: T, m: Maybe<T>): T => {
  switch (m.type) {
    case MaybeType.Nothing:
      return defaultVal;
    case MaybeType.Just:
      return m.value;
  }
};
