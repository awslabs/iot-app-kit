import CloudscapeMultiSelect from '@cloudscape-design/components/multiselect';
import CloudscapeSelect, {
  type SelectProps as CloudscapeSelectProps,
} from '@cloudscape-design/components/select';
import type { ResourceDropDownProps } from '../../types/drop-down';

export function ResourceDropDown<Resource>({
  resourceName,
  pluralResourceName,
  resourceDefinition: {
    selectResourceId,
    renderResourceName,
    renderResourceDescription,
  },
  resources,
  isResourceDisabled,
  isLoadingResources,
  error,
  selectionMode,
  selectedResources,
  onSelectResource,
  isFilterEnabled,
}: ResourceDropDownProps<Resource>) {
  const sharedCloudscapeSelectProps = {
    options: resources.map((resource) => ({
      value: selectResourceId(resource),
      label: renderResourceName(resource),
      description: renderResourceDescription
        ? renderResourceDescription(resource)
        : undefined,
      disabled: isResourceDisabled(resource),
    })),

    statusType: error ? 'error' : isLoadingResources ? 'loading' : 'finished',
    empty: `No ${pluralResourceName.toLowerCase()}.`,
    errorText: error ? error.message : undefined,
    loadingText: `Loading ${pluralResourceName.toLowerCase()}...`,
    finishedText: `Finished loading ${pluralResourceName.toLowerCase()}.`,

    filteringType: isFilterEnabled ? 'auto' : 'none',
    filteringPlaceholder: `Filter ${pluralResourceName.toLowerCase()}`,
    filteringResultsText: (matchesCount, totalCount) =>
      `(${matchesCount}/${totalCount}) ${pluralResourceName.toLowerCase()} matched`,

    virtualScroll: resources.length > 500,
  } satisfies Partial<CloudscapeSelectProps>;

  const selectedOptions: NonNullable<
    CloudscapeSelectProps['selectedOption']
  >[] = selectedResources.map((resource) => ({
    value: selectResourceId(resource),
    label: renderResourceName(resource),
    description: renderResourceDescription
      ? renderResourceDescription(resource)
      : undefined,
    disabled: isResourceDisabled(resource),
  }));

  if (selectionMode === 'multi') {
    return (
      <CloudscapeMultiSelect
        {...sharedCloudscapeSelectProps}
        placeholder={`Select ${pluralResourceName.toLowerCase()}`}
        selectedOptions={selectedOptions}
        onChange={({ detail: { selectedOptions: updatedSelectedOptions } }) => {
          const updatedSelectedResources = updatedSelectedOptions
            .map((option) => {
              return resources.find((resource) => {
                if (selectResourceId(resource) === option.value) {
                  return resource;
                }
              });
            })
            .filter((resource): resource is Resource => resource !== undefined);

          onSelectResource(updatedSelectedResources);
        }}
      />
    );
  } else {
    return (
      <CloudscapeSelect
        {...sharedCloudscapeSelectProps}
        placeholder={`Select ${resourceName.toLowerCase()}`}
        selectedOption={selectedOptions.at(0) ?? null}
        onChange={({ detail: { selectedOption: updatedSelectedOption } }) => {
          if (selectionMode === undefined) return;

          const updatedSelectedResource = resources.find((resource) => {
            if (selectResourceId(resource) === updatedSelectedOption.value) {
              return resource;
            }
          });

          onSelectResource(
            updatedSelectedResource ? [updatedSelectedResource] : []
          );
        }}
      />
    );
  }
}
