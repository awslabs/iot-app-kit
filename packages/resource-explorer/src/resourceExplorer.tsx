import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { ResourceHierarchy } from './components/resourceHierarchy';
import { ResourceFilter } from './components/resourceFilter';
import { ResourceList } from './components/resourceList';

export function ResourceExplorer() {
  return (
    <>
    <SpaceBetween size="s">
      <Header variant='h2'>Resource explorer</Header>
      <SpaceBetween size="xs">
        <ResourceHierarchy />
        <ResourceFilter />
       </SpaceBetween>
        <ResourceList />
        </SpaceBetween>
    </>
  )
}