import { render } from '@testing-library/react';

import { getGlobalSettings, subscribe } from '../common/GlobalSettings';
import { COMPOSER_FEATURES } from '../interfaces';

import useFeature from './useFeature';

vi.mock('../common/GlobalSettings');

const DummyFeatureComponent = ({ feature }: { feature: string }) => {
  const result = useFeature(feature);
  return <div>{JSON.stringify(result)}</div>;
};

describe('useFeature() hook', () => {
  [true, false].forEach((state) => {
    it(`should render appropriately when state is ${state}`, () => {
      const globalSettingsMock = getGlobalSettings as vi.Mock;
      const subscribeMock = subscribe as vi.Mock;

      globalSettingsMock.mockImplementation(() => ({
        featureConfig: { [COMPOSER_FEATURES[COMPOSER_FEATURES.FOR_TESTS]]: state },
      }));

      subscribeMock.mockImplementation((onUpdated) => onUpdated());

      const { container } = render(<DummyFeatureComponent feature={COMPOSER_FEATURES[COMPOSER_FEATURES.FOR_TESTS]} />);

      expect(container).toMatchSnapshot();
    });
  });
});
