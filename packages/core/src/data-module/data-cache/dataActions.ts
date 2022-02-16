import { Action, Dispatch } from 'redux';
import { DataStreamId, Resolution } from '@synchro-charts/core';
import { DataStream } from '../types';

/**
 *
 * Redux Actions used to communicated to `<bp-data-store />`
 *
 * Presents an external interface for bp-connector implementations to hook
 * data sources to the bp-components.
 */

/**
 * On Request
 */

export const REQUEST = 'REQUEST';
export interface RequestData extends Action<'REQUEST'> {
  type: typeof REQUEST;
  payload: {
    id: DataStreamId;
    resolution: Resolution;
    // the first date of data to fetch, exclusive
    first: Date;
    // the most recent date of data to fetch, inclusive
    last: Date;
  };
}

export type OnRequest = (payload: RequestData['payload']) => [Date, Date][];

export const onRequestAction = (payload: RequestData['payload']): RequestData => ({
  type: REQUEST,
  payload,
});

export const onRequest = (payload: RequestData['payload']) => (dispatch: Dispatch) => {
  dispatch(onRequestAction(payload));
};

/**
 * On Error
 */

export const ERROR = 'ERROR';
export interface ErrorResponse extends Action<'ERROR'> {
  type: typeof ERROR;
  payload: {
    id: DataStreamId;
    resolution: Resolution;
    error: string;
  };
}

export const onErrorAction = (id: DataStreamId, resolution: Resolution, error: string): ErrorResponse => ({
  type: ERROR,
  payload: {
    id,
    resolution,
    error,
  },
});

export const onError = (id: DataStreamId, resolution: Resolution, error: string) => (dispatch: Dispatch) => {
  dispatch(onErrorAction(id, resolution, error));
};

/**
 * On Success
 */

export const SUCCESS = 'SUCCESS';
export interface SuccessResponse extends Action<'SUCCESS'> {
  type: typeof SUCCESS;
  payload: {
    id: DataStreamId;
    data: DataStream;
    first: Date;
    last: Date;
  };
}
export const onSuccessAction = (id: DataStreamId, data: DataStream, first: Date, last: Date): SuccessResponse => ({
  type: SUCCESS,
  payload: {
    id,
    data,
    first,
    last,
  },
});

export const onSuccess = (id: DataStreamId, data: DataStream, first: Date, last: Date) => (dispatch: Dispatch) => {
  dispatch(onSuccessAction(id, data, first, last));
};

export type AsyncActions = RequestData | ErrorResponse | SuccessResponse;
