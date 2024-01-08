import { createStore } from 'redux';

import { dataReducer } from './dataReducer';
import type { Store } from 'redux';
import type { DataStreamsStore } from './types';

export const configureStore = (initialState: DataStreamsStore = {}): Store =>
  createStore(dataReducer, initialState);
