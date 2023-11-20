import { colorPalette } from './colorPalette';
import { Colorizer } from './colorizer';

it('returns colors in a rotation', () => {
  const colorer = Colorizer(['red', 'white', 'blue']);
  expect(colorer.next()).toEqual('red');
  expect(colorer.next()).toEqual('white');
  expect(colorer.next()).toEqual('blue');
});

it('applies colors in a rotation to a colorable object', () => {
  const colorer = Colorizer(['red', 'white', 'blue']);
  expect(colorer.nextApply({})).toEqual({ color: 'red' });
  expect(colorer.nextApply({})).toEqual({ color: 'white' });
  expect(colorer.nextApply({})).toEqual({ color: 'blue' });
});

it('does not repeat colors after 50 rotations', () => {
  const colorer = Colorizer();
  const colors: ReturnType<typeof colorer.next>[] = [];

  const testColor = () => {
    const color = colorer.next();
    expect(color).toBeDefined();
    expect(colors).not.toContain(color);
    colors.push(color);
  };

  for (let i = 0; i < 50; i++) {
    testColor();
  }
});

it('can add a color(s) at the start of the rotation', () => {
  const colorer = Colorizer();

  const color = colorer.next();
  expect(color).toBeDefined();

  const nextColor = colorer.next();
  expect(nextColor).not.toEqual(color);

  // Need to check for typescript purposes
  if (!color || !nextColor) throw new Error('Should not happen.');
  colorer.add(color);

  expect(colorer.next()).toEqual(color);

  colorer.add([nextColor]);

  expect(colorer.next()).toEqual(nextColor);
});

it('can remove a color(s) from the rotation', () => {
  const colors = [...colorPalette];
  let colorer = Colorizer(colors);
  const thirdColorToRemove = colors.at(2);

  // Need to check for typescript purposes
  if (!thirdColorToRemove) throw new Error('Should not happen.');

  colorer.remove(thirdColorToRemove);

  for (let i = 0; i < colorPalette.length - 1; i++) {
    expect(colorer.next()).not.toEqual(thirdColorToRemove);
  }

  colorer = Colorizer(colors);
  // colors 3 - 5
  const colorsToRemove = colors.slice(2, 5);

  colorer.remove(colorsToRemove);

  for (let i = 0; i < colorPalette.length - 3; i++) {
    expect(colorer.next()).not.toEqual(thirdColorToRemove);
  }
});

it('resets the rotation if all colors are removed', () => {
  const palette = ['red', 'white', 'blue'];
  const colorer = Colorizer(palette);
  colorer.remove(palette);

  expect(colorer.next()).toEqual('red');
  expect(colorer.next()).toEqual('white');
  expect(colorer.next()).toEqual('blue');
});

it('starts the rotation over once exhausted', () => {
  const colors = [...colorPalette];
  const colorer = Colorizer(colors);

  const firstColor = colorer.next();

  for (let i = 0; i < colorPalette.length - 1; i++) {
    // exhaust rotation
    colorer.next();
  }

  expect(colorer.next()).toEqual(firstColor);
});
