import Evidently, {
  ClientConfiguration,
  EvaluateFeatureRequest,
} from 'aws-sdk/clients/evidently';
import IFeature from '../models/feature';
import IFeatureRepository from './IFeatureRepository';
import { Memoize } from 'typescript-memoize';

export default class EvidentlyFeatureRepository implements IFeatureRepository {
  private client: Evidently;

  constructor(
    private project: string,
    private entityId: string,
    options: ClientConfiguration
  ) {
    this.client = new Evidently(options);
  }

  @Memoize((entityId: string, feature: string) => `${entityId};${feature}`) // We memoize this, so if the same entityid/feature configuration is requested, we only make the call once.
  async evaluate(feature: string): Promise<IFeature> {
    const request: EvaluateFeatureRequest = {
      entityId: this.entityId,
      feature,
      project: this.project,
    };

    const response = await this.client.evaluateFeature(request).promise();

    if (!response.value) {
      console.log(response);
      return {
        variation: response.variation,
      };
    }

    const { boolValue, doubleValue, longValue, stringValue } = response.value;

    return {
      variation: response.variation,
      value: boolValue || doubleValue || longValue || stringValue, // Only one of these will have a value.
    };
  }
}
