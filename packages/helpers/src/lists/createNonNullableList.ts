export function createNonNullableList<T>(list: T[]): NonNullable<T>[] {
  return list.filter((item) => item != null);
}
