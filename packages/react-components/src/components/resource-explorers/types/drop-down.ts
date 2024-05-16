import {
  HasNextPage,
  IsResourceDisabled,
  NextPage,
  OnSelectResource,
  PluralResourceName,
  RequestError,
  RequestIsLoading,
  ResourceName,
  Resources,
  SelectedResources,
  SelectionMode,
} from './common';

export interface ResourceDropDownProps<Resource> {
  resourceName: ResourceName;
  pluralResourceName: PluralResourceName;
  resourceDefinition: DropDownResourceDefinition<Resource>;
  resources: Resources<Resource>;
  isResourceDisabled: IsResourceDisabled<Resource>;

  isLoading: RequestIsLoading;
  error: RequestError;

  selectionMode: SelectionMode;
  selectedResources: SelectedResources<Resource>;
  onSelectResource: OnSelectResource<Resource>;

  hasNextPage: HasNextPage;
  onScrollNextPage: NextPage;

  isFilterEnabled?: IsDropDownFilterEnabled;
}

export interface DropDownResourceDefinition<Resource> {
  selectResourceId: (resource: Resource) => string;
  renderResourceName: (resource: Resource) => string;
  renderResourceDescription?: (resource: Resource) => string;
}

export type IsDropDownFilterEnabled = boolean;

export interface ResourceDropDownSettings {
  isFilterEnabled?: IsDropDownFilterEnabled;
}
