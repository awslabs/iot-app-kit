import { type ListWorkspacesRequest } from '@aws-sdk/client-iottwinmaker';
import { RestContext, ResponseResolver, RestRequest } from 'msw';

export function createFailedListWorkspacesResolver(status: 400 | 402 | 429 | 500) {
  const failedListWorkspacesResolver: ResponseResolver<RestRequest<ListWorkspacesRequest>, RestContext> = (
    _req,
    res,
    ctx
  ) => {
    return res(ctx.status(status));
  };

  return failedListWorkspacesResolver;
}
