import { type AggregateType } from '@aws-sdk/client-iotsitewise';
import type { Action, Dispatch } from 'redux';
import type {
  DataStream,
  DataStreamId,
  RequestInformationAndRange,
  Resolution,
} from '../types';
import type { ErrorDetails } from '../../common/types';

// Redux Actions used to communicated to `<bp-data-store />`
// Presents an external interface for bp-connector implementations to hook
// data sources to the bp-components.

export const REQUEST = 'REQUEST';

export interface RequestData extends Action<'REQUEST'> {
  type: typeof REQUEST;
  payload: RequestInformationAndRange;
}

export const onRequestAction = (
  payload: RequestData['payload']
): RequestData => ({
  type: REQUEST,
  payload,
});

export const ERROR = 'ERROR';

export interface ErrorResponse extends Action<'ERROR'> {
  type: typeof ERROR;
  payload: {
    id: DataStreamId;
    resolution: Resolution;
    error: ErrorDetails;
    aggregationType?: AggregateType;
  };
}

export const onErrorAction = (
  id: DataStreamId,
  resolution: Resolution,
  error: ErrorDetails,
  aggregationType?: AggregateType
): ErrorResponse => ({
  type: ERROR,
  payload: {
    id,
    resolution,
    error,
    aggregationType,
  },
});

export const onError =
  (
    id: DataStreamId,
    resolution: Resolution,
    error: ErrorDetails,
    aggregationType?: AggregateType
  ) =>
  (dispatch: Dispatch) => {
    dispatch(onErrorAction(id, resolution, error, aggregationType));
  };

export const SUCCESS = 'SUCCESS';

export interface SuccessResponse extends Action<'SUCCESS'> {
  type: typeof SUCCESS;
  payload: {
    id: DataStreamId;
    data: DataStream;
    first: Date;
    last: Date;
    requestInformation: RequestInformationAndRange;
  };
}

export const onSuccessAction = (
  id: DataStreamId,
  data: DataStream,
  first: Date,
  last: Date,
  requestInformation: RequestInformationAndRange
): SuccessResponse => ({
  type: SUCCESS,
  payload: {
    id,
    data,
    first,
    last,
    requestInformation,
  },
});

export const onSuccess =
  (
    id: DataStreamId,
    data: DataStream,
    first: Date,
    last: Date,
    requestInformation: RequestInformationAndRange
  ) =>
  (dispatch: Dispatch) => {
    dispatch(onSuccessAction(id, data, first, last, requestInformation));
  };

export type AsyncActions = RequestData | ErrorResponse | SuccessResponse;
