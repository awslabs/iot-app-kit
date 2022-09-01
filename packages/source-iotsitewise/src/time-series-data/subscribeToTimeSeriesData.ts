import { DescribeAssetModelResponse } from '@aws-sdk/client-iotsitewise';
import { completeDataStreams } from '../completeDataStreams';
import { SiteWiseDataStreamQuery } from './types';
import { MinimalViewPortConfig } from '@synchro-charts/core';
import {
  ErrorDetails,
  TimeSeriesDataModule,
  DataModuleSubscription,
  DataStream,
  TimeSeriesData,
  SubscriptionUpdate,
} from '@iot-app-kit/core';
import { SiteWiseAssetSession } from '../asset-modules';

export const subscribeToTimeSeriesData =
  (dataModule: TimeSeriesDataModule<SiteWiseDataStreamQuery>, assetModuleSession: SiteWiseAssetSession) =>
  ({ queries, request }: DataModuleSubscription<SiteWiseDataStreamQuery>, callback: (data: TimeSeriesData) => void) => {
    let dataStreams: DataStream[] = [];

    let viewport: MinimalViewPortConfig;

    const assetModels: Record<string, DescribeAssetModelResponse> = {};

    const errors: Record<string, ErrorDetails> = {};

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

    const fetchResources = ({ queries }: { queries?: SiteWiseDataStreamQuery[] }) => {
      if (queries) {
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
              })
              .catch((err: ErrorDetails) => {
                // TODO: Currently these are not used anywhere. Do something with these errors.
                errors[asset.assetId] = err;
                // emit();
              });
          });
        });
      }
    };
    fetchResources({ queries });

    return {
      unsubscribe: () => {
        unsubscribe();
      },
      update: (subscriptionUpdate: SubscriptionUpdate<SiteWiseDataStreamQuery>) => {
        update(subscriptionUpdate);
        fetchResources(subscriptionUpdate);
      },
    };
  };
