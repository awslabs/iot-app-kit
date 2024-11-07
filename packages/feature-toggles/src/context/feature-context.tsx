import { createContext } from 'react';
import type IFeature from '../models/feature';

export interface IFeatureContext {
  getFeature(feature: string): Promise<IFeature>;
}

export default createContext<IFeatureContext>({
  getFeature: /* istanbul ignore next */ () => Promise.resolve({}),
});
