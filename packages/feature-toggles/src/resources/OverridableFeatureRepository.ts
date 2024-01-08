import IFeature from '../models/feature';
import IFeatureRepository from './IFeatureRepository';
import Cookies from 'js-cookie';
import { Memoize } from 'typescript-memoize';

/**
 * Enables overriding active treatments by setting a state in the `localStorage['feature-overrides']` namespace.
 *
 * To override a feature, you can run a command like this from the console:
 *
 * ```javascript
 * window.localStorage['feature-overrides] = {
 *  'Feature1': { variation: '<Treatment>', value: '<value>' },
 *  'Feature2': { variation: '<Treatment>', value: '<value>' },
 *  'Feature3': { variation: '<Treatment>', value: '<value>' },
 * }
 * ```
 *
 * If it doesn't find an override for a given feature in localStorage, it instead will resolve using the Fallback Repository provided
 */
export default class OverridableFeatureRepository
  implements IFeatureRepository
{
  private fallback?: IFeatureRepository;

  constructor(fallbackRepository?: IFeatureRepository) {
    this.fallback = fallbackRepository;
  }

  evaluate(feature: string): Promise<IFeature> {
    const registry = this.getCookieRegistry();

    if (registry[feature.toUpperCase()]) {
      return Promise.resolve(registry[feature.toUpperCase()]);
    }

    if (this.fallback) {
      return this.fallback.evaluate(feature);
    }

    return Promise.resolve({});
  }

  @Memoize()
  private getCookieRegistry() {
    const experiments = Cookies.get('experiment'); // This is the same cookie set by the NeoWeblab tool, and mimicks the behavior of weblab in retail.
    const registry: { [feat: string]: IFeature } = {};

    // A bit hand wavy here, because tools like NeoWeblab only allow you to set the Treatment, not a value. But Evidently allows you to specify a value for each treatment as well.
    // In this case, we are extending support of the default format, to allow for a future value to be set in a backward compatible way.
    // Specifically: experiment=NEW_FEATURE:T1:VALUE&OTHER_NEW_FEATURE:C. While most of our experiments will be based on the treatment setting, this allows for future tools to also set a value if desired.
    experiments?.split('&').forEach((experiment) => {
      const parts = [...experiment.split(':'), undefined, undefined, undefined];

      /* istanbul ignore else */
      if (parts[0]) {
        // uppercase key, cause we don't want them to be case sensitive.
        registry[parts[0].toUpperCase()] = {
          variation: parts[1],
          value: parts[2],
        };
      }
    });

    return registry;
  }
}
