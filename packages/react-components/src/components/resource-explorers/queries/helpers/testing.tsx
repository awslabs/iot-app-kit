import { act, renderHook, waitFor } from '@testing-library/react';
import {
  type AssetSummary,
  type AssetModelSummary,
  type TimeSeriesSummary,
  type AssetPropertySummary,
  type AssetModelPropertySummary,
} from '@aws-sdk/client-iotsitewise';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useRef, type PropsWithChildren } from 'react';
import { v4 as uuid } from 'uuid';

import type { ListAssetModels, ListAssets } from '../../types/data-source';
import type { UseListAPIBaseResult } from '../types';

export function TestWrapper({ children }: PropsWithChildren) {
  const queryClientRef = useRef<QueryClient | undefined>(undefined);

  function getQueryClient(): QueryClient {
    if (!queryClientRef.current) {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
        logger: {
          log: console.log,
          warn: console.warn,
          error: () => {},
        },
      });

      queryClientRef.current = queryClient;

      return queryClient;
    }

    return queryClientRef.current;
  }

  return (
    <QueryClientProvider client={getQueryClient()}>
      {children}
    </QueryClientProvider>
  );
}

export function createFakeListAssetsResponse({
  nextToken,
}: { nextToken?: string } = {}) {
  const response = {
    assetSummaries: [
      createFakeAssetSummary(),
      createFakeAssetSummary(),
      createFakeAssetSummary(),
    ],
    nextToken,
  } satisfies Awaited<ReturnType<ListAssets>>;

  return response;
}

export function createFakeAssetSummary(): AssetSummary {
  const id = uuid();

  return {
    id,
    arn: 'arn',
    name: 'asset name',
    assetModelId: 'assetModelId',
    creationDate: new Date(0),
    lastUpdateDate: new Date(1),
    status: {
      state: 'ACTIVE',
    },
    hierarchies: [],
  };
}

export function createFakeListAssetModelsResponse({
  nextToken,
}: { nextToken?: string } = {}) {
  const response = {
    assetModelSummaries: [
      createFakeAssetModelSummary(),
      createFakeAssetModelSummary(),
      createFakeAssetModelSummary(),
    ],
    nextToken,
  } satisfies Awaited<ReturnType<ListAssetModels>>;

  return response;
}

export function createFakeAssetModelSummary(): AssetModelSummary {
  const id = uuid();

  return {
    id,
    arn: 'arn',
    name: 'asset model name',
    description: 'asset model description',
    creationDate: new Date(0),
    lastUpdateDate: new Date(1),
    status: {
      state: 'ACTIVE',
    },
  };
}

export function createFakeAssetPropertySummary() {
  const id = uuid();

  return {
    id,
  } satisfies AssetPropertySummary;
}

export function createFakeAssetModelPropertySummary(id: string) {
  return {
    id,
    name: 'asset model property name',
    dataType: 'STRING',
    type: {},
  } satisfies AssetModelPropertySummary;
}

export function createFakeTimeSeriesSummary(): TimeSeriesSummary {
  const timeSeriesId = uuid();

  return {
    timeSeriesId,
    dataType: 'STRING',
    timeSeriesArn: 'arn',
    timeSeriesCreationDate: new Date(0),
    timeSeriesLastUpdateDate: new Date(0),
  };
}

type Hook<Options, Result> = (options: Options) => Result;

interface TestUseListResourcesHook<Options, Result> {
  resourceName: string;
  hook: Hook<Options, Result>;
  renderHookWithEmptyList?: () => {
    resourceHookOptions: Options;
  };
  renderHookWithSinglePage?: () => {
    expectedResources: unknown[];
    resourceHookOptions: Options;
  };
  renderHookWithMultiplePages?: () => {
    expectedResourcesPage1: unknown[];
    expectedResourcesPage2: unknown[];
    expectedResourcesPage3: unknown[];
    resourceHookOptions: Options;
  };
  renderHookWithError?: () => {
    resourceHookOptions: Options;
  };
  renderDisabledRequest?: () => {
    resourceHookOptions: Options;
  };
}

/** Test suite which should pass for all paginated resource hooks. */
export function testUseListResourcesHook<
  Options,
  Result extends UseListAPIBaseResult
