import { type PropsWithChildren, useCallback, useState } from 'react';
import FeatureContext from '../context/feature-context';
import type IFeatureRepository from '../resources/IFeatureRepository';
import OverridableFeatureRepository from '../resources/OverridableFeatureRepository';

interface FeatureProviderProps extends PropsWithChildren {
  repository: IFeatureRepository;
}

const FeatureProvider: React.FC<FeatureProviderProps> = ({
  repository: fallbackRepository,
  children,
}) => {
  const [repository] = useState(
    new OverridableFeatureRepository(fallbackRepository)
  ); // We wrap user's repository in the overridable decorator, which enables developers and testers to override this control, and expose whatever features they want.

  const getFeature = useCallback(
    async (feature: string) => {
      const response = await repository.evaluate(feature);
      return response;
    },
    [repository]
  );

  return (
    <FeatureContext.Provider
      value={{
        getFeature,
      }}
    >
      {children}
    </FeatureContext.Provider>
  );
};

export default FeatureProvider;
