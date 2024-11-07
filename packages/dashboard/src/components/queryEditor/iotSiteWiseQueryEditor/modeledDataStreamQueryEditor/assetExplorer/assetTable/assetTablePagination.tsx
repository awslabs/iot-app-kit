import Pagination, {
  type PaginationProps,
} from '@cloudscape-design/components/pagination';

export type AssetTablePaginationProps = PaginationProps;

export function AssetTablePagination({ ...props }: AssetTablePaginationProps) {
  return (
    <Pagination
      {...props}
      ariaLabels={{
        nextPageLabel: 'Next page assets',
        paginationLabel: 'Asset explorer pagination',
        previousPageLabel: 'Previous page assets',
        pageLabel: (pageNumber) => `Page ${pageNumber} assets`,
      }}
    />
  );
}
