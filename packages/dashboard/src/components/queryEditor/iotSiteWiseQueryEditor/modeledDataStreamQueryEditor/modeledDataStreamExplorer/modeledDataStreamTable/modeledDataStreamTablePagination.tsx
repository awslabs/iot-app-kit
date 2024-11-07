import Pagination, {
  type PaginationProps,
} from '@cloudscape-design/components/pagination';

type ModeledDataStreamTablePaginationProps = PaginationProps;

export function ModeledDataStreamTablePagination({
  ...props
}: ModeledDataStreamTablePaginationProps) {
  return <Pagination {...props} />;
}
