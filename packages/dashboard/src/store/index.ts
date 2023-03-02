import { Store } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import merge from 'lodash/merge';

import { DashboardAction } from './actions';
import { DashboardState, initialState } from './state';
import { dashboardReducer } from './reducer';
import { RecursivePartial } from '~/types';
import { describeAssetSaga } from './sagas/describeAsset';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

export type DashboardStore = Store<DashboardState, DashboardAction>;

export const configureDashboardStore = (
  preloadedState?: RecursivePartial<DashboardState>,
  client?: IoTSiteWiseClient
) => {
  const mergedState = merge(initialState, preloadedState);
  const sagaMiddleware = createSagaMiddleware({
    context: { client },
  });

  const store = configureStore({
    reducer: dashboardReducer,
    preloadedState: {
      ...mergedState,
      dashboardConfiguration: {
        ...mergedState.dashboardConfiguration,
        // The viewport object has a different property set depending on whether it's relative or absolute so merging does not create the correct type
        viewport: (preloadedState?.dashboardConfiguration?.viewport ||
          initialState.dashboardConfiguration.viewport) as DashboardState['dashboardConfiguration']['viewport'],
      },
    },
    middleware: [sagaMiddleware],
  });

  sagaMiddleware.run(describeAssetSaga);
  return store;
};
