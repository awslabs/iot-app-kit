import StaticFeatureRepository, { StaticFeatures } from '../StaticFeatureRepository';
describe('StaticFeatureRepository', () => {
  it('should respond with value true for available feature', async () => {
    const features: StaticFeatures = {
      'test-feature': {
        value: true,
        variation: 'T1',
      },
    };

    const sut = new StaticFeatureRepository(features);

    const response = await sut.evaluate('test-feature');

    expect(response).toEqual({ value: true, variation: 'T1' });
  });

  it('should repond with value false for unavailable feature', async () => {
    const features: StaticFeatures = {
      'test-feature': {
        value: true,
        variation: 'T1',
      },
    };
    const sut = new StaticFeatureRepository(features);

    const response = await sut.evaluate('other-feature');

    expect(response).toEqual({});
  });
});
