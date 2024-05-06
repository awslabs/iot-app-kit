export type SupportedLanguages = 'en';

export type Messages<Key extends string, Value extends string = string> = {
  [key in SupportedLanguages]: { [key in Key]: Value };
};
