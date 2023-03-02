import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { RouteTemplate } from './routes';
import { PageLoader } from './pages';
import React from 'react';

const Home = lazy(async () => await import('./pages/Home'));

const router = createBrowserRouter([
  {
    path: RouteTemplate.HOME,
    element: (
      <PageLoader>
        <Home />
      </PageLoader>
    ),
  },
]);

export default router;
