export function createNonNullableList<T extends U | undefined, U>(
  list: T[]
): NonNullable<T>[] {
  return list.filter<NonNullable<T>>(
    (item): item is NonNullable<typeof item> => item != null
  );
}
