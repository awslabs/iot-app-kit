import { type IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import FormField from '@cloudscape-design/components/form-field';
import Select, { type SelectProps } from '@cloudscape-design/components/select';
import { OptionDefinition } from '@cloudscape-design/components/internal/components/option/interfaces';
import { type useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Controller, type Control, UseFormSetValue } from 'react-hook-form';
import { useLocalStorage } from 'react-use';

import { useWorkspaces } from './useWorkspaces';
import { WorkspaceOptionFactory } from './workspaceOptionFactory';
import type { SearchFields } from '../types';

type CloudscapeStatusType = NonNullable<SelectProps['statusType']>;
type TanstackStatusType = ReturnType<typeof useQuery>['status'];

export interface WorkspaceSelectorProps {
  control: Control<SearchFields>;
  client: IoTTwinMakerClient;
  setValue: UseFormSetValue<SearchFields>;
  OnGettingError: (isError: boolean) => void;
}

export const WorkspaceSelector = ({
  control,
  client,
  setValue,
  OnGettingError,
}: WorkspaceSelectorProps) => {
  const { workspaces, status } = useWorkspaces({ client });
  const workspaceOptions = createWorkspaceOptions(workspaces);
  const [storedWorkspace, setStoredWorkspace] =
    useLocalStorage<OptionDefinition | null>('storedWorkspace', null);

  useEffect(() => {
    OnGettingError(status === 'error');
    if (status === 'error') setStoredWorkspace(null);
  }, [status, OnGettingError, setStoredWorkspace]);

  useEffect(() => {
    if (workspaceOptions.length) {
      setValue('workspace', storedWorkspace || workspaceOptions[0]);
      const isStoredValueInOptions =
        storedWorkspace &&
        workspaceOptions.some(
          (option: OptionDefinition) => option.value === storedWorkspace.value
        );
      if (!isStoredValueInOptions) {
        setStoredWorkspace(workspaceOptions[0]);
        setValue('workspace', workspaceOptions[0]);
      }
    }
  }, [workspaceOptions, storedWorkspace, setValue, setStoredWorkspace]);

  const onChangeHandler = (
    detail: SelectProps.ChangeDetail,
    onChange: (...event: unknown[]) => void
  ) => {
    setStoredWorkspace(detail.selectedOption);
    onChange(detail.selectedOption);
  };

  return (
    <Controller
      control={control}
      name='workspace'
      rules={{ required: 'Workspace is required.' }}
      render={({ field, fieldState }) => (
        <FormField
          label='Workspace'
          description='Select a workspace to search for modeled data streams within.'
          errorText={fieldState.error?.message}
        >
          <Select
            disabled={status == 'error'}
            options={workspaceOptions}
            selectedOption={field.value}
            onChange={({ detail }) => onChangeHandler(detail, field.onChange)}
            placeholder='Select a workspace'
            loadingText='Loading workspaces...'
            errorText='Failed to load workspaces.'
            statusType={getStatusType(status)}
          />
        </FormField>
      )}
    />
  );
};

function createWorkspaceOptions(
  workspaces: NonNullable<ReturnType<typeof useWorkspaces>['workspaces']>
) {
  const workspaceOptionFactory = new WorkspaceOptionFactory();
  const workspaceOptions = workspaces.map(workspaceOptionFactory.create);

  return workspaceOptions;
}

function getStatusType(status: TanstackStatusType): CloudscapeStatusType {
  const statusMap = {
    error: 'error',
    success: 'finished',
    pending: 'loading',
  } satisfies Record<TanstackStatusType, CloudscapeStatusType>;

  return statusMap[status];
}
