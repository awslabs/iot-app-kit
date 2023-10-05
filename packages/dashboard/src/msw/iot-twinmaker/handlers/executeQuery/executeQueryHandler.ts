import { type ExecuteQueryRequest, type ExecuteQueryResponse } from '@aws-sdk/client-iottwinmaker';
import { rest } from 'msw';

import { WORKSPACE_SUMMARIES } from '../../resources/workspaces';

/**
 * @remarks
 *
 * ExecuteQuery is a complex API and it is not possible to effectively fake it. Manually test
 * against the real API when building features utilizing the API.
 */
export function executeQueryHandler() {
  return rest.post('', async (req, res, ctx) => {
    const { workspaceId, queryStatement } = await req.json<ExecuteQueryRequest>();

    if (!workspaceId || !queryStatement) {
      return res(ctx.status(400));
    }

    if (!WORKSPACE_SUMMARIES.find((workspace) => workspace.workspaceId === workspaceId)) {
      return res(ctx.status(404));
    }

    const response: ExecuteQueryResponse = {
      columnDescriptions: [],
      rows: [],
      nextToken: undefined,
    };

    return res(ctx.status(200), ctx.json(response));
  });
}
