import React from 'react';
import Table from '@cloudscape-design/components/table';
import { useQuery } from '@tanstack/react-query';
import { IoTTwinMakerClient, ListEntitiesCommand } from '@aws-sdk/client-iottwinmaker';
import { Header } from '@cloudscape-design/components';

const client = new IoTTwinMakerClient({
  region: 'us-east-1',
});

function useEntities(workspaceId: string) {
  return useQuery({
    queryKey: ['resources', 'twin maker', 'entities'],
    queryFn: async () => {
      const command = new ListEntitiesCommand({
        workspaceId,
        maxResults: 250,
      });
      const response = await client.send(command);

      return (
        response.entitySummaries?.map((entity) => ({
          arn: entity.arn,
          creationDateTime: entity.creationDateTime ?? new Date(),
          description: entity.description,
          entityId: entity.entityId,
          entityName: entity.entityName,
          hasChildEntities: entity.hasChildEntities,
          parentEntityId: entity.parentEntityId,
          updatedDateTime: entity.updateDateTime ?? new Date(),
        })) ?? []
      );
    },
  });
}

interface EntityExplorerProps {
  workspaceId: string;
}

export function EntityExplorer(props: EntityExplorerProps) {
  const query = useEntities(props.workspaceId);

  return (
    <Table
      items={query.data ?? []}
      header={<Header>Entities</Header>}
      columnDefinitions={[
        { id: 'arn', header: 'Arn', cell: (entity) => entity.arn },
        {
          id: 'creationDateTime',
          header: 'Creation Date',
          cell: (entity) => entity.creationDateTime.toLocaleString(),
        },
        {
          id: 'description',
          header: 'Description',
          cell: (entity) => entity.description,
        },
        {
          id: 'entityId',
          header: 'Entity Id',
          cell: (entity) => entity.entityId,
        },
        {
          id: 'entityName',
          header: 'Entity Name',
          cell: (entity) => entity.entityName,
        },
        {
          id: 'hasChildEntities',
          header: 'Has Child Entities',
          cell: (entity) => entity.hasChildEntities,
        },
        {
          id: 'parentEntityId',
          header: 'Parent Entity Id',
          cell: (entity) => entity.parentEntityId,
        },
        {
          id: 'updatedDateTime',
          header: 'Updated Date',
          cell: (entity) => entity.updatedDateTime.toLocaleString(),
        },
      ]}
    />
  );
}
