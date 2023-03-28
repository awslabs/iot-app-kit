import Header from '@cloudscape-design/components/header';
import { ResourceHierarchy } from './components/resourceHierarchy';

export function ResourceExplorer() {
  return (
    <>
      <Header variant='h2'>Resource Explorer</Header>
      <ResourceHierarchy />
    </>
  )
}