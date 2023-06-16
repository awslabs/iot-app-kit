import {
  type DescribeAssetCommandOutput,
  type ListAssetsCommandOutput,
  type ListAssociatedAssetsCommandOutput,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { v4 as uuid } from 'uuid';

import { QueryEditor } from '../queryEditor';
import { createAssetSummaryStub } from '../helpers/test/createAssetSummaryStub';
import { fromSummaryToDescription } from '../helpers/test/fromSummaryToDescription';

const queryClient = new QueryClient();

const Wrapper = ({ children }: React.PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('Traversal', () => {
  afterEach(() => {
    // don't cache between tests
    queryClient.clear();
  });

  it('should render empty state when there are no root assets', async () => {
    const listAssetsOutputStub: ListAssetsCommandOutput = { assetSummaries: [], $metadata: {} };

    const mockClient = {
      send: jest.fn().mockResolvedValueOnce(listAssetsOutputStub),
    } as unknown as IoTSiteWiseClient;

    render(
      <Wrapper>
        <QueryEditor client={mockClient} />
      </Wrapper>
    );

    // wait for root assets to finish loading
    await waitFor(() => expect(screen.queryByText('Loading assets...')).not.toBeInTheDocument());

    // see empty state
    expect(screen.getByText('No assets.')).toBeVisible();
  });

  it('should enable traversal down and back up the asset hierarchy', async () => {
    const rootAssetA = createAssetSummaryStub({ hierarchies: [{ id: uuid(), name: 'Test hierarchy' }] });
    const rootAssetB = createAssetSummaryStub();
    const listRootAssetsStub: ListAssetsCommandOutput = { assetSummaries: [rootAssetA, rootAssetB], $metadata: {} };

    const rootAssetADescription = fromSummaryToDescription(rootAssetA);
    const describeAssetStub1: DescribeAssetCommandOutput = { ...rootAssetADescription, $metadata: {} };

    const getParentAssetStub1: ListAssociatedAssetsCommandOutput = {
      // no parents at the root
      assetSummaries: [],
      $metadata: {},
    };

    const childAssetA = createAssetSummaryStub({ hierarchies: [{ id: uuid(), name: 'Test hierarchy' }] });
    const childAssetB = createAssetSummaryStub();
    const listChildAssetsStub: ListAssociatedAssetsCommandOutput = {
      assetSummaries: [childAssetA, childAssetB],
      $metadata: {},
    };

    const childAssetADescription = fromSummaryToDescription(childAssetA);
    const describeAssetStub2: DescribeAssetCommandOutput = { ...childAssetADescription, $metadata: {} };

    const getParentAssetStub2: ListAssociatedAssetsCommandOutput = {
      assetSummaries: [rootAssetA],
      $metadata: {},
    };

    const grandChildAssetA = createAssetSummaryStub();
    const grandChildAssetB = createAssetSummaryStub();
    const listGrandChildAssetsStub: ListAssociatedAssetsCommandOutput = {
      assetSummaries: [grandChildAssetA, grandChildAssetB],
      $metadata: {},
    };

    /**
     * It's not pretty and it's couple to the implementation, yet it works. It also gives us an understanding of the
     * sequence of API calls made.
     */
    const mockClient = {
      send: jest
        .fn()
        .mockResolvedValueOnce(listRootAssetsStub)
        .mockResolvedValueOnce(describeAssetStub1)
        .mockResolvedValueOnce(getParentAssetStub1)
        .mockResolvedValueOnce(listChildAssetsStub)
        .mockResolvedValueOnce(describeAssetStub2)
        .mockResolvedValueOnce(getParentAssetStub2)
        .mockResolvedValueOnce(getParentAssetStub1)
        .mockResolvedValueOnce(listGrandChildAssetsStub)
        .mockResolvedValueOnce(describeAssetStub1)
        .mockResolvedValueOnce(getParentAssetStub1)
        .mockResolvedValueOnce(listChildAssetsStub),
    } as unknown as IoTSiteWiseClient;
    const user = userEvent.setup();

    render(
      <Wrapper>
        <QueryEditor client={mockClient} />
      </Wrapper>
    );

    expect(screen.getByText('Loading assets...')).toBeVisible();

    await waitFor(() => expect(screen.queryByText('Loading assets...')).not.toBeInTheDocument());
    // both root assets are visible in the table
    expect(screen.getByText(rootAssetA.name)).toBeVisible();
    expect(screen.getByText(rootAssetB.name)).toBeVisible();
    // no child assets are visible
    expect(screen.queryByText(childAssetA.name)).not.toBeInTheDocument();
    expect(screen.queryByText(childAssetB.name)).not.toBeInTheDocument();
    expect(screen.queryByText(grandChildAssetA.name)).not.toBeInTheDocument();
    expect(screen.queryByText(grandChildAssetB.name)).not.toBeInTheDocument();

    // click on an assets name
    await user.click(screen.getByText(rootAssetA.name));

    // we see the child assets
    await waitFor(() => expect(screen.getByText(childAssetA.name)).toBeVisible());
    expect(screen.getByText(childAssetB.name)).toBeVisible();

    // the root asset's name is visible in the breadcrumbs
    expect(screen.getByText(rootAssetA.name)).toBeVisible();
    // though we are no longer at the root
    expect(screen.queryByText(rootAssetB.name)).not.toBeInTheDocument();
    // but we aren't at the grandchild level yet
    expect(screen.queryByText(grandChildAssetA.name)).not.toBeInTheDocument();
    expect(screen.queryByText(grandChildAssetB.name)).not.toBeInTheDocument();

    // click on a child asset's name
    await user.click(screen.getByText(childAssetA.name));

    // we see the grandchild assets
    await waitFor(() => expect(screen.getByText(grandChildAssetA.name)).toBeVisible());
    expect(screen.getByText(grandChildAssetB.name)).toBeVisible();

    // the parent asset name is visible in the breadcrumbs
    expect(screen.getByText(childAssetA.name)).toBeVisible();
    // the root asset name is also visible in the breadcrumbs
    expect(screen.getByText(rootAssetA.name)).toBeVisible();

    expect(screen.queryByText(rootAssetB.name)).not.toBeInTheDocument();
    expect(screen.queryByText(childAssetB.name)).not.toBeInTheDocument();

    // we click on the parent asset name in the breadcrumbs
    await user.click(screen.getByText(rootAssetA.name));

    await waitFor(() => expect(screen.getByText(childAssetB.name)).toBeVisible());
    expect(screen.queryByText(grandChildAssetA.name)).not.toBeInTheDocument();
    expect(screen.queryByText(grandChildAssetB.name)).not.toBeInTheDocument();

    // we click the root breadcrumb to go back to the root
    await user.click(screen.getByText('Root'));
    // we are back at the root and we see both root assets
    await waitFor(() => expect(screen.getByText(rootAssetA.name)).toBeVisible());
    expect(screen.getByText(rootAssetB.name)).toBeVisible();
    expect(screen.queryByText(childAssetA.name)).not.toBeInTheDocument();
  });
});
