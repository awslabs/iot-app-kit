import { FC, Suspense, lazy } from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { ErrorBoundary } from 'react-error-boundary';
import { FallbackProps } from 'react-error-boundary';

const HomePage = lazy(async () => await import('./pages/Home'));
const VRPage = lazy(async () => await import('./pages/VR'));
const LoginPage = lazy(async () => await import('./pages/SignIn'));

const ErrorFallback: FC<FallbackProps> = ({ error }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  )
}

const AppRouter = () => {
  return (
    <Router>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/vr" element={<VRPage />} />
            <Route path="/signin" element={<LoginPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  )
}

export default AppRouter;
