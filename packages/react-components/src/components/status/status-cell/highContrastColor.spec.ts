import { highContrastColor } from './highContrastColor';

it('returns white when given invalid color', () => {
  expect(highContrastColor('fake-color')).toBe('white');
});

it('returns white when given black', () => {
  expect(highContrastColor('black')).toBe('white');
});

it('returns black when given white', () => {
  expect(highContrastColor('white')).toBe('black');
});

it('returns white when given hexadecimal red', () => {
  expect(highContrastColor('#ff0000')).toBe('white');
});
