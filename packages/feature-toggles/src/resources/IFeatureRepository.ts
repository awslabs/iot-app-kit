import type IFeature from '../models/feature';

export default interface IFeatureRepository {
  evaluate(feature: string): Promise<IFeature>;
}
