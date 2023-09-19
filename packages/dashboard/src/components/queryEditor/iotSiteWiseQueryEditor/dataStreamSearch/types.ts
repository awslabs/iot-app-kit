import { WorkspaceOption } from './dataStreamSearchForm/workspaceSelector/types';

export interface SearchFields {
  workspace: WorkspaceOption | null;
  searchQuery: string;
}
