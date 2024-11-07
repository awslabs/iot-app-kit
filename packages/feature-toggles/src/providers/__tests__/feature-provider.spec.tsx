/**
 * @jest-environment jsdom
 */
import { useState, useContext, useEffect } from 'react';
import { type IFeature } from '../..';
import featureContext from '../../context/feature-context';
import { render, waitFor } from '@testing-library/react';
import FeatureProvider from '../feature-provider';

const FeatureAwareComponent = () => {
  const [testFeature, setTestFeature] = useState<IFeature>({
    variation: 'C',
    value: 'none',
  });
  const { getFeature } = useContext(featureContext);

  useEffect(() => {
    const doAsync = async () => {
      const featureToggle = await getFeature('TEST_FEATURE');
      setTestFeature(featureToggle);
    };

    doAsync();
  }, [getFeature]);

  return <div>{JSON.stringify(testFeature)}</div>;
};

describe('<FeatureProvider />', () => {
  it('should provide child components a way to check a feature toggle', async () => {
    const expectedContent = { variation: 'T1' };
    const repository = {
      evaluate: jest.fn(() => Promise.resolve(expectedContent)),
    };

    const { container } = render(
      <FeatureProvider repository={repository}>
        <FeatureAwareComponent />
      </FeatureProvider>
    );

    await waitFor(() =>
      expect(container.textContent).toEqual(JSON.stringify(expectedContent))
    );
  });
});
