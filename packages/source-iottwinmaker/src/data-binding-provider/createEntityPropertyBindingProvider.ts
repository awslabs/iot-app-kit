import { TwinMakerErrorCode } from '../common/error';
import {
  ITwinMakerEntityDataBindingContext,
  IValueDataBinding,
  IValueDataBindingProvider,
} from './types';
import { EntityPropertyBindingProviderStore } from './EntityPropertyBindingProviderStore';
import {
  ErrorDetails,
  Query,
  TimeSeriesDataQuery,
  DataBase,
  DataRequest,
} from '@iot-app-kit/core';
import {
  TwinMakerHistoryQuery,
  TwinMakerPropertyValueQuery,
} from '../common/queryTypes';
import { TwinMakerMetadataModule } from '../metadata-module/TwinMakerMetadataModule';

export const createEntityPropertyBindingProvider = ({
  metadataModule,
  timeSeriesDataQuery,
  propertyValueQuery,
  onError,
}: {
  metadataModule: TwinMakerMetadataModule;
  timeSeriesDataQuery: (query: TwinMakerHistoryQuery) => TimeSeriesDataQuery;
  propertyValueQuery: (
    query: TwinMakerPropertyValueQuery
  ) => Query<DataBase[], DataRequest>;
  onError?: (
    errorCode: TwinMakerErrorCode,
    errorDetails?: ErrorDetails
  ) => void;
}): IValueDataBindingProvider => {
  return {
    createStore: (isDataBindingTemplateProvider: boolean) =>
      new EntityPropertyBindingProviderStore({
        isDataBindingTemplateProvider,
        metadataModule,
        onError,
      }),
    createQuery: (dataBinding: IValueDataBinding) => {
      const context =
        dataBinding.dataBindingContext as ITwinMakerEntityDataBindingContext;
      if (
        !context ||
        !context.entityId ||
        !context.componentName ||
        !context.propertyName
      ) {
        return undefined;
      }

      if (dataBinding.isStaticData) {
        return propertyValueQuery({
          entityId: context.entityId,
          componentName: context.componentName,
          properties: [{ propertyName: context.propertyName }],
        });
      }

      return timeSeriesDataQuery({
        entityId: context.entityId,
        componentName: context.componentName,
        properties: [{ propertyName: context.propertyName }],
      });
    },
  };
};
