import * as React from 'react';
import { render } from '@testing-library/react';
import { wrapWithTestBackend } from 'react-dnd-test-utils';
import { ResourceExplorerPanel } from './panel';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const [PanelContext] = wrapWithTestBackend(ResourceExplorerPanel);
const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('ResourceExplorerPanel', () => {
  it('renders empty panel message when no items passed', () => {
    const { getByText } = render(
      <QueryClientProvider client={testQueryClient}>
        <PanelContext assetId='Asset1' />
      </QueryClientProvider>
    );

    expect(getByText('Asset has no properties or child assets.')).toBeTruthy();
  });
});
