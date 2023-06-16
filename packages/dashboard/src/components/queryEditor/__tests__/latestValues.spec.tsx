import {
  type BatchGetAssetPropertyValueCommandOutput,
  type ListAssetsCommandOutput,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import { QueryEditor } from '../queryEditor';
import { createAssetSummaryStub } from '../helpers/test/createAssetSummaryStub';
import { createAssetPropertyStub } from '../helpers/test/createAssetPropertyStub';
import { fromSummaryToDescription } from '../helpers/test/fromSummaryToDescription';

const queryClient = new QueryClient();

const Wrapper = ({ children }: React.PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('Latest values', () => {
  afterEach(() => {
    // don't cache queries between tests
    queryClient.clear();
  });

  it('should request the latest values for the asset properties of the selected asset(s)', async () => {
    const rootAsset = createAssetSummaryStub();
    const listRootAssetsStub: ListAssetsCommandOutput = { assetSummaries: [rootAsset], $metadata: {} };

    const rootAssetDescription = fromSummaryToDescription({
      ...rootAsset,
      assetProperties: [createAssetPropertyStub(), createAssetPropertyStub(), createAssetPropertyStub()],
    });

    const batchGetAssetPropertyValueStub: BatchGetAssetPropertyValueCommandOutput = {
      successEntries: [
        {
          entryId: `${rootAssetDescription.assetId.slice(0, 8)}--${rootAssetDescription.assetProperties[0].id}`,
          assetPropertyValue: {
            quality: 'GOOD',
            timestamp: {
              timeInSeconds: 0,
              offsetInNanos: 0,
            },
            value: {
              stringValue: 'FIRST!',
            },
          },
        },
        {
          entryId: `${rootAssetDescription.assetId.slice(0, 8)}--${rootAssetDescription.assetProperties[1].id}`,
          assetPropertyValue: {
            quality: 'GOOD',
            timestamp: {
              timeInSeconds: 0,
              offsetInNanos: 0,
            },
            value: {
              integerValue: 123456789012,
            },
          },
        },
        {
          entryId: `${rootAssetDescription.assetId.slice(0, 8)}--${rootAssetDescription.assetProperties[2].id}`,
          assetPropertyValue: {
            quality: 'GOOD',
            timestamp: {
              timeInSeconds: 0,
              offsetInNanos: 0,
            },
            value: {
              doubleValue: 3.141592653589793,
            },
          },
        },
      ],
      skippedEntries: [],
      errorEntries: [],
      $metadata: {},
    };

    const mockClient = {
      send: jest
        .fn()
        .mockResolvedValueOnce(listRootAssetsStub)
        .mockResolvedValueOnce(rootAssetDescription)
        .mockResolvedValueOnce(batchGetAssetPropertyValueStub),
    } as unknown as IoTSiteWiseClient;
    const user = userEvent.setup();

    render(
      <Wrapper>
        <QueryEditor client={mockClient} />
      </Wrapper>
    );

    await waitFor(() => expect(screen.queryByText('Loading assets...')).not.toBeInTheDocument());

    // select the asset
    await user.click(screen.getByRole('checkbox', { name: `Select asset ${rootAsset.name}` }));

    // see the values
    await waitFor(() => expect(screen.getByText('FIRST!')).toBeVisible());
    expect(screen.getByText('123456789012')).toBeVisible();
    expect(screen.getByText('3.141592653589793')).toBeVisible();
  });
});
