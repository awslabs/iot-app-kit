import { WorkspaceOption } from './workspaceSelector/types';

export interface SearchFields {
  workspace: WorkspaceOption | null;
  searchQuery: string;
}
