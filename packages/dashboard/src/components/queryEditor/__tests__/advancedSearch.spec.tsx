import { QueryEditor } from '../queryEditor';
import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TwinMakerKGQueryDataModule } from '@iot-app-kit/source-iottwinmaker';

const queryClient = new QueryClient();

const Wrapper = ({ children }: React.PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const mockResults = {
  columnDescriptions: [
    {
      name: 'assetName',
      type: 'VALUE',
    },
    {
      name: 'propertyId',
      type: 'VALUE',
    },
    {
      name: 'propertyName',
      type: 'VALUE',
    },
    {
      name: 'displayName',
      type: 'VALUE',
    },
  ],
  rows: [
    {
      rowData: ['asset1', 'propertyId1', 'property1', 'temperature'],
    },
    {
      rowData: ['Asset2', 'PropertyId2', 'property2', 'speed'],
    },
    {
      rowData: ['Asset3', 'PropertyId3', 'property3'],
    },
    {
      rowData: ['TestAsset', null, 'sitewiseAssetId', null],
    },
    {
      rowData: ['TestAsset', null, 'sitewiseAssetModelId', null],
    },
  ],
};

describe('Advanced Search', () => {
  afterEach(() => {
    // don't cache between tests
    queryClient.clear();
  });

  it('should display advanced search table when kGDatamodule is provided', async () => {
    const mockClient = {
      send: jest.fn().mockResolvedValueOnce([]),
    } as unknown as IoTSiteWiseClient;

    const mockDataModule = {} as TwinMakerKGQueryDataModule;
    const user = userEvent.setup();

    render(
      <Wrapper>
        <QueryEditor client={mockClient} kGDatamodule={mockDataModule} />
      </Wrapper>
    );

    await waitFor(() => expect(screen.queryByText('Loading assets...')).not.toBeInTheDocument());
    expect(screen.getByRole('tab', { name: 'Advanced search' })).toBeVisible();
    await user.click(screen.getByRole('tab', { name: 'Advanced search' }));
    expect(screen.getByRole('textbox', { name: 'Search Term' })).toBeVisible();
  });

  it('should display results as displayName when searching for a property', async () => {
    const mockClient = {
      send: jest.fn().mockResolvedValueOnce([]),
    } as unknown as IoTSiteWiseClient;

    const mockDataModule = {
      executeQuery: jest.fn().mockResolvedValueOnce(mockResults),
    } as TwinMakerKGQueryDataModule;
    const user = userEvent.setup();

    render(
      <Wrapper>
        <QueryEditor client={mockClient} kGDatamodule={mockDataModule} />
      </Wrapper>
    );

    await waitFor(() => expect(screen.queryByText('Loading assets...')).not.toBeInTheDocument());
    expect(screen.getByRole('tab', { name: 'Advanced search' })).toBeVisible();
    await user.click(screen.getByRole('tab', { name: 'Advanced search' }));

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });

    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => expect(screen.queryByText('No results')).not.toBeInTheDocument());
    expect(screen.queryByText('temperature')).toBeVisible();
    expect(screen.queryByText('speed')).toBeVisible();
  });

  it('should allow selection of multiple results with pagination', async () => {
    const mockPaginatedResults = {
      columnDescriptions: [
        {
          name: 'assetName',
          type: 'VALUE',
        },
        {
          name: 'propertyId',
          type: 'VALUE',
        },
        {
          name: 'propertyName',
          type: 'VALUE',
        },
        {
          name: 'displayName',
          type: 'VALUE',
        },
      ],
      rows: [
        {
          rowData: ['asset1', 'propertyId1', 'propertyName1', 'temperature1'],
        },
        {
          rowData: ['asset2', 'propertyId2', 'propertyName2', 'temperature2'],
        },
        {
          rowData: ['asset3', 'propertyId3', 'propertyName3', 'temperature3'],
        },
        {
          rowData: ['asset4', 'propertyId4', 'propertyName4', 'temperature4'],
        },
        {
          rowData: ['asset5', 'propertyId5', 'propertyName5', 'temperature15'],
        },
        {
          rowData: ['asset6', 'propertyId6', 'propertyName6', 'temperature16'],
        },
        {
          rowData: ['asset7', 'propertyId7', 'propertyName7', 'temperature17'],
        },
        {
          rowData: ['asset8', 'propertyId8', 'propertyName8', 'temperature18'],
        },
        {
          rowData: ['asset9', 'propertyId9', 'propertyName9', 'temperature19'],
        },
        {
          rowData: ['asset10', 'propertyId10', 'propertyName10', 'temperature110'],
        },
        {
          rowData: ['asset11', 'propertyId11', 'propertyName11', 'temperature11'],
        },
        {
          rowData: ['TestAsset', null, 'sitewiseAssetId', null],
        },
        {
          rowData: ['TestAsset', null, 'sitewiseAssetModelId', null],
        },
      ],
    };
    const mockClient = {
      send: jest.fn().mockResolvedValueOnce([]),
    } as unknown as IoTSiteWiseClient;

    const mockDataModule = {
      executeQuery: jest.fn().mockResolvedValueOnce(mockPaginatedResults),
    } as TwinMakerKGQueryDataModule;
    const user = userEvent.setup();

    render(
      <Wrapper>
        <QueryEditor client={mockClient} kGDatamodule={mockDataModule} />
      </Wrapper>
    );

    await waitFor(() => expect(screen.queryByText('Loading assets...')).not.toBeInTheDocument());
    expect(screen.getByRole('tab', { name: 'Advanced search' })).toBeVisible();
    await user.click(screen.getByRole('tab', { name: 'Advanced search' }));

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });

    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => expect(screen.queryByText('No results')).not.toBeInTheDocument());
    await user.click(screen.getByRole('checkbox', { name: 'Select property temperature1' }));
    await user.click(screen.getByRole('checkbox', { name: 'Select property temperature2' }));

    await user.click(screen.getByRole('button', { name: 'Next page' }));
    await user.click(screen.getByRole('checkbox', { name: 'Select property temperature11' }));
  });

  it('should allow changing preferences like enabling propertyName column', async () => {
    const mockClient = {
      send: jest.fn().mockResolvedValueOnce([]),
    } as unknown as IoTSiteWiseClient;

    const mockDataModule = {
      executeQuery: jest.fn().mockResolvedValueOnce(mockResults),
    } as TwinMakerKGQueryDataModule;
    const user = userEvent.setup();

    render(
      <Wrapper>
        <QueryEditor client={mockClient} kGDatamodule={mockDataModule} />
      </Wrapper>
    );

    await waitFor(() => expect(screen.queryByText('Loading assets...')).not.toBeInTheDocument());
    expect(screen.getByRole('tab', { name: 'Advanced search' })).toBeVisible();
    await user.click(screen.getByRole('tab', { name: 'Advanced search' }));
    await user.click(screen.getByRole('button', { name: 'Preferences' }));
    await user.click(screen.getByRole('checkbox', { name: 'Property Name' }));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });

    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => expect(screen.queryByText('No results')).not.toBeInTheDocument());

    expect(screen.queryByText('property1')).toBeVisible();
    expect(screen.queryByText('property2')).toBeVisible();
    expect(screen.queryByText('-')).toBeVisible(); // property without DisplayName
  });

  it('should handle an error if KG resposne cannot be parsed', async () => {
    // No assetName column should result in an error
    const mockInvalidResults = {
      columnDescriptions: [
        {
          name: 'propertyId',
          type: 'VALUE',
        },
        {
          name: 'propertyName',
          type: 'VALUE',
        },
        {
          name: 'displayName',
          type: 'VALUE',
        },
      ],
      rows: [
        {
          rowData: ['asset1', 'propertyId1', 'property1', 'temperature'],
        },
        {
          rowData: ['Asset2', 'PropertyId2', 'property2', 'speed'],
        },
        {
          rowData: ['Asset3', 'PropertyId3', 'property3'],
        },
        {
          rowData: ['TestAsset', null, 'sitewiseAssetId', null],
        },
        {
          rowData: ['TestAsset', null, 'sitewiseAssetModelId', null],
        },
      ],
    };
    const mockClient = {
      send: jest.fn().mockResolvedValueOnce([]),
    } as unknown as IoTSiteWiseClient;

    const mockDataModule = {
      executeQuery: jest.fn().mockResolvedValueOnce(mockInvalidResults),
    } as TwinMakerKGQueryDataModule;
    const user = userEvent.setup();

    render(
      <Wrapper>
        <QueryEditor client={mockClient} kGDatamodule={mockDataModule} />
      </Wrapper>
    );

    await waitFor(() => expect(screen.queryByText('Loading assets...')).not.toBeInTheDocument());
    expect(screen.getByRole('tab', { name: 'Advanced search' })).toBeVisible();
    await user.click(screen.getByRole('tab', { name: 'Advanced search' }));

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });

    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => expect(screen.queryByText('No results')).toBeVisible());
  });
});
