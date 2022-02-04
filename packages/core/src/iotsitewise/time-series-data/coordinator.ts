import {
  DataModule,
  DataModuleSubscription,
  DataStream,
  DataStreamCallback,
  SiteWiseAssetSession,
  SiteWiseDataStreamQuery,
  SubscriptionUpdate,
} from '../../interface';
import { DescribeAssetModelResponse } from '@aws-sdk/client-iotsitewise';
import { completeDataStreams } from '../../completeDataStreams';

export const subscribeToTimeSeriesData =
  (dataModule: DataModule, assetModuleSession: SiteWiseAssetSession) =>
  ({ queries, request }: DataModuleSubscription<SiteWiseDataStreamQuery>, callback: DataStreamCallback) => {
    let dataStreams: DataStream[] = [];
    const assetModels: Record<string, DescribeAssetModelResponse> = {};

    const emit = () => {
      callback(completeDataStreams({ dataStreams, assetModels }));
    };

    const { update, unsubscribe } = dataModule.subscribeToDataStreams({ queries, request }, (updatedDataStreams) => {
      dataStreams = updatedDataStreams;
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
