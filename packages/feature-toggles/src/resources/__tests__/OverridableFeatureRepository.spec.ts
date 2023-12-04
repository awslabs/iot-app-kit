import IFeatureRepository from '../IFeatureRepository';
import OverridableFeatureRepository from '../OverridableFeatureRepository';
import Cookies from 'js-cookie';

jest.mock('js-cookie', () => ({
  get: jest.fn(),
}));

const mockFeatureRepository: IFeatureRepository = {
  evaluate: jest.fn(() => Promise.resolve({ variation: 'test', value: 'test' })),
};

describe('OverridableFeatureRepository', () => {
  afterEach(() => {
    (mockFeatureRepository.evaluate as jest.Mock).mockClear();
  });

  it('should fallback to feature repository if override not found', async () => {
    const sut = new OverridableFeatureRepository(mockFeatureRepository);

    const response = await sut.evaluate('test-feature');

    expect(response).toEqual({ variation: 'test', value: 'test' });
    expect(mockFeatureRepository.evaluate).toBeCalledWith('test-feature');
  });

  it('should allow feature overrides via the "experiment" cookie', async () => {
    const cookieString = 'NEW_FEATURE:T1&NEW_FEATURE2:C:17';

    (Cookies.get as jest.Mock).mockImplementation(() => cookieString);

    const sut = new OverridableFeatureRepository(mockFeatureRepository);

    const resultWithoutValue = await sut.evaluate('NEW_FEATURE');
    const resultCaseInsensitive = await sut.evaluate('new_feature');
    const resultWithValue = await sut.evaluate('NEW_FEATURE2');

    expect(Cookies.get).toBeCalledWith('experiment');
    expect(resultWithoutValue).toEqual({ variation: 'T1' });
    expect(resultCaseInsensitive).toEqual(resultWithoutValue);
    expect(resultWithValue).toEqual({ variation: 'C', value: '17' });

    expect(mockFeatureRepository.evaluate).not.toBeCalled(); // Haven't requested any that aren't overriden yet

    const resultNotOverriden = await sut.evaluate('DEFAULT_FEATURE');
    expect(resultNotOverriden).toEqual({ variation: 'test', value: 'test' });
  });

  it('should not fail if no fallback or override exists', async () => {
    const sut = new OverridableFeatureRepository();

    const result = await sut.evaluate('any-feature');

    expect(result).toEqual({});
  });
});
