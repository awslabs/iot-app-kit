import type { CamelCase, PascalCase } from 'type-fest';
import type { Plural } from './helpers';

export type ResourceSelector<Response, Resource> = (
  response: Response
) => Resource[];

export type DefaultResourceName = 'resource';
export type AssetModelName = 'asset model';
export type AssetName = 'asset';
export type AssetPropertyName = 'asset property';
export type TimeSeriesName = 'time series';

export type ResourceProps<
  Resource,
  ResourceName extends string = DefaultResourceName
> = OnSelectResourceProp<Resource, ResourceName> &
  SelectedResourcesProp<Resource, ResourceName> &
  IsResourceDisabledProp<Resource, ResourceName> &
  IsResourceHiddenProp<Resource, ResourceName>;

export type ResourcesProp<
  Resource,
  ResourceName extends Readonly<string> = DefaultResourceName
> = {
  [Key in `${Plural<CamelCase<ResourceName>>}`]: Resource[];
};

type OnSelectResource<Resource> = (resources: Resource[]) => void;
type OnSelectResourceProp<
  Resource,
  ResourceName extends string = DefaultResourceName
> = {
  /**
   * Specify a callback to be called when resource selection state changes.
   *
   * @defaultValue `undefined` (selection state is internally managed)
   */
  [Key in `onSelect${PascalCase<ResourceName>}`]?: OnSelectResource<Resource>;
};

type SelectedResources<Resource> = Resource[];
type SelectedResourcesProp<
  Resource,
  ResourceName extends string = DefaultResourceName
> = {
  /**
   * Specify the selected resources.
   *
   * @defaultValue `undefined` (selection state is internally managed)
   */
  [Key in `selected${Plural<
    PascalCase<ResourceName>
  >}`]?: SelectedResources<Resource>;
};

type ResourceGuard<Resource> = (resource: Resource) => boolean;

type IsResourceDisabledProp<
  Resource,
  ResourceName extends string = DefaultResourceName
> = {
  /**
   * Specify to disable selection of a given resource.
   *
   * @defaultValue `undefined` (all resources are enabled)
   */
  [Key in `is${PascalCase<ResourceName>}Disabled`]?: ResourceGuard<Resource>;
};

// TODO: Validate if we can do this easily or remove.
type IsResourceHiddenProp<
  Resource,
  ResourceName extends string = DefaultResourceName
> = {
  /**
   * Specify to hide a given resource.
   *
   * @defaultValue `undefined` (all resources are visible)
   */
  [Key in `is${PascalCase<ResourceName>}Hidden`]?: ResourceGuard<Resource>;
};
