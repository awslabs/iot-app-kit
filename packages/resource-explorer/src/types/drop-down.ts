import type {
  IsResourceDisabled,
  OnSelectResource,
  PluralResourceName,
  RequestError,
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

  isLoadingResources?: boolean;
  error: RequestError;

  selectionMode: SelectionMode;
  selectedResources: SelectedResources<Resource>;
  onSelectResource: OnSelectResource<Resource>;

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
