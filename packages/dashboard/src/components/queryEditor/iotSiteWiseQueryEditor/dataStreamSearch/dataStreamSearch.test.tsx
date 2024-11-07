import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DataStreamSearch } from './dataStreamSearch';
import { type IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';

jest.mock('./workspaceSelector/useWorkspaces', () => ({
  useWorkspaces: jest.fn(() => ({
    workspaces: [],
    status: 'error',
  })),
}));

describe('DataStreamSearch component', () => {
  test('renders error and info component when  no workspaceis available', async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <DataStreamSearch
          onSubmit={jest.fn()}
          client={{ send: jest.fn() } as unknown as IoTTwinMakerClient}
        />
      </QueryClientProvider>
    );

    const errorMessage = screen.getByText(
      'Advanced search not supported, no workspace available.'
    );
    expect(errorMessage).toBeInTheDocument();

    const infoMessage = screen.getByText(
      'To find you assests, make sure to enter the exact model name or characters.'
    );
    expect(infoMessage).toBeInTheDocument();
  });

  test('expects to have an external link ', () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <DataStreamSearch
          onSubmit={jest.fn()}
          client={{ send: jest.fn() } as unknown as IoTTwinMakerClient}
        />
      </QueryClientProvider>
    );

    expect(
      screen.getByRole('link', {
        name: 'Learn more about creating a workspace',
      })
    ).toHaveAttribute(
      'href',
      'https://docs.aws.amazon.com/iot-twinmaker/latest/guide/twinmaker-gs-workspace.html'
    );
  });
});
