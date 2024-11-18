import { Header } from '@cloudscape-design/components';
import { type ReactNode, Suspense } from 'react';

function PageLoader({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<Header variant='h1'>Loading...</Header>}>
      {children}
    </Suspense>
  );
}

export default PageLoader;
