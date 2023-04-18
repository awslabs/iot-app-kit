import { deepFreeze } from './deepFreeze';

it('prevents extensions of an object', () => {
  const obj = deepFreeze({});

  const illegalExtension = () => {
    /**
     * Should prevent extension even if you try to
     * circumvent the type restrictions
     */
    (obj as any)['test'] = 1; // eslint-disable-line
  };

  expect(illegalExtension).toThrowError();
});

it('prevents modifications of an object', () => {
  const obj = deepFreeze({
    nestedObject: {
      value: 1,
    },
  });

  const illegalModification = () => {
    obj.nestedObject.value = 2;
  };

  expect(illegalModification).toThrowError();
});
