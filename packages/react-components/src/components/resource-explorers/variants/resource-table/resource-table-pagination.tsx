import CloudscapePagination, {
  type PaginationProps as CloudscapePaginationProps,
} from '@cloudscape-design/components/pagination';

type OnClickChangePage = NonNullable<CloudscapePaginationProps['onChange']>;

export interface ResourceTablePaginationProps {
  currentPage: number;
  totalPageCount: number;
  onClickChangePage: OnClickChangePage;
  isLoadingResources?: boolean;
}

export function ResourceTablePagination({
  currentPage,
  totalPageCount,
  onClickChangePage,
  isLoadingResources,
}: ResourceTablePaginationProps) {
  return (
    <CloudscapePagination
      currentPageIndex={currentPage}
      pagesCount={totalPageCount}
      openEnd={isLoadingResources}
      onChange={onClickChangePage}
    />
  );
}
