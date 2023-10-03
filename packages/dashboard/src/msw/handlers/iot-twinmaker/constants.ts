import { type WorkspaceSummary } from '@aws-sdk/client-iottwinmaker';
import { v4 as uuid } from 'uuid';

import { DEFAULT_REGION } from '~/msw/constants';

export const IOT_TWIN_MAKER_BASE_URL = `https://api.iottwinmaker.${DEFAULT_REGION}.amazonaws.com`;

function createWorkspaceSummary(workspaceSummary: Partial<WorkspaceSummary> = {}) {
  const workspaceId = uuid();

  return {
    arn:
      workspaceSummary.arn ??
      `arn:aws:iotsitewise:${DEFAULT_REGION}:000000000000:${workspaceSummary.workspaceId ?? workspaceId}`,
    workspaceId: workspaceSummary.workspaceId ?? workspaceId,
    creationDateTime: new Date(0),
    updateDateTime: new Date(0),
  } as const satisfies WorkspaceSummary;
}

export const SITES_WORKSPACE_SUMMARY = createWorkspaceSummary({ workspaceId: 'Sites' });
export const MACHINES_WORKSPACE_SUMMARY = createWorkspaceSummary({ workspaceId: 'Machines' });
export const VEHICLES_WORKSPACE_SUMMARY = createWorkspaceSummary({ workspaceId: 'Vehicles' });
