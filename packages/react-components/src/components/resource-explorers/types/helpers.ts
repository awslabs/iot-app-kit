export type StringKey<T> = Extract<keyof T, string>;

/** Simple plurality type. */
export type Plural<Word extends string> = Word extends `${infer _}s`
  ? Word
  : Word extends `${infer W}y`
  ? `${W}ies`
  : `${Word}s`;
