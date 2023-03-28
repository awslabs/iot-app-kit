import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { ResourceHierarchy } from './components/resourceHierarchy';
import { ResourceFilter } from './components/resourceFilter';

export function ResourceExplorer() {
  return (
    <>
      <Header variant='h2'>Resource explorer</Header>
      <SpaceBetween size="s">
        <ResourceHierarchy />
        <ResourceFilter />
      </SpaceBetween>
    </>
  )
}