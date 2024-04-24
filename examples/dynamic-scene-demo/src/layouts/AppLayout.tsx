import React, { createContext, FC, ReactNode, useCallback, useContext, useState } from 'react';

import {
  BreadcrumbGroup,
  AppLayout as Layout,
  AppLayoutProps as LayoutProps,
  ContentLayout,
  Container,
  SpaceBetween,
} from '@cloudscape-design/components';

import ViewportControls from '../components/ViewPort/Controls';

interface IAppContext {
  openTools: () => void
  closeTools: () => void
};

const AppContext = createContext<IAppContext>({
  openTools: () => { },
  closeTools: () => { },
});

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppLayout: FC<LayoutProps & { children: ReactNode }> = ({ children, ...props }) => {
  const [toolsOpen, setToolsOpen] = useState<boolean>(true);

  const openTools = useCallback(() => {
    setToolsOpen(true);
  }, []);

  const closeTools = useCallback(() => {
    setToolsOpen(false)
  }, []);

  return (
    <AppContext.Provider value={{
      openTools,
      closeTools
    }}>
      <Layout
        maxContentWidth={Number.MAX_VALUE}
        navigationWidth={550} // temporary fix to maintain toggle while still working on things
        navigationHide={true}
        navigation={
          <SpaceBetween size={'s'}>
            <Container>
              <ViewportControls />
            </Container>
          </SpaceBetween>
        }
        contentHeader={
          <Container>
            <header>
              <h1>Sample IoT AppKit Components</h1>
            </header>
          </Container>
        }
        content={
          <ContentLayout>
            <Container>
              {children}
            </Container>
          </ContentLayout>
        }
        breadcrumbs={
          <BreadcrumbGroup
            items={[]}
            expandAriaLabel="Show path"
            ariaLabel="Breadcrumbs"
          />
        }
        toolsOpen={toolsOpen}
        {...props}
      />
    </AppContext.Provider>
  );
}
