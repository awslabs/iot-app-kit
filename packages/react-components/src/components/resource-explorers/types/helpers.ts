export type First<T> = T extends [infer T] ? T : never;
