import {
  DataModule,
  DataModuleSubscription,
  DataStream,
  SiteWiseAssetSession,
  SiteWiseDataStreamQuery,
  SubscriptionUpdate,
} from '../../interface';
import { DescribeAssetModelResponse } from '@aws-sdk/client-iotsitewise';
import { completeDataStreams } from '../../completeDataStreams';
import { TimeSeriesData } from './types';
import { MinimalViewPortConfig } from '@synchro-charts/core';

export const subscribeToTimeSeriesData =
  (dataModule: DataModule, assetModuleSession: SiteWiseAssetSession) =>
  ({ queries, request }: DataModuleSubscription<SiteWiseDataStreamQuery>, callback: (data: TimeSeriesData) => void) => {
    let dataStreams: DataStream[] = [];

    let viewport: MinimalViewPortConfig;

    const assetModels: Record<string, DescribeAssetModelResponse> = {};

    const emit = () => {
      callback({
        dataStreams: completeDataStreams({ dataStreams, assetModels }),
        viewport,
      });
    };

    const { update, unsubscribe } = dataModule.subscribeToDataStreams({ queries, request }, (data) => {
      dataStreams = data.dataStreams;
      viewport = data.viewport;
      emit();
    });

    queries.forEach((query) => {
      query.assets.forEach((asset) => {
        assetModuleSession
          .fetchAssetSummary({ assetId: asset.assetId })
          .then((assetSummary) => {
            if (assetSummary && assetSummary.assetModelId != null) {
              return assetModuleSession.fetchAssetModel({ assetModelId: assetSummary.assetModelId });
            }
          })
          .then((assetModelResponse) => {
            if (assetModelResponse) {
              assetModels[asset.assetId] = assetModelResponse;
              emit();
            }
          });
      });
    });

    return {
      unsubscribe: () => {
        unsubscribe();
      },
      update: (subscriptionUpdate: SubscriptionUpdate<SiteWiseDataStreamQuery>) => {
        update(subscriptionUpdate);
      },
    };
  };
