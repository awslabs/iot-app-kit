import React, { Dispatch, SetStateAction } from 'react';
import { AssetSummary } from '@aws-sdk/client-iotsitewise';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';

export const HIERARCHY_ROOT_ID = 'HIERARCHY_ROOT_ID';

interface BreadcrumbEvent {
  preventDefault: () => void;
  detail: {
    item: AssetSummary;
  };
}

interface BreadcrumbItem extends AssetSummary {
  text: string;
  href: string;
}

const rootCrumb = { name: 'Dashboard', id: HIERARCHY_ROOT_ID } as AssetSummary;

export interface IotResourceExplorerBreadcrumbsProps {
  handleCrumbClick: (item: AssetSummary) => void;
  crumbs: AssetSummary[];
  setCrumbs: Dispatch<SetStateAction<AssetSummary[]>>;
}

export const IotResourceExplorerBreadcrumbs = ({
  handleCrumbClick,
  crumbs,
  setCrumbs,
}: IotResourceExplorerBreadcrumbsProps) => {
  const handleCrumbClickInner = (event: BreadcrumbEvent) => {
    event.preventDefault();
    const {
      detail: { item },
    } = event;
    const { id } = item as AssetSummary;
    const crumbIndex = crumbs.findIndex((crumb) => crumb.id === id);
    handleCrumbClick(item);
    if (crumbIndex === 0) {
      const nextCrumbs = [item];
      setCrumbs(nextCrumbs);
      return;
    } else {
      const nextCrumbs = crumbs.slice(0, crumbIndex + 1);
      setCrumbs(nextCrumbs);
    }
  };

  const shownCrumbs = [rootCrumb, ...crumbs].map((crumb) => {
    const item = structuredClone(crumb) as BreadcrumbItem;
    item.text = item.name || '';
    item.href = '';
    return item;
  });

  return <BreadcrumbGroup items={shownCrumbs} ariaLabel="Breadcrumbs" onFollow={handleCrumbClickInner} />;
};
