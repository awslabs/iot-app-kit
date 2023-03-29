import { TimeSeriesDataModule } from '@iot-app-kit/core';

import { completeDataStreams } from './completeDataStreams';
import { TwinMakerMetadataModule } from '../metadata-module/TwinMakerMetadataModule';
import type {
  DataModuleSubscription,
  DataStream,
  TimeSeriesData,
  SubscriptionUpdate,
  ErrorDetails,
  Viewport,
} from '@iot-app-kit/core';
import type { TwinMakerDataStreamQuery, TwinMakerEntityHistoryQuery } from './types';
import type { GetEntityResponse } from '@aws-sdk/client-iottwinmaker';

export const subscribeToTimeSeriesData =
  (metadataModule: TwinMakerMetadataModule, dataModule: TimeSeriesDataModule<TwinMakerDataStreamQuery>) =>
  (
    { queries, request }: DataModuleSubscription<TwinMakerDataStreamQuery>,
    callback: (data: TimeSeriesData) => void
  ) => {
    let dataStreams: DataStream[] = [];

    let viewport: Viewport;

    const entities: Record<string, GetEntityResponse> = {};
    const errors: Record<string, ErrorDetails> = {};

    const emit = () => {
      callback({
        dataStreams: completeDataStreams({ dataStreams, entities }),
        viewport,
        thresholds: [],
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
          // Only need to fetch resource for entity query since component type query will fetch resources before
          // initiating request.
          if ((query as TwinMakerEntityHistoryQuery).entityId) {
            const entityQuery = query as TwinMakerEntityHistoryQuery;

            metadataModule
              .fetchEntity({ entityId: entityQuery.entityId })
              .then((entity) => {
                if (entity.entityId) {
                  entities[entity.entityId] = entity;
                  emit();
                }
              })
              .catch((err: ErrorDetails) => {
                // TODO: Currently these are not used anywhere. Do something with these errors.
                errors[entityQuery.entityId] = err;
                // emit();
              });
          }
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
