import type {
  ExecuteQueryRequest,
  ExecuteQueryResponse,
} from '@aws-sdk/client-iotsitewise';
import { useListRequest } from '../use-list-request';
import type { ExecuteQuery } from '../../types/request-fn';
import type {
  UseListAPIBaseOptions,
  UseListAPIBaseResult,
} from '../../types/requests';

export interface UseExecuteQueryOptions extends UseListAPIBaseOptions {
  queryStatement: Parameters<ExecuteQuery>[0]['queryStatement'];
  executeQuery?: ExecuteQuery;
}

export interface UseExecuteQueryResult<Resource> extends UseListAPIBaseResult {
  resources: Resource[];
}

// TODO: Enable custom formatter function?
export function useExecuteQuery<Resource>({
  queryStatement,
  pageSize: maxResults,
  executeQuery,
  isEnabled,
}: UseExecuteQueryOptions): UseExecuteQueryResult<Resource> {
  return useListRequest<ExecuteQueryRequest, ExecuteQueryResponse, Resource>({
    isEnabled:
      executeQuery !== undefined && Boolean(queryStatement) && isEnabled,
    pageSize: maxResults,
    resourceId: 'QueryResult',
    parameters: { queryStatement },
    requestFn: executeQuery,
    responseTransformer: ({ rows = [] }) => rows as Resource[],
  });
}
