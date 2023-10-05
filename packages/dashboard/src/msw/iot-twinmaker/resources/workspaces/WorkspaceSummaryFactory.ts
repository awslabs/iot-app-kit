import { type WorkspaceSummary } from '@aws-sdk/client-iottwinmaker';

type PartialWorkspaceSummary = Partial<WorkspaceSummary> & Required<Pick<WorkspaceSummary, 'workspaceId'>>;

export class WorkspaceSummaryFactory {
  public create(partialSummary: PartialWorkspaceSummary): WorkspaceSummary {
    const workspaceSummary = {
      ...this.#createDefaults(partialSummary.workspaceId),
      ...partialSummary,
    };

    return workspaceSummary;
  }

  #createDefaults(workspaceId: WorkspaceSummary['workspaceId']) {
    const arn = `arn:aws:iottwinmaker:us-east-1:123456789012:${workspaceId}`;
    const description = '';
    const creationDateTime = new Date();
    const updateDateTime = new Date();
    const defaults = { arn, workspaceId, creationDateTime, updateDateTime, description };

    return defaults;
  }
}
