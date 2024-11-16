import {
  type AssetPropertyValuesRequest,
  type AssetPropertyValuesRequestFunctions,
} from '../useAssetPropertyValues';
import { useAssetPropertyValues } from '../useAssetPropertyValues/useAssetPropertyValues';
import { type RequestSettings } from './requestManager';
import { type Viewport } from './types';

type Request = AssetPropertyValuesRequest;
type RequestFunctions = AssetPropertyValuesRequestFunctions;

export type UseTimeSeriesDataOptions = {
  requests: Request[];
  viewport: Viewport;
  requestFns?: RequestFunctions;
  settings?: RequestSettings;
};

export const useTimeSeriesData = ({
  requests,
  viewport,
  requestFns = {},
  settings = {},
}: UseTimeSeriesDataOptions) => {
  const assetPropertyValues = useAssetPropertyValues({
    requests,
    viewport,
    requestFns,
    settings,
  });

  return assetPropertyValues;
};
