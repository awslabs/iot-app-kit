import CloudscapeBreadcrumbGroup, {
  type BreadcrumbGroupProps as CloudscapeBreadcrumbGroupProps,
} from '@cloudscape-design/components/breadcrumb-group';
import React from 'react';

import type { ResourcePathItem } from './types';

export interface ResourceRelationshipPathProps {
  resourcePath: ResourcePathItem[];
  onClickResourcePathItem: (resourcePathItem: ResourcePathItem) => void;
}

export function ResourceRelationshipPath({
  resourcePath,
  onClickResourcePathItem,
}: ResourceRelationshipPathProps) {
  const cloudscapeBreadcrumbGroupItems =
    resourcePathToCloudscapeBreadcrumbGroupItems(resourcePath);

  return (
    <CloudscapeBreadcrumbGroup
      items={cloudscapeBreadcrumbGroupItems}
      onClick={(event): void => {
        // Prevent acting as a real link.
        event.preventDefault();

        const { href: id, text: name } = event.detail;
        onClickResourcePathItem({ id, name });
      }}
      ariaLabel='Resource relationship path'
      expandAriaLabel='Show more'
    />
  );
}

type CloudscapeBreadcrumbGroupItem =
  CloudscapeBreadcrumbGroupProps['items'][number];

function resourcePathToCloudscapeBreadcrumbGroupItems(
  resourcePath: ResourcePathItem[]
): CloudscapeBreadcrumbGroupItem[] {
  return resourcePath.map(({ id: href, name: text }) => ({ href, text }));
}
