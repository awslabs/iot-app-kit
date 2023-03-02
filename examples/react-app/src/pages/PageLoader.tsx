import React from 'react';

import { ReactNode, Suspense } from 'react';
import { Header } from '@cloudscape-design/components';

function PageLoader({ children }: { children: ReactNode }) {
    return (
        <Suspense fallback={<Header variant="h1">Loading...</Header>}>{children}</Suspense>
    );
}

export default PageLoader;
