import type { StringKeyOf, ValueOf } from 'type-fest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Entry<T> = [StringKeyOf<T>, ValueOf<T>];

export type FromEntry<E> = E extends Entry<infer T> ? T : never;

export function toEntries<T>(t: T): Entry<T>[] {
  return Object.entries(t as object) as Entry<T>[];
}

export function fromEntries<T>(entries: Entry<T>[]): FromEntry<Entry<T>> {
  return Object.fromEntries(entries) as FromEntry<Entry<T>>;
}
