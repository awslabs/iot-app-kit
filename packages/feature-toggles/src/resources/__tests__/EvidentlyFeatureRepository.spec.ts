import Evidently, { ClientConfiguration } from 'aws-sdk/clients/evidently';
import EvidentlyFeatureRepository from '../EvidentlyFeatureRepository';

jest.mock('aws-sdk/clients/evidently');

describe('EvidentlyFeatureRepository', () => {
  it('should evaluate a feature for a given entity', async () => {
    const expectedResult = { variation: 'T1', value: 'DummyValue' };

    const evaluateMock = jest.fn(() =>
      Promise.resolve({
        variation: expectedResult.variation,
        value: {
          stringValue: expectedResult.value,
        },
      } as Evidently.Types.EvaluateFeatureResponse)
    );

    (Evidently as unknown as jest.Mock).mockImplementation(() => ({
      evaluateFeature() {
        return {
          promise: evaluateMock,
        };
      },
    }));

    const project = 'evidently-test-project';
    const options = {} as unknown as ClientConfiguration;

    const sut = new EvidentlyFeatureRepository(project, 'entityId', options);

    const result = await sut.evaluate('feature');

    expect(result).toEqual(expectedResult);
  });

  it('should not ping backend more than once for the same feature/entity combo', async () => {
    const expectedResult = { variation: 'T1', value: 'DummyValue' };

    const evaluateMock = jest.fn(() => Promise.resolve(expectedResult));
    (Evidently as unknown as jest.Mock).mockImplementation(() => ({
      evaluateFeature() {
        return {
          promise: evaluateMock,
        };
      },
    }));

    const project = 'evidently-test-project';
    const options = {} as unknown as ClientConfiguration;

    const sut = new EvidentlyFeatureRepository(project, 'entity', options);

    const result1 = await sut.evaluate('FirstFeature');
    const result2 = await sut.evaluate('FirstFeature');

    expect(result1).toEqual(result2);
    expect(evaluateMock).toHaveBeenCalledTimes(1);

    await sut.evaluate('SecondFeature');

    expect(evaluateMock).toHaveBeenCalledTimes(2);
  });
});
