import type { ReactNode } from 'react';

export type ResourceParameters<T> = readonly T[];

export type PageSize = number;

export type ResourceName = string;
export type PluralResourceName = string;

export type Resources<Resource> = readonly Resource[];

export type RequestError = Error | null | undefined;
export type RequestTimeout = number;

export type ResourceFieldId = string;
export type ResourceFieldName = string;
export type PluralResourceFieldName = string;
export type RenderTableResourceField<Resource> = (
  resource: Resource
) => string | ReactNode;
export type IsVisible = boolean;

export type IsResourceDisabled<Resource> = (resource: Resource) => boolean;

export type SelectedResources<Resource> = readonly Resource[];

export type ResourceFieldFilterOperator =
  | '='
  | '!='
  | '>'
  | '>='
  | '<'
  | '<='
  | ':'
  | '!:';

export type HasNextPage = boolean;
export type RequestIsLoading = boolean;

export type SelectionMode = 'single' | 'multi' | undefined;
export type OnSelectResource<Resource> = (resources: Resource[]) => void;

export type ResourceTableVariant = 'table';
export type ResourceDropDownVariant = 'drop-down';
export type ResourceExplorerVariant =
  | ResourceTableVariant
  | ResourceDropDownVariant;

export type IsTitleEnabled = boolean;
export type IsTableFilterEnabled = boolean;
export type IsTableUserSettingsEnabled = boolean;
export type IsTableSearchEnabled = boolean;

export type NextPage = () => void;

export type OnClickSearch = (searchStatement: string) => void;

export type ShouldPersistUserCustomization = boolean;
