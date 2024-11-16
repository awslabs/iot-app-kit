import { type AggregateType } from '@aws-sdk/client-iotsitewise';
import { configureStore } from './createStore';
import { onErrorAction, onRequestAction, onSuccessAction } from './dataActions';
import { getDataStreamStore } from './getDataStreamStore';
import { type Observable, map, startWith, pairwise, from } from 'rxjs';
import { delay, filter } from 'rxjs/operators';
import { toDataStreams } from './toDataStreams';
import type { Store } from 'redux';
import type {
  Resolution,
  RequestInformation,
  DataStream,
  RequestInformationAndRange,
} from '../types';
import type { DataStreamsStore } from './types';
import type { ErrorDetails } from '../../common/types';
import { hasIntervalForRange } from './dateUtils';

type StoreChange = {
  prevDataCache: DataStreamsStore;
  currDataCache: DataStreamsStore;
};

/**
 * Referential comparison of information related to the requested information.
 */
const hasRequestedInformationChanged = (
  { prevDataCache, currDataCache }: StoreChange,
  requestInformation: RequestInformation
): boolean => {
  const prevDataStreamStore = getDataStreamStore(
    requestInformation.id,
    requestInformation.resolution,
    prevDataCache,
    requestInformation.aggregationType
  );
  const currDataStreamStore = getDataStreamStore(
    requestInformation.id,
    requestInformation.resolution,
    currDataCache,
    requestInformation.aggregationType
  );

  const hasChanged = prevDataStreamStore != currDataStreamStore;
  return hasChanged;
};

/**
 * Data Cache Wrapper
 *
 * A wrapper around the existing data-cache, as is currently used within SiteWise Monitor.
 *
 * This wrapped component allows us to evolve the API of the data-cache, without altering the currently utilized data-cache.
 */
export class DataCache {
  private dataCache: Store;
  private observableStore: Observable<StoreChange>;

  constructor(initialDataCache?: DataStreamsStore) {
    this.dataCache = configureStore(initialDataCache);

    this.observableStore = from(this.dataCache).pipe(
      startWith(undefined),
      pairwise(),
      map(([prevDataCache, currDataCache]) => ({
        prevDataCache,
        currDataCache,
      }))
    );
  }

  public subscribe = (
    requestInformations: RequestInformation[],
    emit: (dataStreams: DataStream[]) => void
  ) => {
    const subscription = this.observableStore
      .pipe(
        // Filter out any changes that don't effect the requested informations
        filter(({ currDataCache, prevDataCache }) =>
          requestInformations.some((requestInformation) =>
            hasRequestedInformationChanged(
              {
                currDataCache,
                prevDataCache,
              },
              requestInformation
            )
          )
        )
      )
      .subscribe((stores) => {
        const dataStreams = toDataStreams({
          dataStreamsStores: stores.currDataCache,
          requestInformations: requestInformations,
        });

        emit(dataStreams);
      });

    return () => {
      subscription.unsubscribe();
    };
  };

  public shouldRequestDataStream = ({
    dataStreamId,
    resolution,
    aggregationType,
  }: {
    dataStreamId: string;
    resolution: number;
    aggregationType?: AggregateType;
  }) => {
    const associatedStore = getDataStreamStore(
      dataStreamId,
      resolution,
      this.getState(),
      aggregationType
    );
    const hasError = associatedStore ? associatedStore.error != null : false;
    return !hasError;
  };

  public getState = (): DataStreamsStore => this.dataCache.getState();

  // emits cached data
  public getCachedDataForRange = (
    requestInfos: RequestInformationAndRange[],
    emit: (dataStreams: DataStream[]) => void
  ) => {
    const subscription = this.observableStore
      .pipe(delay(0))
      .subscribe(({ currDataCache }) => {
        const hasLoadedFullIntervalData = requestInfos.every((request) => {
          const { id, resolution, aggregationType, start, end } = request;
          const associatedStore = getDataStreamStore(
            id,
            resolution,
            currDataCache,
            aggregationType
          );

          // if no stores are found, then data is uncached
          if (!associatedStore) return false;

          // check if cache has correct interval and is not loading more data
          const hasLoadedData =
            !associatedStore.isLoading && !associatedStore.isRefreshing;
          const hasLoadedFullInterval = hasIntervalForRange(
            associatedStore.dataCache.intervals,
            { start, end }
          );

          return hasLoadedData && hasLoadedFullInterval;
        });

        // only emit data streams if all request informations have loaded dataStreams for the required time range
        if (hasLoadedFullIntervalData) {
          const dataStreams = toDataStreams({
            requestInformations: requestInfos,
            dataStreamsStores: currDataCache,
          });

          subscription.unsubscribe();
          emit(dataStreams);
        }
      });
  };

  /**
   * data-cache bindings
   *
   * data-cache utilizes a redux store, the below methods are for ease of use, so you don't have to worry about
   * coordinating the dispatching of the action throughout the file.
   */

  public onSuccess = (
    dataStreams: DataStream[],
    requestInformation: RequestInformationAndRange,
    start: Date,
    end: Date
  ): void => {
    // TODO: `duration` is not an accurate way to determine what _was_ requested.
    //  Need to change then code to utilize the actual start and end date, as utilized by the data source which initiated the request.
    //  For example, if we have queried data for the last day, but it took 1 minute for the query to resolve, we would have the start and the end date
    //  incorrectly offset by one minute with the correct logic.
    dataStreams.forEach((stream) => {
      this.dataCache.dispatch(
        onSuccessAction(stream.id, stream, start, end, requestInformation)
      );
    });
  };

  public onError = ({
    id,
    resolution,
    error,
    aggregationType,
  }: {
    id: string;
    resolution: Resolution;
    error: ErrorDetails;
    aggregationType?: AggregateType;
  }): void => {
    this.dataCache.dispatch(
      onErrorAction(id, resolution, error, aggregationType)
    );
  };

  public onRequest = (requestInformation: RequestInformationAndRange): void => {
    this.dataCache.dispatch(onRequestAction(requestInformation));
  };
}
