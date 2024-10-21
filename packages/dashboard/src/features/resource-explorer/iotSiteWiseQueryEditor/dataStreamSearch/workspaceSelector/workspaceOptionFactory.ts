import type { WorkspaceOption } from './types';

export class WorkspaceOptionFactory {
  public create({ workspaceId }: { workspaceId?: string }): WorkspaceOption {
    return {
      value: workspaceId,
    };
  }
}
