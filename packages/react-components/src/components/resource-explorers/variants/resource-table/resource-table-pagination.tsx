import CloudscapePagination, {
  type PaginationProps as CloudscapePaginationProps,
} from '@cloudscape-design/components/pagination';
import React from 'react';

import type {
  HasNextPage,
  NextPage,
  RequestIsLoading,
} from '../../types/common';

type OnClickChangePage = NonNullable<CloudscapePaginationProps['onChange']>;

export interface ResourceTablePaginationProps {
  currentPage: number;
  totalPageCount: number;
  hasNextPage?: HasNextPage;
  onClickChangePage: OnClickChangePage;
  onClickNextPage: NextPage;
  isLoading?: RequestIsLoading;
}

export function ResourceTablePagination({
  currentPage,
  totalPageCount,
  hasNextPage,
  onClickChangePage,
  onClickNextPage,
  isLoading,
}: ResourceTablePaginationProps) {
  return (
    <CloudscapePagination
      disabled={isLoading}
      currentPageIndex={currentPage}
      pagesCount={totalPageCount}
      openEnd={hasNextPage}
      onChange={onClickChangePage}
      onNextPageClick={
        currentPage === totalPageCount ? onClickNextPage : () => {} // no-op to prevent fetching on every next page click
      }
    />
  );
}
