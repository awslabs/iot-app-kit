import { createStore, Store } from 'redux';

import { dataReducer } from './dataReducer';
import { DataStreamsStore } from './types';

export const configureStore = (initialState: DataStreamsStore = {}): Store => createStore(dataReducer, initialState);
