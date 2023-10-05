import { type ListWorkspacesResponse } from '@aws-sdk/client-iottwinmaker';
import { rest } from 'msw';

import { WORKSPACE_SUMMARIES } from '../../resources/workspaces';

export function listWorkspacesHandler() {
  return rest.post('', (_req, res, ctx) => {
    const response: ListWorkspacesResponse = {
      workspaceSummaries: WORKSPACE_SUMMARIES,
      nextToken: undefined,
    };

    return res(ctx.status(200), ctx.json(response));
  });
}
