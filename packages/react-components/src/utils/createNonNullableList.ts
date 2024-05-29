export function createNonNullableList<T extends U | undefined, U>(
  list: T[]
): NonNullable<T>[] {
  return list.filter<NonNullable<T>>(
    (item): item is NonNullable<typeof item> => item != null
  );
}

export const createNonNullableTupleList = <A, B>(
  tuples: [A | undefined, B | undefined][]
): [NonNullable<A>, NonNullable<B>][] => {
  return tuples.filter(
    (
      tuple
    ): tuple is [
      NonNullable<(typeof tuple)[0]>,
      NonNullable<(typeof tuple)[1]>
    ] => {
      return tuple[0] != null && tuple[1] != null;
    }
  );
};
