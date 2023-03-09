import { combineProviders } from './combineProviders';

it('returns provider that does nothing if provided no providers', () => {
  expect(combineProviders([])).toEqual(
    expect.objectContaining({
      unsubscribe: expect.any(Function),
      subscribe: expect.any(Function),
      updateViewport: expect.any(Function),
    })
  );
});

it('returns the provider unchanged if there is only one provider', () => {
  const provider = {
    unsubscribe: () => {},
    subscribe: () => {},
    updateViewport: () => {},
  };

  expect(combineProviders([provider])).toBe(provider);
});
