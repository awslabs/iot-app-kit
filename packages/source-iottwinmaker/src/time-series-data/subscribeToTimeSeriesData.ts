import { MinimalViewPortConfig } from '@synchro-charts/core';
import {
  DataModuleSubscription,
  DataStream,
  TimeSeriesData,
  SubscriptionUpdate,
  ErrorDetails,
  TimeSeriesDataModule,
} from '@iot-app-kit/core';

import { completeDataStreams } from './completeDataStreams';
import { TwinMakerDataStreamQuery } from './types';
import { TwinMakerMetadataModule } from '../metadata-module/TwinMakerMetadataModule';
import { GetEntityResponse } from '@aws-sdk/client-iottwinmaker';

export const subscribeToTimeSeriesData =
  (metadataModule: TwinMakerMetadataModule, dataModule: TimeSeriesDataModule<TwinMakerDataStreamQuery>) =>
  (
    { queries, request }: DataModuleSubscription<TwinMakerDataStreamQuery>,
    callback: (data: TimeSeriesData) => void
  ) => {
    let dataStreams: DataStream[] = [];

    let viewport: MinimalViewPortConfig;

    const entities: Record<string, GetEntityResponse> = {};
    const errors: Record<string, ErrorDetails> = {};

    const emit = () => {
      callback({
        dataStreams: completeDataStreams({ dataStreams, entities }),
        viewport,
      });
    };

    const { update, unsubscribe } = dataModule.subscribeToDataStreams({ queries, request }, (data: TimeSeriesData) => {
      dataStreams = data.dataStreams;
      viewport = data.viewport;
      emit();
    });

    const fetchResources = ({ queries }: { queries?: TwinMakerDataStreamQuery[] }) => {
      if (queries) {
        queries.forEach((query) => {
          metadataModule
            .fetchEntity({ entityId: query.entityId })
            .then((entity) => {
              if (entity.entityId) {
                entities[entity.entityId] = entity;
                emit();
              }
            })
            .catch((err: ErrorDetails) => {
              // TODO: Currently these are not used anywhere. Do something with these errors.
              errors[query.entityId] = err;
              // emit();
            });
        });
      }
    };
    fetchResources({ queries });

    return {
      unsubscribe: () => {
        unsubscribe();
      },
      update: (subscriptionUpdate: SubscriptionUpdate<TwinMakerDataStreamQuery>) => {
        update(subscriptionUpdate);
        fetchResources(subscriptionUpdate);
      },
    };
  };
