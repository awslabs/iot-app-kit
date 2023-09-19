import { type ListWorkspacesRequest, type ListWorkspacesResponse } from '@aws-sdk/client-iottwinmaker';
import { RestContext, ResponseResolver, RestRequest } from 'msw';
import { v4 as uuid } from 'uuid';

export const listWorkspacesRequestStub: ResponseResolver<RestRequest<ListWorkspacesRequest>, RestContext> = (
  _req,
  res,
  ctx
) => {
  const workspaceSummaries = new Array(5).fill(undefined).map(() => {
    const workspaceId = uuid();

    return {
      workspaceId,
      arn: `arn:aws:iottwinmaker:us-west-2:123456789012:workspace/${workspaceId}`,
      // Note: TS types appear to be broken for this field. It's actually a number.
      creationDateTime: Date.now() as unknown as Date,
      updateDateTime: Date.now() as unknown as Date,
    };
  });

  return res(
    ctx.status(200),
    ctx.json({
      workspaceSummaries,
      nextToken: undefined,
    } satisfies ListWorkspacesResponse)
  );
};
