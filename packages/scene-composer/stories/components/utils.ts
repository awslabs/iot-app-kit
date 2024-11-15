import { COMPOSER_FEATURES } from '../../src/interfaces';

export const mapFeatures = (features: COMPOSER_FEATURES[]): object => {
  return Object.values(COMPOSER_FEATURES).reduce((acc, feature) => {
    acc[feature] = features.includes(feature);
    return acc;
  }, {});
};
