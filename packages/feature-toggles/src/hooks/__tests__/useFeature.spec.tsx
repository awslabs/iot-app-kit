/**
 * @jest-environment jsdom
 */
import { render, waitFor } from '@testing-library/react';
import React, { useContext } from 'react';
import useFeature from '../useFeature';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}));

const FeatureToggledComponent = () => {
  const [testFeature, featureLoading] = useFeature('TestFeature');

  return (
    <div data-testid='feature-toggle-component' data-loading={featureLoading}>
      {JSON.stringify(testFeature)}
    </div>
  );
};

describe('useFeature', () => {
  it('it should fetch feature when initialized', async () => {
    const mockFeature = { variation: 'Test', value: 'TestValue' };
    const getFeatureMock = jest.fn(
      () =>
        new Promise((res) => {
          setTimeout(() => res(mockFeature), 50);
        })
    );

    (useContext as jest.Mock).mockImplementation(() => ({
      getFeature: getFeatureMock,
    }));

    const { getByTestId } = render(<FeatureToggledComponent />);
    const sut = getByTestId('feature-toggle-component');

    await waitFor(() =>
      expect(sut.getAttribute('data-loading')).toEqual('true')
    );
    await waitFor(() =>
      expect(sut.textContent).toEqual(JSON.stringify(mockFeature))
    );
    await waitFor(() =>
      expect(sut.getAttribute('data-loading')).toEqual('false')
    );
  });
});
