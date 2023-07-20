import { TwinMakerErrorCode } from '../common/error';
import { ITwinMakerEntityDataBindingContext, IValueDataBinding, IValueDataBindingProvider } from './types';
import { EntityPropertyBindingProviderStore } from './EntityPropertyBindingProviderStore';
import { ErrorDetails, Query, TimeSeriesData, TimeSeriesDataQuery } from '@iot-app-kit/core';
import { TwinMakerHistoryQuery } from '../common/queryTypes';
import { TwinMakerMetadataModule } from '../metadata-module/TwinMakerMetadataModule';

export const createEntityPropertyBindingProvider = ({
  metadataModule,
  timeSeriesDataQuery,
  onError,
}: {
  metadataModule: TwinMakerMetadataModule;
  timeSeriesDataQuery: (query: TwinMakerHistoryQuery) => TimeSeriesDataQuery;
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

      if (dataBinding.isStaticData) {
        // TODO: return property value query
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
