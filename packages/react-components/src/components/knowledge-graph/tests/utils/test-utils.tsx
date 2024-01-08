import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { context, KnowledgeGraphContext } from '../../StateManager';

const initialState = {
  selectedGraphNodeEntityId: null,
  setSelectedGraphNodeEntityId: () => {},
  queryResult: null,
  setQueryResult: () => {},
  clearGraphResults: () => {},
} as KnowledgeGraphContext;

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <context.Provider value={initialState}>
      <IntlProvider locale='en' defaultLocale='en'>
        {children}
      </IntlProvider>
    </context.Provider>
  );
};

export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });
