import { QueryEditor } from '../queryEditor';
import { type ListAssetsCommandOutput, type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { createAssetPropertyStub } from '../helpers/test/createAssetPropertyStub';
import { createAssetSummaryStub } from '../helpers/test/createAssetSummaryStub';
import { fromSummaryToDescription } from '../helpers/test/fromSummaryToDescription';

const queryClient = new QueryClient();

const Wrapper = ({ children }: React.PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('Selection', () => {
  afterEach(() => {
    // don't cache between tests
    queryClient.clear();
  });

  it('should list the asset properties of the selected asset(s)', async () => {
    const rootAssetA = createAssetSummaryStub();
    const rootAssetB = createAssetSummaryStub();
    const listRootAssetsStub: ListAssetsCommandOutput = { assetSummaries: [rootAssetA, rootAssetB], $metadata: {} };

    const assetProperties = [
      createAssetPropertyStub({
        alias: '/test/propertyA1',
        dataType: 'BOOLEAN',
        name: 'Test Property A1',
        unit: 'isActive',
      }),
      createAssetPropertyStub({
        alias: '/test/propertyB',
        dataType: 'INTEGER',
        name: 'Test Property B1',
        unit: 'm/s',
      }),
      createAssetPropertyStub({
        alias: '/test/propertyC',
        dataType: 'DOUBLE',
        name: 'Test Property C1',
        unit: 'm/s',
      }),
      createAssetPropertyStub({
        dataType: 'STRING',
        name: 'Test Property D1',
        unit: 'direction',
      }),
      createAssetPropertyStub({
        dataType: 'STRUCT',
        dataTypeSpec: 'ALARM',
        name: 'Test Property E1',
      }),
      createAssetPropertyStub({
        alias: '/test/propertyA1',
        dataType: 'BOOLEAN',
        name: 'Test Property A2',
        unit: 'isActive',
      }),
      createAssetPropertyStub({
        alias: '/test/propertyB',
        dataType: 'INTEGER',
        name: 'Test Property B2',
        unit: 'm/s',
      }),
      createAssetPropertyStub({
        alias: '/test/propertyC',
        dataType: 'DOUBLE',
        name: 'Test Property C2',
        unit: 'm/s',
      }),
      createAssetPropertyStub({
        dataType: 'STRING',
        name: 'Test Property D2',
        unit: 'direction',
      }),
      createAssetPropertyStub({
        dataType: 'STRUCT',
        dataTypeSpec: 'ALARM',
        name: 'Test Property E2',
      }),
    ];
    const rootAssetADescription = fromSummaryToDescription({
      ...rootAssetA,
      assetProperties: [...assetProperties.slice(0, 3)],
      assetCompositeModels: [
        {
          name: 'Test Composite Model A1',
          type: 'COMPOSITE',
          properties: [...assetProperties.slice(3, 4)],
        },
        {
          name: 'Test Composite Model B1',
          type: 'COMPOSITE',
          properties: [...assetProperties.slice(4, 5)],
        },
      ],
    });
    const rootAssetBDescription = fromSummaryToDescription({
      ...rootAssetB,
      assetProperties: [...assetProperties.slice(5, 8)],
      assetCompositeModels: [
        {
          name: 'Test Composite Model A1',
          type: 'COMPOSITE',
          properties: [...assetProperties.slice(8, 9)],
        },
        {
          name: 'Test Composite Model B1',
          type: 'COMPOSITE',
          properties: [...assetProperties.slice(9)],
        },
      ],
    });

    const mockClient = {
      send: jest
        .fn()
        .mockResolvedValueOnce(listRootAssetsStub)
        .mockResolvedValueOnce(rootAssetADescription)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(rootAssetBDescription),
    } as unknown as IoTSiteWiseClient;
    const user = userEvent.setup();

    render(
      <Wrapper>
        <QueryEditor client={mockClient} />
      </Wrapper>
    );

    await waitFor(() => expect(screen.queryByText('Loading assets...')).not.toBeInTheDocument());

    expect(screen.getByText('No asset properties.')).toBeVisible();

    await user.click(screen.getByRole('checkbox', { name: `Select asset ${rootAssetA.name}` }));

    await waitFor(() => expect(screen.getByText(assetProperties[0].name)).toBeVisible());
    expect(screen.getByText(assetProperties[1].name)).toBeVisible();
    expect(screen.getByText(assetProperties[2].name)).toBeVisible();
    expect(screen.getByText(assetProperties[3].name)).toBeVisible();
    expect(screen.getByText(assetProperties[4].name)).toBeVisible();

    await user.click(screen.getByRole('checkbox', { name: `Select asset ${rootAssetB.name}` }));

    await waitFor(() => expect(screen.getByText(assetProperties[5].name)).toBeVisible());
    expect(screen.getByText(assetProperties[6].name)).toBeVisible();
    expect(screen.getByText(assetProperties[7].name)).toBeVisible();
    expect(screen.getByText(assetProperties[8].name)).toBeVisible();
    expect(screen.getByText(assetProperties[9].name)).toBeVisible();
    expect(screen.getByText(assetProperties[1].name)).toBeVisible();
    expect(screen.getByText(assetProperties[2].name)).toBeVisible();
    expect(screen.getByText(assetProperties[3].name)).toBeVisible();
    expect(screen.getByText(assetProperties[4].name)).toBeVisible();

    // FIXME: The label should say "Deselect asset ..."
    await user.click(screen.getByRole('checkbox', { name: `Select asset ${rootAssetA.name}` }));

    await waitFor(() => expect(screen.queryByText(assetProperties[0].name)).not.toBeInTheDocument());
    expect(screen.queryByText(assetProperties[1].name)).not.toBeInTheDocument();
    expect(screen.queryByText(assetProperties[2].name)).not.toBeInTheDocument();
    expect(screen.queryByText(assetProperties[3].name)).not.toBeInTheDocument();
    expect(screen.queryByText(assetProperties[4].name)).not.toBeInTheDocument();
    expect(screen.getByText(assetProperties[5].name)).toBeVisible();
    expect(screen.getByText(assetProperties[6].name)).toBeVisible();
    expect(screen.getByText(assetProperties[7].name)).toBeVisible();
    expect(screen.getByText(assetProperties[8].name)).toBeVisible();
    expect(screen.getByText(assetProperties[9].name)).toBeVisible();

    // FIXME: The label should say "Deselect asset ..."
    await user.click(screen.getByRole('checkbox', { name: `Select asset ${rootAssetB.name}` }));

    await waitFor(() => expect(screen.queryByText(assetProperties[5].name)).not.toBeInTheDocument());
    expect(screen.queryByText(assetProperties[1].name)).not.toBeInTheDocument();
    expect(screen.queryByText(assetProperties[2].name)).not.toBeInTheDocument();
    expect(screen.queryByText(assetProperties[3].name)).not.toBeInTheDocument();
    expect(screen.queryByText(assetProperties[4].name)).not.toBeInTheDocument();
    expect(screen.queryByText(assetProperties[5].name)).not.toBeInTheDocument();
    expect(screen.queryByText(assetProperties[6].name)).not.toBeInTheDocument();
    expect(screen.queryByText(assetProperties[7].name)).not.toBeInTheDocument();
    expect(screen.queryByText(assetProperties[8].name)).not.toBeInTheDocument();
    expect(screen.queryByText(assetProperties[9].name)).not.toBeInTheDocument();

    expect(screen.getByText('No asset properties.')).toBeVisible();
  });
});
