import { applyMiddleware, createStore, Store } from 'redux';

import thunk from 'redux-thunk';
import { dataReducer } from './dataReducer';
import { DataStreamsStore } from './types';

export const configureStore = (initialState: DataStreamsStore = {}): Store =>
  createStore(dataReducer, initialState, applyMiddleware(thunk));
