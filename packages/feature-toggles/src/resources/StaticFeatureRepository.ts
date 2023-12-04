import IFeature from '../models/feature';
import IFeatureRepository from './IFeatureRepository';

export type StaticFeatures = { [key: string]: IFeature };

export default class StaticFeatureRepository implements IFeatureRepository {
  constructor(private features: StaticFeatures) {}

  async evaluate(feature: string): Promise<IFeature> {
    const featureData = this.features[feature] || {};
    return featureData;
  }
}
