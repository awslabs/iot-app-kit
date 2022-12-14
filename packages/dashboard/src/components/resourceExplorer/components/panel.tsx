import React from 'react';
import Table from '@cloudscape-design/components/table';
import Box from '@cloudscape-design/components/box';
import Icon from '@cloudscape-design/components/icon';
import Link from '@cloudscape-design/components/link';
import { AssetSummary } from '@aws-sdk/client-iotsitewise';

const PanelEmpty = () => (
  <Box textAlign="center" padding={{ bottom: 's' }} variant="p" color="inherit">
    No resources to display.
  </Box>
);

export interface IotResourceExplorerPanelProps {
  panelItems: AssetSummary[];
  handlePanelItemClick: (item: AssetSummary) => void;
}

export const IotResourceExplorerPanel = ({ panelItems, handlePanelItemClick }: IotResourceExplorerPanelProps) => {
  const handlePanelItemClickInner = (e: Event, item: AssetSummary) => {
    e.preventDefault();
    handlePanelItemClick(item);
  };

  const PanelCell = ({ item }: { item: AssetSummary }) => {
    if (item?.hierarchies?.length) {
      return (
        <Link href="#" onFollow={(e) => handlePanelItemClickInner(e, item)}>
          {item.name}
        </Link>
      );
    }
    return <span>{item.name}</span>;
  };

  const tableColumnDefinitions = [
    {
      id: 'drag',
      header: null,
      width: '45px',
      cell: () => <Icon name="expand" />,
    },
    {
      id: 'variable',
      header: 'Name',
      maxWidth: '100%',
      cell: (item: AssetSummary) => <PanelCell item={item} />,
    },
  ];

  return (
    <Table
      variant="embedded"
      columnDefinitions={tableColumnDefinitions}
      items={panelItems}
      trackBy="name"
      empty={<PanelEmpty />}
    />
  );
};
