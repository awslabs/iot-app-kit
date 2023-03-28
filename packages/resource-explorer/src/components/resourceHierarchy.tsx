import Icon from '@cloudscape-design/components/icon';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';

export function ResourceHierarchy() {
  return (
    <SpaceBetween size="xs" direction="horizontal">
      <Link>Asset</Link>
      <Icon name="angle-right" variant="subtle" />
      <Link>Child</Link>
    </SpaceBetween>
  )
}