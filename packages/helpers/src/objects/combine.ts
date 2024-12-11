import merge from 'lodash-es/merge';
import { copy } from './copy';

export const combine =
  <A, B>(a: A) =>
  (b: B): A & B =>
    merge(copy(a), copy(b));
