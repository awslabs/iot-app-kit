import { TwinMakerErrorCode } from '../common/error';
import { ITwinMakerEntityDataBindingContext, IValueDataBinding, IValueDataBindingProvider } from './types';
import { EntityPropertyBindingProviderStore } from './EntityPropertyBindingProviderStore';
import { ErrorDetails, Query, TimeSeriesData, TimeSeriesDataQuery } from '@iot-app-kit/core';
import { TwinMakerQuery } from '../time-series-data/types';
import { TwinMakerMetadataModule } from '../metadata-module/TwinMakerMetadataModule';

export const createEntityPropertyBindingProvider = ({
  metadataModule,
  timeSeriesDataQuery,
  onError,
}: {
  metadataModule: TwinMakerMetadataModule;
  timeSeriesDataQuery: (query: TwinMakerQuery) => TimeSeriesDataQuery;
  onError?: (errorCode: TwinMakerErrorCode, errorDetails?: ErrorDetails) => void;
}): IValueDataBindingProvider => {
  return {
    createStore: (isDataBindingTemplateProvider: boolean) =>
      new EntityPropertyBindingProviderStore({
        isDataBindingTemplateProvider,
        metadataModule,
        onError,
      }),
    // TODO: add non time series data support
    createQuery: (dataBinding: IValueDataBinding): Query<TimeSeriesData[]> | undefined => {
      const context = dataBinding.dataBindingContext as ITwinMakerEntityDataBindingContext;
      if (!context.entityId || !context.componentName || !context.propertyName) {
        return undefined;
      }

      return timeSeriesDataQuery({
        entityId: context.entityId,
        componentName: context.componentName,
        properties: [{ propertyName: context.propertyName }],
      }) as Query<TimeSeriesData[]>;
    },
  };
};
