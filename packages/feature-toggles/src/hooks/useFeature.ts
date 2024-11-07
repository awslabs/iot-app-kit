import FeatureContext from '../context/feature-context';
import { useContext, useState, useEffect } from 'react';
import type IFeature from '../models/feature';

export default (feature: string): [IFeature, boolean] => {
  const { getFeature } = useContext(FeatureContext);
  const [featureData, setFeatureData] = useState<IFeature>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const doAsync = async () => {
      setLoading(true);
      const response = await getFeature(feature);
      setFeatureData(response);
      setLoading(false);
    };

    doAsync();
  }, [feature, getFeature]);

  return [featureData, loading];
};
