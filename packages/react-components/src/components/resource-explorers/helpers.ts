import type { CamelCase } from 'type-fest';
import type { Plural } from './types/helpers';

/**
 * Simple plurality handler.
 *
 * @remarks
 * The handler is not comprehensive. Check the implementation and your result
 * to validate.
 */
export function plural<Word extends string = Plural<string>>(
  word: Word
): Plural<Word> {
  const pluralWord: Plural<Word> = (
    word.endsWith('s')
      ? word
      : word.endsWith('y')
      ? `${word.slice(0, -1)}ies`
      : `${word}s`
  ) as Plural<Word>;

  return pluralWord;
}

/**
 * Simple camel case handler.
 *
 * @remarks
 * The handler is not comprehensive. Check the implementation and your result
 * to validate.
 */
export function camelCase<Sentence extends string>(
  sentence: Sentence
): CamelCase<Sentence> {
  const camelCaseSentence: CamelCase<Sentence> = sentence
    .split(' ')
    .map((word, index) => {
      // Return the first word without modification.
      if (index === 0) {
        return word;
      }

      return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
    })
    .join() as CamelCase<Sentence>;

  return camelCaseSentence;
}