>({
  resourceName,
  hook,
  renderHookWithEmptyList,
  renderHookWithSinglePage,
  renderHookWithMultiplePages,
  renderHookWithError,
  renderDisabledRequest,
}: TestUseListResourcesHook<Options, Result>) {
  if (renderHookWithSinglePage) {
    it('returns resources', async () => {
      const { expectedResources, resourceHookOptions } =
        renderHookWithSinglePage();

      const { result } = renderHook(() => hook(resourceHookOptions), {
        wrapper: TestWrapper,
      });

      expect(result.current).toEqual(
        expect.objectContaining({
          [resourceName]: [],
          hasNextPage: false,
          nextPage: expect.toBeFunction(),
          isSuccess: false,
          isFetching: true,
          error: null,
        })
      );

      await waitFor(() => expect(result.current.isSuccess).toBeTrue());

      expect(result.current).toEqual(
        expect.objectContaining({
          [resourceName]: expectedResources,
          hasNextPage: false,
          nextPage: expect.toBeFunction(),
          isSuccess: true,
          isFetching: false,
          error: null,
        })
      );
    });
  }

  if (renderHookWithEmptyList) {
    it('returns an empty list when there are no resources', async () => {
      const { resourceHookOptions } = renderHookWithEmptyList();

      const { result } = renderHook(() => hook(resourceHookOptions), {
        wrapper: TestWrapper,
      });

      expect(result.current).toEqual(
        expect.objectContaining({
          [resourceName]: [],
          hasNextPage: false,
          nextPage: expect.toBeFunction(),
          isSuccess: false,
          isFetching: true,
          error: null,
        })
      );

      await waitFor(() => expect(result.current.isSuccess).toBeTrue());

      expect(result.current).toEqual(
        expect.objectContaining({
          [resourceName]: [],
          hasNextPage: false,
          nextPage: expect.toBeFunction(),
          isSuccess: true,
          isFetching: false,
          error: null,
        })
      );
    });
  }

  if (renderHookWithMultiplePages) {
    it('returns a paginated list of resources', async () => {
      const {
        expectedResourcesPage1,
        expectedResourcesPage2,
        expectedResourcesPage3,
        resourceHookOptions,
      } = renderHookWithMultiplePages();

      const { result } = renderHook(() => hook(resourceHookOptions), {
        wrapper: TestWrapper,
      });

      expect(result.current).toEqual(
        expect.objectContaining({
          [resourceName]: [],
          // hasNextPage: false,
          nextPage: expect.toBeFunction(),
          isSuccess: false,
          isFetching: true,
          error: null,
        })
      );

      await waitFor(() => expect(result.current.isSuccess).toBeTrue());

      // First page
      expect(result.current).toEqual(
        expect.objectContaining({
          [resourceName]: expectedResourcesPage1,
          hasNextPage: true,
          nextPage: expect.toBeFunction(),
          isSuccess: true,
          isFetching: false,
          error: null,
        })
      );

      act(() => {
        result.current.nextPage();
      });
      await waitFor(() => expect(result.current.isFetching).toBeFalse());

      // First + second pages
      expect(result.current).toEqual(
        expect.objectContaining({
          [resourceName]: [
            ...expectedResourcesPage1,
            ...expectedResourcesPage2,
          ],
          hasNextPage: true,
          nextPage: expect.toBeFunction(),
          isSuccess: true,
          isFetching: false,
          error: null,
        })
      );

      act(() => {
        result.current.nextPage();
      });
      await waitFor(() => expect(result.current.isFetching).toBeFalse());

      // All three pages
      expect(result.current).toEqual(
        expect.objectContaining({
          [resourceName]: [
            ...expectedResourcesPage1,
            ...expectedResourcesPage2,
            ...expectedResourcesPage3,
          ],
          hasNextPage: false,
          nextPage: expect.toBeFunction(),
          isSuccess: true,
          isFetching: false,
          error: null,
        })
      );

      // Attempt to paginate again
      act(() => {
        result.current.nextPage();
      });
      await waitFor(() => expect(result.current.isFetching).toBeFalse());

      // Return same three pages
      expect(result.current).toEqual(
        expect.objectContaining({
          [resourceName]: [
            ...expectedResourcesPage1,
            ...expectedResourcesPage2,
            ...expectedResourcesPage3,
          ],
          hasNextPage: false,
          nextPage: expect.toBeFunction(),
          isSuccess: true,
          isFetching: false,
          error: null,
        })
      );
    });
  }

  if (renderHookWithError) {
    it('handles errors', async () => {
      const { resourceHookOptions } = renderHookWithError();

      const { result } = renderHook(() => hook(resourceHookOptions), {
        wrapper: TestWrapper,
      });

      expect(result.current).toEqual(
        expect.objectContaining({
          [resourceName]: [],
          hasNextPage: false,
          nextPage: expect.toBeFunction(),
          isSuccess: false,
          isFetching: true,
          error: null,
        })
      );

      await waitFor(() => expect(result.current.error).not.toBeNull());

      expect(result.current).toEqual(
        expect.objectContaining({
          [resourceName]: [],
          hasNextPage: false,
          nextPage: expect.toBeFunction(),
          isSuccess: false,
          isFetching: false,
          error: expect.objectContaining({ message: expect.any(String) }),
        })
      );
    });
  }

  if (renderDisabledRequest) {
    it('does not send request when disabled', async () => {
      const { resourceHookOptions } = renderDisabledRequest();

      const { result } = renderHook(() => hook(resourceHookOptions), {
        wrapper: TestWrapper,
      });

      expect(result.current).toEqual(
        expect.objectContaining({
          [resourceName]: [],
          hasNextPage: false,
          nextPage: expect.toBeFunction(),
          isSuccess: false,
          isFetching: false,
          error: null,
        })
      );
    });
  }
}
